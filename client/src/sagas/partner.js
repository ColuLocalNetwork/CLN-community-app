import { all } from 'redux-saga/effects'

import {tryTakeEvery, createFetch} from './utils'
import * as actions from 'actions/token'
import * as api from 'services/api/partner'

const fetchPartners = createFetch(actions.entityName, actions.FETCH_PARTNERS, api.fetchPartners)

export default function * tokenSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_PARTNERS, fetchPartners, 1)
  ])
}
