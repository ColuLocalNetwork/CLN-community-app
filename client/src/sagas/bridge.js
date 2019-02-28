import { all, call, put, select } from 'redux-saga/effects'

import {tryTakeEvery} from './utils'
import * as actions from 'actions/bridge'

export function * fetchHomeToken ({}) {
  
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_HOME_TOKEN, fetchHomeToken, 1)

  ])
}
