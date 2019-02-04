import { all, select } from 'redux-saga/effects'

import { apiCall, tryTakeEvery } from './utils'
import * as actions from 'actions/auth'
import {getAccountAddress} from 'selectors/accounts'
import web3 from 'services/web3'
import * as api from 'services/api/auth'

const generateSignatureData = ({ accountAddress, date, chainId }) => {
  return { types: {
    EIP712Domain: [
      { name: 'name', type: 'string' }, { name: 'version', type: 'string' }, { name: 'chainId', type: 'uint256' }
    ],
    Person: [{ name: 'wallet', type: 'address' }],
    Login: [
      { name: 'account', type: 'string' },
      { name: 'date', type: 'string' },
      { name: 'content', type: 'string' }
    ]
  },
  primaryType: 'Login',
  domain: { name: 'CLN Communities QA', version: '1', chainId },
  message: { account: accountAddress, date, content: 'Login request' }
  }
}

function * login () {
  const accountAddress = yield select(getAccountAddress)
  const chainId = yield select(state => state.network.networkId)

  const date = new Date().toUTCString()

  const signatureData = generateSignatureData({accountAddress, date, chainId})
  const promise = new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData_v3',
        params: [accountAddress, JSON.stringify(signatureData)],
        from: accountAddress
      },
      (error, {result}) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      }
    )
  })
  const signature = yield promise
  if (signature) {
    const response = yield apiCall(api.login, {accountAddress, signature, date})
    console.log(response)
    console.log('login')
  }
}

export default function * authSaga () {
  yield all([
    tryTakeEvery(actions.LOGIN, login, 1)
  ])
}
