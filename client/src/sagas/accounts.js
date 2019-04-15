import { all, put, call, takeEvery, select } from 'redux-saga/effects'

import * as actions from 'actions/accounts'
import {tryTakeEvery} from './utils'
import {getAddress, getNetworkType} from 'selectors/network'
import {CHECK_ACCOUNT_CHANGED} from 'actions/network'
import {TRANSFER_TOKEN, MINT_TOKEN, BURN_TOKEN} from 'actions/token'
import {fetchTokensByAccount} from 'sagas/token'
import web3 from 'services/web3'
import {getContract} from 'services/contract'
import {getAccountAddress} from 'selectors/accounts'

function * balanceOfToken ({tokenAddress, accountAddress, options}) {
  const basicTokenContract = getContract({abiName: 'BasicToken', address: tokenAddress, options})
  const balanceOf = yield call(basicTokenContract.methods.balanceOf(accountAddress).call)

  yield put({type: actions.BALANCE_OF_TOKEN.SUCCESS,
    tokenAddress,
    accountAddress,
    response: {
      balanceOf
    }}
  )
}

function * balanceOfNative ({accountAddress}) {
  const balanceOfNative = yield call(web3.eth.getBalance, accountAddress)

  yield put({type: actions.BALANCE_OF_NATIVE.SUCCESS,
    accountAddress,
    response: {
      balanceOfNative
    }})
}

function * balanceOfCln ({accountAddress}) {
  const networkType = yield select(getNetworkType)
  if (networkType === 'fuse') {
    yield call(balanceOfNative, {accountAddress})
  } else {
    const tokenAddress = yield select(getAddress, 'ColuLocalNetwork')
    yield call(balanceOfToken, {tokenAddress, accountAddress})
  }
}

function * fetchBalances ({accountAddress, tokens}) {
  for (let token of tokens) {
    yield put(actions.balanceOfToken(token.address, accountAddress))
  }
}

function * fetchTokensWithBalances ({accountAddress}) {
  const tokens = yield call(fetchTokensByAccount, {accountAddress, entity: 'tokens'})
  yield call(fetchBalances, {accountAddress, tokens})
}

function * watchAccountChanged ({response}) {
  yield put(actions.balanceOfCln(response.accountAddress))
}

function * watchTransfers ({response}) {
  const accountAddress = yield select(getAccountAddress)
  yield put(actions.balanceOfToken(response.tokenAddress, accountAddress))
}

function * watchBurn ({response}) {
  const accountAddress = yield select(getAccountAddress)
  yield put(actions.balanceOfToken(response.tokenAddress, accountAddress))
}

function * watchMint ({response}) {
  const accountAddress = yield select(getAccountAddress)
  yield put(actions.balanceOfToken(response.tokenAddress, accountAddress))
}

export default function * accountsSaga () {
  yield all([
    tryTakeEvery(actions.BALANCE_OF_TOKEN, balanceOfToken),
    tryTakeEvery(actions.BALANCE_OF_NATIVE, balanceOfNative),
    tryTakeEvery(actions.BALANCE_OF_CLN, balanceOfCln),
    takeEvery(CHECK_ACCOUNT_CHANGED.SUCCESS, watchAccountChanged),
    takeEvery(TRANSFER_TOKEN.SUCCESS, watchTransfers),
    takeEvery(BURN_TOKEN.SUCCESS, watchBurn),
    takeEvery(MINT_TOKEN.SUCCESS, watchMint),
    tryTakeEvery(actions.FETCH_BALANCES, fetchBalances, 1),
    tryTakeEvery(actions.FETCH_TOKENS_WITH_BALANCES, fetchTokensWithBalances, 1)
  ])
}
