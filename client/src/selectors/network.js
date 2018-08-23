import { createSelector } from 'reselect'

export const getNetworkType = state => state.network.networkType

export const getAddresses = createSelector(
  getNetworkType,
  state => state.network.addresses,
  (networkType, addresses) => addresses[networkType]
)

export const getCommunityAddresses = createSelector(
  getAddresses,
  (addresses) => addresses ? [
    addresses.TelAvivCoinAddress,
    addresses.HaifaCoinAddress,
    addresses.LiverpoolCoinAddress
  ] : []
)

export const getTokenAddresses = createSelector(
  getAddresses,
  getCommunityAddresses,
  (addresses, communityAddresses) => addresses ? [
    ...communityAddresses,
    addresses.ColuLocalNetwork
  ] : []
)

export const getEtherscanUrl = createSelector(
  getNetworkType,
  networkType => networkType === 'main'
    ? 'https://etherscan.io/'
    : 'https://ropsten.etherscan.io/'
)

export const getColuWallet = createSelector(
  getAddresses,
  (addresses) => addresses && addresses.ColuWallet
)
