const Web3 = require('web3')
const config = require('config')
const websocketProviderUri = config.get('web3.websocketProvider')
const CurrencyFactoryAbi = require('../constants/abi/CurrencyFactory')
const websocketProvider = new Web3.providers.WebsocketProvider(websocketProviderUri)
const web3 = new Web3(websocketProvider)

const CurrencyFactoryContract = new web3.eth.Contract(CurrencyFactoryAbi, '0xA1F05144f9d3298a702c8EEE3ca360bc87d05207')

const cb = (error, event) => {
  if (error) {
    console.error(error)
    return
  }
  console.log(event)
}

CurrencyFactoryContract.events.TokenCreated(cb)

CurrencyFactoryContract.getPastEvents('TokenCreated', {fromBlock: 3919670, toBlock: 'latest'}, cb)
