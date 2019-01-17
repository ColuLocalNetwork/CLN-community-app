import filter from 'lodash/filter'
import pickBy from 'lodash/pickBy'
import find from 'lodash/find'
import { createSelector } from 'reselect'
import {getClnAddress} from 'selectors/network'
export const getCommunity = (state, address) => ({...state.tokens[address], ...state.marketMaker[address]})

export const getCommunityTokens = createSelector(
  state => state.tokens,
  (tokens) => filter(tokens, {isLocalCurrency: true})
)

export const getCommunities = createSelector(
  getCommunityTokens,
  state => state.marketMaker,
  (tokens, marketMaker) =>
    tokens.map(token => ({...token, ...marketMaker[token.address]}))
)

export const getCommunitiesWithMetadata = createSelector(getCommunities, (communities) =>
  filter(communities, community => community.metadata)
)

export const getTokensWithMetadata = createSelector(state => state.tokens, (tokens) =>
  pickBy(tokens, token => token.metadata)
)

export const getSelectedCommunity = createSelector(
  getCommunities,
  state => state.router.location.pathname,
  (communities, pathname) => find(communities, {path: pathname}) || {}
)

export const getClnToken = createSelector(
  getClnAddress,
  state => state.tokens,
  (clnAddress, tokens) => tokens[clnAddress]
)
