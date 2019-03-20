import { all, call, put, select } from 'redux-saga/effects'

import {getContract} from 'services/contract'
import * as actions from 'actions/directory'
import {apiCall, tryTakeEvery} from './utils'
import {getAccountAddress} from 'selectors/accounts'
import {getAddress} from 'selectors/network'
import {createMetadata} from 'sagas/metadata'
import {fetchMetadata} from 'actions/metadata'
import {isZeroAddress} from 'utils/web3'
import {processReceipt} from 'services/api/misc'

export function * createList ({tokenAddress}) {
  const accountAddress = yield select(getAccountAddress)
  const contractAddress = yield select(getAddress, 'SimpleListFactory')
  const SimpleListFactoryContract = getContract({abiName: 'SimpleListFactory',
    address: contractAddress
  })

  const receipt = yield SimpleListFactoryContract.methods.createSimpleList(tokenAddress).send({
    from: accountAddress,
    gasPrice: 1e9
  })

  yield put({type: actions.CREATE_LIST.SUCCESS,
    response: {
      listAddress: receipt.events.SimpleListCreated.returnValues.list
    }})

  return receipt
}

export function * getList ({tokenAddress}) {
  const contractAddress = yield select(getAddress, 'SimpleListFactory')
  const SimpleListFactoryContract = getContract({abiName: 'SimpleListFactory',
    address: contractAddress
  })

  const listAddress = yield SimpleListFactoryContract.methods.tokenToListMap(tokenAddress).call()

  yield put({type: actions.GET_LIST.SUCCESS,
    response: {
      listAddress: isZeroAddress(listAddress) ? null : listAddress
    }})
  return listAddress
}

export function * addEntity ({listAddress, data}) {
  const accountAddress = yield select(getAccountAddress)
  const SimpleListContract = getContract({abiName: 'SimpleList',
    address: listAddress
  })

  const {hash} = yield call(createMetadata, {metadata: data})

  const receipt = yield SimpleListContract.methods.addEntity(hash).send({
    from: accountAddress,
    gasPrice: 1e9
  })

  yield apiCall(processReceipt, {receipt})

  yield put({type: actions.ADD_DIRECTORY_ENTITY.SUCCESS,
    response: {
      receipt
    }
  })

  return receipt
}

export function * fetchEntities ({listAddress, page = 1}) {
  const pageSize = 10
  const SimpleListContract = getContract({abiName: 'SimpleList',
    address: listAddress
  })

  const count = yield SimpleListContract.methods.count().call()
  const start = 0
  const end = Math.min(page * pageSize, count)

  const promises = []
  for (let i = start; i < end; i++) {
    promises.push(SimpleListContract.methods.getEntity(i).call())
  }

  const listHashes = yield all(promises)
  yield put({type: actions.FETCH_ENTITIES.SUCCESS,
    response: {
      listHashes
    }
  })

  for (let hash of listHashes) {
    const tokenURI = `ipfs://${hash}`
    yield put(fetchMetadata(tokenURI))
  }
}

export default function * marketMakerSaga () {
  yield all([
    tryTakeEvery(actions.CREATE_LIST, createList, 1),
    tryTakeEvery(actions.GET_LIST, getList, 1),
    tryTakeEvery(actions.ADD_DIRECTORY_ENTITY, addEntity, 1),
    tryTakeEvery(actions.FETCH_ENTITIES, fetchEntities, 1)
  ])
}
