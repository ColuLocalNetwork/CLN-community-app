import request from 'superagent'

const API_ROOT = CONFIG.api.url.default

export const login = (apiRoot, {accountAddress, signature, date}) =>
  request.post(`${apiRoot}/users/login/${accountAddress}`)
    .send({signature, date})
    .then(response => response.body)

export const addUser = (apiRoot, {user, tokenAddress, authToken}) =>
  request.post(`${API_ROOT}/users`).send({user, tokenAddress})
    .set('Authorization', `Bearer ${authToken}`)
    .then(response => response.body)

export const isUserExists = (apiRoot, {accountAddress}) =>
  request.get(`${API_ROOT}/users/${accountAddress}`)
    .then(response => response.body)
