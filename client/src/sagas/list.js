import { all, select } from 'redux-saga/effects'
// import { contract } from 'osseus-wallet'

import * as actions from 'actions/list'
import {tryTakeEvery, apiCall} from './utils'
import SimpleListBytecode from 'constants/bytecode/SimpleList'
import SimpleListAbi from 'constants/abi/SimpleList'
import {getAccountAddress} from 'selectors/accounts'
import web3 from 'services/web3'
import {processReceipt} from 'services/api'

export function * createList () {
  const SimpleListContract = new web3.eth.Contract(SimpleListAbi)
  const accountAddress = yield select(getAccountAddress)
  const receipt = yield web3.eth.getTransactionReceipt('0x5000f67ab6c501a5af345db96bd77c08a62334cbbc509e1fb415a0081ee30bff')
  // const receipt = yield SimpleListContract.deploy({
  //   data: SimpleListBytecode
  // }).send({
  //   from: accountAddress
  // })

  console.log(receipt)
  yield apiCall(processReceipt, receipt)

  return receipt
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_LIST, createList, 1)
  ])
}
