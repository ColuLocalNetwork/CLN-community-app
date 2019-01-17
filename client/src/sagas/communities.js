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

export default function * communitiesSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_COMMUNITY_WITH_DATA, fetchCommunityWithData, 1),
    tryTakeEvery(actions.FETCH_COMMUNITY_STATISTICS, fetchCommunityStatistics, 1)
  ])
}
