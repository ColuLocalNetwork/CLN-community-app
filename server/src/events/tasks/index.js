const processPastEvents = require('./utils').processPastEvents
const processPastTransferEvents = require('./transfer').processPastTransferEvents
const processPastBridgeMappingEvents = require('./bridge').processPastBridgeMappingEvents
const TokenFactoryAbi = require('@fuse/token-factory-contracts/build/abi/TokenFactory')
const { web3 } = require('@services/web3/foreign')
// const addresses = require('@utils/network').addresses
const config = require('config')

console.log(config.get('network.foreign.addresses.TokenFactory'))

const tokenFactory = new web3.eth.Contract(TokenFactoryAbi, config.get('network.foreign.addresses.TokenFactory'))
const processPastTokenCreatedEvents = processPastEvents.bind(null, 'TokenCreated', tokenFactory)

module.exports = {
  processPastTokenCreatedEvents,
  processPastTransferEvents,
  processPastBridgeMappingEvents
}
