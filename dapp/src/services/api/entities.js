import request from 'superagent'

export const fetchCommunityEntities = (apiRoot, { communityAddress, entityType }) => {
  const path = entityType
    ? `${apiRoot}/entities?communityAddress=${communityAddress}&type=${entityType}`
    : `${apiRoot}/entities?communityAddress=${communityAddress}`
  return request.get(path).then(response => response.body)
}

export const createEntitiesMetadata = (apiRoot, { accountId, metadata }) =>
  request.put(`${apiRoot}/entities/${accountId}`)
    .send({ metadata })
    .then(response => response.body)

export const fetchEntity = (apiRoot, { account }) =>
  request.get(`${apiRoot}/entities/${account}`).then(response => response.body)
