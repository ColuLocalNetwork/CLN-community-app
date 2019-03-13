import { createSelector } from 'reselect'

export const getNetworkType = state => state.network.networkType
export const getForeignNetwork = state => state.network.foreignNetwork

export const getAddresses = createSelector(
  getNetworkType,
  state => state.network.addresses,
  (networkType, addresses) => addresses[networkType] || {}
)

export const getAddress = (state, contractName) => getAddresses(state)[contractName]

export const getNetworkSide = (state) => state.network.networkType === state.network.homeNetwork
  ? 'home'
  : 'foreign'

export const getBlockNumber = (state, networkType) => state.network[networkType] &&
  state.network[networkType].blockNumber

export const getBridgeStatus = createSelector(
  state => state.network,
  getNetworkSide,
  (network, networkSide) => networkSide === 'home' ? {
    from: {
      network: network.homeNetwork,
      bridge: 'home'
    },
    to: {
      network: network.foreignNetwork,
      bridge: 'foreign'
    }
  } : {
    from: {
      network: network.foreignNetwork,
      bridge: 'foreign'
    },
    to: {
      network: network.homeNetwork,
      bridge: 'home'
    }
  }
)

export const getApiRoot = createSelector(
  getForeignNetwork,
  networkType => CONFIG.api.url[networkType] || CONFIG.api.url.default
)
