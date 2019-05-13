import { createSelector } from 'reselect'

export const getEntities = createSelector(
  state => state.screens.directory.listHashes,
  state => state.entities.metadata,
  (listHashes, metadata) => listHashes.map(hash => metadata[`ipfs://${hash}`]).filter(obj => !!obj)
)

export const getUsersEntities = createSelector(
  state => state.screens.directory.usersResults,
  state => state.entities.communityEntities,
  (usersResults, communityEntities) => usersResults.map(account => communityEntities[account]).filter(obj => !!obj)
)

export const getBusinessesEntities = createSelector(
  state => state.screens.directory.merchantsResults,
  state => state.entities.communityEntities,
  (merchantsResults, communityEntities) => merchantsResults.map(account => communityEntities[account]).filter(obj => !!obj)
)
