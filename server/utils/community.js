const mongoose = require('mongoose')
const config = require('config')
const Web3 = require('web3')
const Contract = require('truffle-contract')

const DEFAULT_FACTORY_TYPE = 'CurrencyFactory'
const DEFAULT_FACTORY_VERSION = 0

const COLU_LOCAL_CURRENCY = 'ColuLocalCurrency'

require('../models')(mongoose)
const abis = require('../constants/abi')

const web3Config = config.get('web3')
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
const provider = new Web3.providers.HttpProvider(web3Config.provider)

const community = mongoose.community

const createContract = (abi) => {
  let cntrct = Contract({ abi: abi })
  cntrct.setProvider(provider)
  return cntrct
}

const contracts = Object.assign(...Object.entries(abis).map(([name, abi]) => ({ [name]: createContract(abi) })))

const utils = {}

utils.later = (delay, value) => {
  return new Promise(resolve => setTimeout(resolve, delay, value))
}

utils.getCommunityData = async (factory, tokenAddress) => {
  const communityData = {
    ccAddress: tokenAddress
  }
  if (typeof factory === 'string') {
    communityData.factoryAddress = factory
    communityData.factoryType = DEFAULT_FACTORY_TYPE
    communityData.factoryVersion = DEFAULT_FACTORY_VERSION
  } else {
    if (!factory.factoryAddress) {
      throw new Error('No factory given')
    }
    communityData.factoryAddress = factory.factoryAddress
    communityData.factoryType = factory.factoryType || DEFAULT_FACTORY_TYPE
    communityData.factoryVersion = factory.factoryVersion || DEFAULT_FACTORY_VERSION
  }
  const factoryContractInstance = await contracts[communityData.factoryType].at(communityData.factoryAddress)
  const tokenContractInstance = await contracts[COLU_LOCAL_CURRENCY].at(tokenAddress)
  // communityData.mmAddress = await factoryContractInstance.getMarketMakerAddressFromToken(tokenAddress)
  const [currencyMap, symbol, tokenURI] = await Promise.all([
    factoryContractInstance.currencyMap(tokenAddress),
    tokenContractInstance.symbol(),
    tokenContractInstance.tokenURI()
  ])
  const [name, decimals, totalSupply, owner, mmAddress] = currencyMap

  return {...communityData, name, totalSupply, decimals, owner, mmAddress, symbol, tokenURI}
}

utils.addNewCommunity = async (data) => {
  return community.create(data)
}

utils.upsertCommunity = async (data) => {
  return community.upsertByccAddress(data)
}

utils.getLastBlockNumber = async () => {
  const communityObj = await community.getModel().find().sort({ blockNumber: -1 }).limit(1)
  return communityObj.length ? communityObj[0].blockNumber : 0
}

module.exports = utils
