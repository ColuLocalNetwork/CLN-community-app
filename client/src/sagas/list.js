import { all } from 'redux-saga/effects'
import { contract } from 'osseus-wallet'

import * as actions from 'actions/list'
import {tryTakeEvery} from './utils'
import SimpleListBytecode from 'constants/bytecode/SimpleList'

export function * createList () {
  debugger
  const SimpleListContract = contract.getContract({abiName: 'SimpleList'})
  const receipt = yield SimpleListContract.deploy({
    data: SimpleListBytecode
  })
  console.log(receipt)
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_LIST, createList, 1)
  ])
}
