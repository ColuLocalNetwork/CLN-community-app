import request from 'superagent'

export const fetchTokens = (page, apiRoot) =>
  request.get(`${apiRoot}/tokens?page=${page}`).then(response => response.body)

export const fetchTokensByOwner = (owner, apiRoot) =>
  request.get(`${apiRoot}/tokens/owner/${owner}`).then(response => response.body)
