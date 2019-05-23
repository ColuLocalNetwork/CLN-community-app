const config = require('config')
const ForeignBridgeFactoryABI = require('@constants/abi/ForeignBridgeFactory.json')
const HomeBridgeFactoryABI = require('@constants/abi/HomeBridgeFactory')
const BridgeMapperABI = require('@constants/abi/BridgeMapper')
const IRestrictedTokenABI = require('@constants/abi/IRestrictedToken')
const foreignAddressess = config.get('network.foreign.addresses')
const homeAddresses = config.get('network.home.addresses')
const { fetchGasPrice, isZeroAddress } = require('@utils/network')
const { handleReceipt } = require('@events/handlers')
const home = require('@services/web3/home')
const foreign = require('@services/web3/foreign')
const mongoose = require('mongoose')
const Token = mongoose.model('Token')

const TOKEN_DECIMALS = 18

async function deployForeignBridge (token, { web3, from, send }) {
  console.log('Deploying foreign bridge using factory')
  const foreignFactory = new web3.eth.Contract(ForeignBridgeFactoryABI, foreignAddressess.ForeignBridgeFactory)

  const method = foreignFactory.methods.deployForeignBridge(token.address)

  const gasPrice = await fetchGasPrice('standard')

  const receipt = await send(method, {
    from,
    gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei')
  })

  const event = receipt.events.ForeignBridgeDeployed
  const result = {
    foreignBridgeAddress: event.returnValues._foreignBridge,
    foreignBridgeBlockNumber: event.returnValues._blockNumber
  }

  console.log(result)

  return result
}

async function deployHomeBridge (token, { web3, from, send }) {
  console.log('Deploying home bridge using factory')

  const homeFactory = new web3.eth.Contract(HomeBridgeFactoryABI, homeAddresses.HomeBridgeFactory, {
    from
  })

  const method = homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS)

  const receipt = await send(method, {
    from
  })

  await handleReceipt(receipt)

  const event = receipt.events.HomeBridgeDeployed

  const result = {
    homeBridgeAddress: event.returnValues._homeBridge,
    homeBridgeBlockNumber: event.returnValues._blockNumber,
    homeTokenAddress: event.returnValues._token
  }

  console.log(result)

  return result
}

async function addBridgeMapping (
  foreignToken,
  homeToken,
  foreignBridge,
  homeBridge,
  foreignBlockNumber,
  homeBlockNumber,
  { web3, from, send }) {
  console.log('Add bridge mapping')

  const mapper = new web3.eth.Contract(BridgeMapperABI, homeAddresses.BridgeMapper, {
    from
  })

  const method = mapper.methods.addBridgeMapping(
    foreignToken,
    homeToken,
    foreignBridge,
    homeBridge,
    foreignBlockNumber,
    homeBlockNumber
  )

  const receipt = await send(method, {
    from
  })

  console.log('Bridge mapping added')
  return receipt
}

async function deployBridge (communityProgress) {
  const { communityAddress } = communityProgress.steps.community.results
  const { foreignTokenAddress } = communityProgress.steps.bridge.results

  const token = await Token.findOne({ address: foreignTokenAddress })

  const [deployForeignBridgeResponse, deployHomeBridgeResponse] = await Promise.all([
    deployForeignBridge(token, foreign),
    deployHomeBridge(
      token,
      home
    )
  ])

  const { foreignBridgeAddress, foreignBridgeBlockNumber } = deployForeignBridgeResponse
  const { homeBridgeAddress, homeTokenAddress, homeBridgeBlockNumber } = deployHomeBridgeResponse

  const receipt = await addBridgeMapping(
    communityAddress,
    foreignTokenAddress,
    homeTokenAddress,
    foreignBridgeAddress,
    homeBridgeAddress,
    foreignBridgeBlockNumber,
    homeBridgeBlockNumber,
    home
  )

  await handleReceipt(receipt)

  const setTransferManagerMethod = new home.web3.eth.Contract(IRestrictedTokenABI, homeTokenAddress).methods.setTransferManager(communityAddress)
  await home.send(setTransferManagerMethod, {
    from: home.from
  })

  return {
    foreignTokenAddress,
    homeTokenAddress,
    foreignBridgeAddress,
    homeBridgeAddress,
    foreignBridgeBlockNumber,
    homeBridgeBlockNumber
  }
}

async function bridgeMappingExists (tokenAddress) {
  const mapper = new home.web3.eth.Contract(BridgeMapperABI, homeAddresses.BridgeMapper)
  const homeAddress = await mapper.methods.homeTokenByForeignToken(tokenAddress).call()
  return homeAddress && !isZeroAddress(homeAddress)
}

module.exports = {
  deployBridge,
  bridgeMappingExists
}
