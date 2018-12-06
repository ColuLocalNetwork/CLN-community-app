import { all, put, call, select } from 'redux-saga/effects'

import {createEntityPut, tryTakeEvery, apiCall} from './utils'
import * as actions from 'actions/communities'
import {
  processReceipt,
  fetchCommunity,
  fetchCommunities as fetchCommunitiesApi,
  fetchCommunitiesByOwner as fetchCommunitiesByOwnerApi,
  fetchDashboardStatisticsUser,
  fetchDashboardStatisticsAdmin
} from 'services/api'
import {fetchMarketMakerData} from 'actions/marketMaker'
import {fetchMetadata} from 'actions/metadata'
import {createMetadata} from 'sagas/metadata'
import {createCurrency} from 'sagas/issuance'
import {getAccountAddress} from 'selectors/accounts'
import {getClnAddress} from 'selectors/network'
import { contract } from 'osseus-wallet'
import keyBy from 'lodash/keyBy'

const entityPut = createEntityPut(actions.entityName)

function * fetchDashboardStatistics ({tokenAddress}) {
  const userResponse = yield apiCall(fetchDashboardStatisticsUser, tokenAddress)
  const adminResponse = yield apiCall(fetchDashboardStatisticsAdmin, tokenAddress)
  const user = userResponse.data
  const admin = adminResponse.data

  yield put({
    type: actions.FETCH_COMMUNITY_DASHBOARD_STATISTICS.SUCCESS,
    response: {
      user,
      admin
    }
  })
}

function * fetchCommunityWithAdditionalData ({tokenAddress}) {
  const response = yield apiCall(fetchCommunity, tokenAddress)
  const community = response.data

  yield put(fetchMetadata(community.tokenURI, tokenAddress))
  yield put(fetchMarketMakerData(tokenAddress, community.mmAddress))

  yield put({
    type: actions.FETCH_COMMUNITY_DASHBOARD.SUCCESS,
    response: {
      tokenAddress: tokenAddress,
      community
    }
  })
}

function * fetchCommunityAdditionalData ({tokenAddress}) {
  const token = yield select(state => state.tokens[tokenAddress])

  yield put(fetchMetadata(token.tokenURI, tokenAddress))
  yield put(fetchMarketMakerData(tokenAddress, token.mmAddress))

  yield entityPut({type: actions.FETCH_COMMUNITY.SUCCESS, tokenAddress})
  return token
}

const manipulateCommunity = (community) => ({
  address: community.ccAddress,
  name: community.name,
  symbol: community.symbol,
  tokenURI: community.tokenURI,
  owner: community.owner,
  mmAddress: community.mmAddress,
  totalSupply: community.totalSupply
})

function * fetchCommunities ({page = 1}) {
  const response = yield apiCall(fetchCommunitiesApi, page)
  const {data, ...metadata} = response

  const communities = data.map(manipulateCommunity)
  const entities = keyBy(communities, 'address')
  const result = communities.map(community => community.address)

  yield entityPut({type: actions.FETCH_COMMUNITIES.SUCCESS,
    response: {
      entities,
      result,
      metadata
    }})

  for (let community of communities) {
    yield put({
      type: actions.FETCH_COMMUNITY.REQUEST,
      tokenAddress: community.address
    })
  }

  return communities
}

function * fetchCommunitiesByOwner ({owner}) {
  const response = yield apiCall(fetchCommunitiesByOwnerApi, owner)
  const {data, ...metadata} = response

  const communities = data.map(manipulateCommunity)
  const entities = keyBy(communities, 'address')
  const result = communities.map(community => community.address)

  yield entityPut({type: actions.FETCH_COMMUNITIES_BY_OWNER.SUCCESS,
    response: {
      entities,
      result,
      metadata
    }})

  for (let community of communities) {
    yield put({
      type: actions.FETCH_COMMUNITY.REQUEST,
      tokenAddress: community.address
    })
  }

  return communities
}

function * fetchClnContract () {
  const tokenAddress = yield select(getClnAddress)
  const ColuLocalNetworkContract = contract.getContract({abiName: 'ColuLocalNetwork', address: tokenAddress})

  const calls = {
    name: call(ColuLocalNetworkContract.methods.name().call),
    symbol: call(ColuLocalNetworkContract.methods.symbol().call),
    totalSupply: call(ColuLocalNetworkContract.methods.totalSupply().call),
    owner: call(ColuLocalNetworkContract.methods.owner().call)
  }

  const response = yield all(calls)
  response.isLocalCurrency = false
  response.address = tokenAddress

  yield entityPut({type: actions.FETCH_CLN_CONTRACT.SUCCESS,
    tokenAddress,
    response
  })
}

function * issueCommunity ({communityMetadata, currencyData}) {
  const {hash, protocol} = yield call(createMetadata, {metadata: communityMetadata})
  const tokenURI = `${protocol}://${hash}`
  const receipt = yield call(createCurrency, {...currencyData, tokenURI})

  yield apiCall(processReceipt, receipt)

  const owner = yield select(getAccountAddress)
  yield put({
    type: actions.FETCH_COMMUNITIES_BY_OWNER.REQUEST,
    owner
  })

  const tokenAddress = receipt.events.TokenCreated.returnValues.token

  yield entityPut({
    type: actions.ISSUE_COMMUNITY.SUCCESS,
    tokenAddress
  })
}

export default function * communitiesSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_CLN_CONTRACT, fetchClnContract),
    tryTakeEvery(actions.FETCH_COMMUNITY_DASHBOARD, fetchCommunityWithAdditionalData),
    tryTakeEvery(actions.FETCH_COMMUNITY_DASHBOARD_STATISTICS, fetchDashboardStatistics),
    tryTakeEvery(actions.FETCH_COMMUNITY, fetchCommunityAdditionalData),
    tryTakeEvery(actions.FETCH_COMMUNITIES, fetchCommunities),
    tryTakeEvery(actions.FETCH_COMMUNITIES_BY_OWNER, fetchCommunitiesByOwner),
    tryTakeEvery(actions.ISSUE_COMMUNITY, issueCommunity, 1)
  ])
}
