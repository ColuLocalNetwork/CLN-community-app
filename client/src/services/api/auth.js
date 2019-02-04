import request from 'superagent'

export const login = (apiRoot, {account, signature, date}) =>
  request.post(`${apiRoot}/users/login/${account}`)
    .send({signature, date})
    .then(response => response.body)
