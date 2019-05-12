import request from 'superagent'

export const fetchMetadata = (apiRoot, { hash }) =>
  request.get(`${apiRoot}/metadata/${hash}`)
    .then(response => response.body)

export const createMetadata = (apiRoot, { metadata }) =>
  request.post(`${apiRoot}/metadata`)
    .send({ metadata })
    .then(response => response.body)

export const createEntitiesMetadata = (apiRoot, { accountId, metadata }) =>
  request.put(`${apiRoot}/entities/${accountId}`)
    .send({ metadata })
    .then(response => response.body)
