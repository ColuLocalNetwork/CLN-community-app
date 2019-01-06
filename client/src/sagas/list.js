import { all, call, put, select } from 'redux-saga/effects'
import { contract } from 'osseus-wallet'

import * as actions from 'actions/list'
import {tryTakeEvery, apiCall} from './utils'
import {getAccountAddress} from 'selectors/accounts'
import {getAddresses} from 'selectors/network'
// import {processReceipt} from 'services/api'
import {createMetadata} from 'sagas/metadata'
const simpleListAddress = '0xa2f973B953471bB656b1889BB65ee70735972a28'

export function * createList ({tokenAddress}) {
  const accountAddress = yield select(getAccountAddress)
  const addresses = yield select(getAddresses)
  const SimpleListFactoryContract = contract.getContract({abiName: 'SimpleListFactory',
    address: addresses.SimpleListFactory
  })

  const receipt = yield SimpleListFactoryContract.methods.createSimpleList(tokenAddress).send({
    from: accountAddress
  })
  // yield apiCall(processReceipt, receipt)

  return receipt
}

export function * addEntity ({data}) {
  const accountAddress = yield select(getAccountAddress)
  const SimpleListContract = contract.getContract({abiName: 'SimpleList',
    address: simpleListAddress
  })

  const {hash} = yield call(createMetadata, {metadata: data})

  const receipt = yield SimpleListContract.methods.addEntity(hash).send({
    from: accountAddress
  })
  return receipt

  // console.log(yield SimpleListContract.methods.count().call())
  // console.log(yield SimpleListContract.methods.getEntity(0).call())
}

export function * fetchEntities ({page = 1}) {
  const pageSize = 10
  const SimpleListContract = contract.getContract({abiName: 'SimpleList',
    address: simpleListAddress
  })

  const count = yield SimpleListContract.methods.count().call()
  // const start = Math.max((page -1) * pageSize, count)
  const start = 0
  const end = Math.min(page * pageSize, count)

  const promises = []
  for (let i = start; i < end; i++) {
    promises.push(SimpleListContract.methods.getEntity(i).call())
  }

  const entities = yield all(promises)
  console.log(entities)
  yield put({type: actions.FETCH_ENTITIES.SUCCESS,
    response: {
      entities
    }})
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_LIST, createList, 1),
    tryTakeEvery(actions.ADD_ENTITY, addEntity, 1),
    tryTakeEvery(actions.FETCH_ENTITIES, fetchEntities, 1)
  ])
}
