import { all, put, takeEvery } from 'redux-saga/effects'

import {createEntityPut, tryTakeEvery, apiCall} from './utils'
import * as api from 'services/api/metadata'
import * as actions from 'actions/metadata'

const entityPut = createEntityPut(actions.entityName)

function * fetchMetadata ({tokenURI}) {
  if (!tokenURI) {
    throw new Error(`No tokenURI given`)
  }

  const [protocol, hash] = tokenURI.split('://')

  const {data} = yield apiCall(api.fetchMetadata, {protocol, hash})

  yield entityPut({
    type: actions.FETCH_METADATA.SUCCESS,
    response: {
      entities: {
        [tokenURI]: data
      }
    }
  })
}

export function * createMetadata ({metadata}) {
  const {data, hash} = yield apiCall(api.createMetadata, {metadata})
  yield put({
    type: actions.CREATE_METADATA.SUCCESS,
    response: {
      data,
      hash
    }
  })
  return {data, hash}
}

export function * watchTokensFetched ({response}) {
  const {result, entities} = response
  for (let tokenAddress of result) {
    const token = entities[tokenAddress]
    yield put(actions.fetchMetadata(token.tokenURI, token.address))
  }
}

export default function * apiSaga () {
  yield all([
    tryTakeEvery(actions.FETCH_METADATA, fetchMetadata, 1),
    tryTakeEvery(actions.CREATE_METADATA, createMetadata, 1),
    takeEvery(action => /^FETCH_TOKENS.*SUCCESS/.test(action.type), watchTokensFetched)
  ])
}
