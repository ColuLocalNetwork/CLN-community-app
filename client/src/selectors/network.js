import { createSelector } from 'reselect'

export const getNetworkType = state => state.network.networkType

export const getAddresses = createSelector(
  getNetworkType,
  state => state.network.addresses,
  (networkType, addresses) => addresses[networkType] || {}
)

export const getClnAddress = createSelector(
  getAddresses,
  (addresses) => addresses.ColuLocalNetwork
)

export const getEtherscanUrl = createSelector(
  getNetworkType,
  networkType => networkType === 'main'
    ? 'https://etherscan.io/'
    : 'https://ropsten.etherscan.io/'
)

export const getApiRoot = createSelector(
  getNetworkType,
  networkType => CONFIG.api.url[networkType] || CONFIG.api.url.default
)

// export const getCurrentWe
