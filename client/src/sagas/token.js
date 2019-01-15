import { all, put, select } from 'redux-saga/effects'
import { contract } from 'osseus-wallet'
import {getAddresses} from 'selectors/network'

import * as actions from 'actions/token'
import {transactionPending, transactionFailed, transactionSucceeded} from 'actions/utils'
import {tryTakeEvery} from './utils'
import {getAccountAddress} from 'selectors/accounts'

export function * createToken ({name, symbol, totalSupply, tokenURI}) {
  const addresses = yield select(getAddresses)
  const TokenFactoryContract = contract.getContract({abiName: 'TokenFactory',
    address: addresses.TokenFactory
  })
  const accountAddress = yield select(getAccountAddress)

  const createTokenPromise = TokenFactoryContract.methods.createToken(
    name,
    symbol,
    totalSupply,
    tokenURI
  ).send({
    from: accountAddress
  })

  const transactionHash = yield new Promise((resolve, reject) => {
    createTokenPromise.on('transactionHash', (transactionHash) =>
      resolve(transactionHash)
    )
    createTokenPromise.on('error', (error) =>
      reject(error)
    )
  })

  yield put(transactionPending(actions.CREATE_TOKEN, transactionHash))

  const receipt = yield createTokenPromise

  if (!Number(receipt.status)) {
    yield put(transactionFailed(actions.CREATE_TOKEN, receipt))
    return receipt
  }

  yield put(transactionSucceeded(actions.CREATE_TOKEN, receipt))

  return receipt
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_TOKEN, createToken, 1)
  ])
}
