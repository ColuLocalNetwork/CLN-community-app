import { all, call, put, select } from 'redux-saga/effects'
import { contract } from 'osseus-wallet'

import * as actions from 'actions/list'
import {createEntityPut, tryTakeEvery} from './utils'
import {getAccountAddress} from 'selectors/accounts'
import {getAddresses} from 'selectors/network'
import {createMetadata} from 'sagas/metadata'
import {fetchMetadata} from 'actions/metadata'
import keyBy from 'lodash/keyBy'

const entityPut = createEntityPut(actions.entityName)

export function * createList ({tokenAddress}) {
  const accountAddress = yield select(getAccountAddress)
  const addresses = yield select(getAddresses)
  const SimpleListFactoryContract = contract.getContract({abiName: 'SimpleListFactory',
    address: addresses.SimpleListFactory
  })

  const receipt = yield SimpleListFactoryContract.methods.createSimpleList(tokenAddress).send({
    from: accountAddress
  })

  return receipt
}

export function * getList ({tokenAddress}) {
  const addresses = yield select(getAddresses)
  const SimpleListFactoryContract = contract.getContract({abiName: 'SimpleListFactory',
    address: addresses.SimpleListFactory
  })

  const listAddress = yield SimpleListFactoryContract.methods.tokenToListMap(tokenAddress).call()

  yield put({type: actions.GET_LIST.SUCCESS,
    response: {
      listAddress
    }})
  return listAddress
}

export function * addEntity ({listAddress, data}) {
  const accountAddress = yield select(getAccountAddress)
  const SimpleListContract = contract.getContract({abiName: 'SimpleList',
    address: listAddress
  })

  const {hash} = yield call(createMetadata, {metadata: data})

  const receipt = yield SimpleListContract.methods.addEntity(hash).send({
    from: accountAddress
  })
  return receipt

  // console.log(yield SimpleListContract.methods.count().call())
  // console.log(yield SimpleListContract.methods.getEntity(0).call())
}

export function * fetchEntities ({listAddress, page = 1}) {
  const pageSize = 10
  const SimpleListContract = contract.getContract({abiName: 'SimpleList',
    address: listAddress
  })

  const count = yield SimpleListContract.methods.count().call()
  const start = 0
  const end = Math.min(page * pageSize, count)

  const promises = []
  for (let i = start; i < end; i++) {
    promises.push(SimpleListContract.methods.getEntity(i).call())
  }

  const directoryEntities = yield all(promises)
  const entities = keyBy(directoryEntities)
  yield entityPut({type: actions.FETCH_ENTITIES.SUCCESS,
    response: {
      entities,
      directoryEntities
    }
  })

  for (let directoryEntiry of directoryEntities) {
    const tokenURI = `ipfs://${directoryEntiry}`
    yield put(fetchMetadata(tokenURI))
  }
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_LIST, createList, 1),
    tryTakeEvery(actions.GET_LIST, getList, 1),
    tryTakeEvery(actions.ADD_ENTITY, addEntity, 1),
    tryTakeEvery(actions.FETCH_ENTITIES, fetchEntities, 1)
  ])
}
