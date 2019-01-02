import { all, select } from 'redux-saga/effects'
// import { contract } from 'osseus-wallet'

import * as actions from 'actions/list'
import {tryTakeEvery} from './utils'
import SimpleListBytecode from 'constants/bytecode/SimpleList'
import SimpleListAbi from 'constants/abi/SimpleList'
import {getAccountAddress} from 'selectors/accounts'
import web3 from 'services/web3'

export function * createList () {
  const SimpleListContract = new web3.eth.Contract(SimpleListAbi)
  const accountAddress = yield select(getAccountAddress)

  const receipt = yield SimpleListContract.deploy({
    data: SimpleListBytecode
  }).send({
    from: accountAddress
  })
  console.log(receipt)
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_LIST, createList, 1)
  ])
}
