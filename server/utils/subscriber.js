const Web3 = require('web3')
const config = require('config')
const websocketProviderUri = config.get('web3.websocketProvider')
const CurrencyFactoryAbi = require('../constants/abi/CurrencyFactory')
const websocketProvider = new Web3.providers.WebsocketProvider(websocketProviderUri)
const fs = require('fs')
const utils = require('./community')

const getAddresses = require('./network').getAddresses
const addresses = getAddresses()

const web3 = new Web3(websocketProvider)
const CurrencyFactoryContract = new web3.eth.Contract(CurrencyFactoryAbi, addresses.CurrencyFactory)

const saveLastBlockNumber = (blockNumber) => {
  console.log('saving', blockNumber)
  // fs.writeFile('blockNumber', blockNumber, (error) => error && console.error(error))
}

const getLastBlockNumber = (blockNumber) => {
  return fs.readFileSync('blockNumber', {
    encoding: 'utf8'
  })
}

const eventCallback = async (error, event) => {
  if (error) {
    console.error(error)
    return
  }
  processTokenCreatedEvent(event)
}

const processTokenCreatedEvent = async (event) => {
  const eventArgs = event.returnValues
  const ccAddress = eventArgs.token
  const owner = eventArgs.owner
  const factoryAddress = addresses.CurrencyFactory
  const communityData = await utils.getCommunityData(factoryAddress, ccAddress)
  console.log(communityData)

  utils.addNewCommunity({ccAddress, ...communityData})
  console.log(owner)
  console.log(ccAddress)
  saveLastBlockNumber(event.blockNumber + 1)
}

const eventsCallback = (error, events) => {
  if (error) {
    console.error(error)
    return
  }
  events.forEach((event) => eventCallback(error, event))
}

const lastBlockNumber = getLastBlockNumber()

module.exports = {
  processTokenCreatedEvent
}

// CurrencyFactoryContract.events.TokenCreated(eventCallback)

CurrencyFactoryContract.getPastEvents('TokenCreated', {fromBlock: lastBlockNumber, toBlock: 'latest'}, eventsCallback)
