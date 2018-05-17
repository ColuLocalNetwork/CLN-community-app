import filter from 'lodash/filter'
import find from 'lodash/find'
import { createSelector } from 'reselect'


export const getCommunities = createSelector(state => state.tokens, (tokens) =>
  filter(tokens,{isLocalCurrency: true}))

export const getSelectedCommunity = createSelector([getCommunities,
  (state, props) => props.match.params.name],
  (communities, name) => find(communities, {name})
)
