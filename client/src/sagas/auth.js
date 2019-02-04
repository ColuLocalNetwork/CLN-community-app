import { all, select } from 'redux-saga/effects'

import { tryTakeEvery } from './utils'
import * as actions from 'actions/auth'
import {getAccountAddress} from 'selectors/accounts'
import web3 from 'services/web3'
import * as api from 'services/api/auth'

const generateSignatureData = ({ accountAddress, date }) => {
  return { types: {
    EIP712Domain: [
      { name: 'name', 'type': 'string' }, { 'name': 'version', 'type': 'string' }, { 'name': 'chainId', 'type': 'uint256' }
    ],
    Person: [{ 'name': 'wallet', 'type': 'address' }],
    Login: [
      { 'name': 'account', 'type': 'string' },
      { 'name': 'date', 'type': 'string' },
      { 'name': 'content', 'type': 'string' }
    ] },
  'primaryType': 'Login',
  'domain': { 'name': 'CLN Communities QA', 'version': '1', 'chainId': 3 },
  'message': { 'account': accountAddress, date, content: 'Login request' }
  }
}

function * login () {
  const accountAddress = yield select(getAccountAddress)
  const date = new Date().toUTCString()
  const signatureData = generateSignatureData({accountAddress, date})
  yield web3.currentProvider.sendAsync(
    {
      method: 'eth_signTypedData_v3',
      params: [accountAddress, JSON.stringify(signatureData)],
      from: accountAddress
    },
    (error, res) => {
      if (error) return console.error(error)
      console.log(res.result)
      // yield call()
      // api.login()
      // this.setState({ signature: res.result, date })
    }
  )
  console.log(r)
  console.log('login')
}

export default function * authSaga () {
  yield all([
    tryTakeEvery(actions.LOGIN, login, 1)
  ])
}
