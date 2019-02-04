import { all } from 'redux-saga/effects'

import {tryTakeEvery} from './utils'
import * as actions from 'actions/auth'
import * as api from 'services/api/auth'

function * login () {
  console.log('login')
}

export default function * partnerSaga () {
  yield all([
    tryTakeEvery(actions.LOGIN, login, 1)
  ])
}
