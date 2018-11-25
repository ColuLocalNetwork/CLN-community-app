// const config = require('config')
const processPastEvents = require('./utils').processPastEvents
const CurrencyFactoryAbi = require('@constants/abi/CurrencyFactory')
const processEvent = require('@utils/events/process').processEvent
const communityUtils = require('@utils/community')

const web3 = require('@services/web3')
const getAddresses = require('@utils/network').getAddresses

const addresses = getAddresses()

const CurrencyFactoryContract = new web3.eth.Contract(CurrencyFactoryAbi, addresses.CurrencyFactory)

const getLastBlockNumber = communityUtils.getLastBlockNumber

// const getPastEvents = CurrencyFactoryContract.getPastEvents

const proccessTokenCreatedEvent = processEvent.bind(null, 'TokenCreated')
// , getPastEvents, proccessEvent
const processPastTokenCreatedEvents = processPastEvents.bind(null, getLastBlockNumber, CurrencyFactoryContract, proccessTokenCreatedEvent)
// console.log(processPastTokenCreatedEvents.toString())
// const getPastMarketOpenEvents = getPastEvents.bind

module.exports = {
  processPastTokenCreatedEvents
  // getPastMarketOpenEvents
}
