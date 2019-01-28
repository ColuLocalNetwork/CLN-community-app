import { all, call, put, select } from 'redux-saga/effects'
import keyBy from 'lodash/keyBy'

import {apiCall, createEntityPut, tryTakeEvery} from './utils'
import * as actions from 'actions/token'
import * as api from 'services/api/partner'

const entityPut = createEntityPut(actions.entityName)

function * fetchPartners ({page = 1}) {
  const response = yield apiCall(api.fetchPartners, {page})
  const {data, ...metadata} = response

  const entities = keyBy(data, 'address')
  const result = Object.keys(entities)

  yield entityPut({type: actions.FETCH_PARTNERS.SUCCESS,
    response: {
      entities,
      result,
      metadata
    }})
  return data
}

export default function * tokenSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_PARTNERS, fetchPartners, 1)
  ])
}
