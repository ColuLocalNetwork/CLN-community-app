import { createSelector } from 'reselect'
import { getAccountAddress } from './accounts'
import sortBy from 'lodash/sortBy'

export const getCommunityAddress = state => state.screens.directory.communityAddress

export const getEntities = createSelector(
  state => state.screens.directory.listHashes,
  state => state.entities.metadata,
  (listHashes, metadata) => listHashes.map(hash => metadata[`ipfs://${hash}`]).filter(obj => !!obj)
)

export const getUsersEntities = createSelector(
  state => state.screens.directory.usersResults,
  state => state.entities.communityEntities,
  (usersResults, communityEntities) => sortBy(usersResults.map(account => communityEntities[account]).filter(obj => !!obj), ['updatedAt']).reverse() || []
)

export const getBusinessesEntities = createSelector(
  state => state.screens.directory.merchantsResults,
  state => state.entities.communityEntities,
  (merchantsResults, communityEntities) => sortBy(merchantsResults.map(account => communityEntities[account]).filter(obj => !!obj), ['updatedAt']).reverse() || []
)

export const checkIsAdmin = createSelector(
  getAccountAddress,
  state => state.entities.communityEntities,
  (accountAddress, communityEntities) => {
    return (communityEntities[accountAddress] && communityEntities[accountAddress].isAdmin) || false
  }
)
