import { all, put, call, select } from 'redux-saga/effects'

import {createEntityPut, tryTakeEvery, apiCall} from './utils'
import * as actions from 'actions/communities'
import * as api from 'services/api/communities'
import {processReceipt} from 'services/api/misc'
import {fetchMetadata} from 'actions/metadata'
import {createMetadata} from 'sagas/metadata'
import {createToken} from 'sagas/token'
import {getAccountAddress} from 'selectors/accounts'

const entityPut = createEntityPut(actions.entityName)

function * fetchCommunityStatistics ({tokenAddress, activityType, interval}) {
  const response = yield apiCall(api.fetchCommunityStatistics, tokenAddress, activityType, interval)

  const {data} = response

  yield put({
    type: actions.FETCH_COMMUNITY_STATISTICS.SUCCESS,
    response: {
      [activityType]: data
    }
  })
}

function * fetchCommunityWithData ({tokenAddress}) {
  const response = yield apiCall(api.fetchCommunity, tokenAddress)
  const community = response.data

  yield put(fetchMetadata(community.tokenURI, tokenAddress))

  yield entityPut({
    type: actions.FETCH_COMMUNITY_WITH_DATA.SUCCESS,
    tokenAddress,
    response: community
  })
}

function * issueCommunity ({communityMetadata, currencyData}) {
  const {hash, protocol} = yield call(createMetadata, {metadata: communityMetadata})
  const tokenURI = `${protocol}://${hash}`
  const receipt = yield call(createToken, {...currencyData, tokenURI})

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
    tryTakeEvery(actions.FETCH_COMMUNITY_WITH_DATA, fetchCommunityWithData, 1),
    tryTakeEvery(actions.FETCH_COMMUNITY_STATISTICS, fetchCommunityStatistics, 1),
    tryTakeEvery(actions.ISSUE_COMMUNITY, issueCommunity, 1)
  ])
}
