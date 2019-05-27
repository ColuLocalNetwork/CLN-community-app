import request from 'superagent'

export const fetchTokens = (apiRoot, { page }) =>
  request.get(`${apiRoot}/tokens?page=${page}`)
    .then(response => response.body)

export const fetchTokensByOwner = (apiRoot, { owner }) =>
  request.get(`${apiRoot}/tokens/owner/${owner}`)
    .then(response => response.body)

export const fetchToken = (apiRoot, { tokenAddress }) =>
  request.get(`${apiRoot}/tokens/${tokenAddress}`).then(response => response.body)

export const fetchTokenProgress = (apiRoot, { communityAddress }) =>
  request.get(`${apiRoot}/communities/progress?communityAddress=${communityAddress}`).then(response => response.body)

export const fetchDeployProgress = (apiRoot, { id }) =>
  request.get(`${apiRoot}/communities/progress/${id}`).then(response => response.body)

export const deployChosenContracts = (apiRoot, { steps, accountAddress }) =>
  request.post(`${apiRoot}/communities/deploy`)
    .send({ steps, accountAddress })
    .then(response => response.body)

export const fetchTokenStatistics = (apiRoot, { tokenAddress, activityType, interval }) =>
  request.get(`${apiRoot}/stats/${activityType}/${tokenAddress}?interval=${interval}`).then(response => response.body)

export const fetchTokenList = (apiRoot, { accountAddress, networkSide }) =>
  request.get(`${apiRoot}/tokenlist/${networkSide}/${accountAddress}`).then(response => response.body)

export const deployBridge = (apiRoot, { foreignTokenAddress }) =>
  request.post(`${apiRoot}/bridges/${foreignTokenAddress}`).then(response => response.body)

export const fetchCommunity = (apiRoot, { tokenAddress }) =>
  request.get(`${apiRoot}/communities?tokenAddress=${tokenAddress}`).then(response => response.body)
