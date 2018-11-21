import { all, put, call, takeEvery, select } from 'redux-saga/effects'
import { contract } from 'osseus-wallet'

import * as actions from 'actions/accounts'
import {tryTakeEvery} from './utils'
import {getClnAddress} from 'selectors/network'
import {CHECK_ACCOUNT_CHANGED} from 'actions/network'

function * balanceOf ({tokenAddress, accountAddress, blockNumber}) {
  const ColuLocalNetworkContract = contract.getContract({abiName: 'ColuLocalCurrency', address: tokenAddress})
  const balanceOf = yield call(ColuLocalNetworkContract.methods.balanceOf(accountAddress).call, null, blockNumber)

  yield put({type: actions.BALANCE_OF.SUCCESS,
    tokenAddress,
    accountAddress,
    response: {
      balanceOf
    }})
}

export function * watchAccountChanged ({response}) {
  const clnAddress = yield select(getClnAddress)
  yield put(actions.balanceOf(clnAddress, response.accountAddress))
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.BALANCE_OF, balanceOf),
    takeEvery(CHECK_ACCOUNT_CHANGED.SUCCESS, watchAccountChanged)
  ])
}
