import { all, put, select } from 'redux-saga/effects'

import {apiCall, tryTakeEvery, transactionFlow} from './utils'
import {getContract} from 'services/contract'
import {zeroAddressToNull} from 'utils/web3'
import {getAccountAddress} from 'selectors/accounts'
import * as actions from 'actions/bridge'
import * as api from 'services/api/token'

export function * fetchHomeToken ({foreignTokenAddress}) {
  const contractAddress = yield select(state => state.network.addresses.fuse.BridgeMapper)
  const options = {networkBridge: 'home'}
  const bridgeMapperContract = getContract({abiName: 'BridgeMapper', address: contractAddress, options})
  const homeTokenAddress = yield bridgeMapperContract.methods.homeTokenByForeignToken(foreignTokenAddress).call()

  yield put({
    type: actions.FETCH_HOME_TOKEN.SUCCESS,
    response: {
      homeTokenAddress: zeroAddressToNull(homeTokenAddress)
    }
  })
}

export function * fetchHomeBridge ({foreignTokenAddress}) {
  const contractAddress = yield select(state => state.network.addresses.fuse.BridgeMapper)
  const options = {networkBridge: 'home'}
  const bridgeMapperContract = getContract({abiName: 'BridgeMapper', address: contractAddress, options})
  const homeBridgeAddress = yield bridgeMapperContract.methods.homeBridgeByForeignToken(foreignTokenAddress).call()

  yield put({
    type: actions.FETCH_HOME_BRIDGE.SUCCESS,
    response: {
      homeBridgeAddress: zeroAddressToNull(homeBridgeAddress)
    }
  })
}

export function * fetchForeignBridge ({foreignTokenAddress}) {
  const contractAddress = yield select(state => state.network.addresses.fuse.BridgeMapper)
  const options = {networkBridge: 'home'}
  const bridgeMapperContract = getContract({abiName: 'BridgeMapper', address: contractAddress, options})
  const foreignBridgeAddress = yield bridgeMapperContract.methods.foreignBridgeByForeignToken(foreignTokenAddress).call()

  yield put({
    type: actions.FETCH_HOME_BRIDGE.SUCCESS,
    response: {
      foreignBridgeAddress: zeroAddressToNull(foreignBridgeAddress)
    }
  })
}

export function * deployBridge ({foreignTokenAddress}) {
  const response = yield apiCall(api.deployBridge, {foreignTokenAddress})

  yield put({
    type: actions.DEPLOY_BRIDGE.SUCCESS,
    response: response.data
  })
}

function * transferToHome ({foreignTokenAddress, foreignBridgeAddress, value}) {
  const accountAddress = yield select(getAccountAddress)
  const basicToken = getContract({abiName: 'BasicToken', address: foreignTokenAddress})

  const transactionPromise = basicToken.methods.transfer(foreignBridgeAddress, value).send({
    from: accountAddress
  })
  // console.log(p)?
  // debugger

  yield transactionFlow({transactionPromise, action: actions.TRANSFER_TO_HOME})

  const receipt = yield new Promise((resolve, reject) => {
    const emitter = transactionPromise.on('confirmation', (confirmationNumber, receipt) => {
      console.log(confirmationNumber)
      if (confirmationNumber >= CONFIG.web3.bridge.confirmations.home) {
        emitter.off('confirmation')
        resolve(receipt)
      }
    })
  })

  yield put({type: 'TRANSFER_TO_HOME_CONFIRMED', response: {receipt}})
}

function * transferToForeign ({homeTokenAddress, homeBridgeAddress, value}) {
  const accountAddress = yield select(getAccountAddress)
  const basicToken = getContract({abiName: 'BasicToken', address: homeTokenAddress})

  const transactionPromise = basicToken.methods.transfer(homeBridgeAddress, value).send({
    from: accountAddress
  })

  yield transactionFlow({transactionPromise, action: actions.TRANSFER_TO_FOREIGN})
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_HOME_TOKEN, fetchHomeToken, 1),
    tryTakeEvery(actions.FETCH_HOME_BRIDGE, fetchHomeBridge, 1),
    tryTakeEvery(actions.FETCH_FOREIGN_BRIDGE, fetchForeignBridge, 1),
    tryTakeEvery(actions.DEPLOY_BRIDGE, deployBridge, 1),
    tryTakeEvery(actions.TRANSFER_TO_HOME, transferToHome, 1),
    tryTakeEvery(actions.TRANSFER_TO_FOREIGN, transferToForeign, 1)
  ])
}
