const config = require('config')
const ForeignBridgeFactoryABI = require('@constants/abi/ForeignBridgeFactory.json')
const HomeBridgeFactoryABI = require('@constants/abi/HomeBridgeFactory.json')
const BridgeMapperABI = require('@constants/abi/BridgeMapper.json')
const foreignAddressess = require('@utils/network').addresses
const homeAddresses = config.get('web3.addresses.fuse')
const {fetchGasPrice, isZeroAddress} = require('@utils/network')
const {handleReceipt} = require('@events/handlers')
const homeWeb3 = require('@services/web3/home').web3
const homeFrom = require('@services/web3/home').from
const foreignWeb3 = require('@services/web3/foreign').web3
const foreignFrom = require('@services/web3/foreign').from
const TOKEN_DECIMALS = 18

async function deployForeignBridge (token, web3, from) {
  console.log('Deploying foreign bridge using factory')
  const foreignFactory = new web3.eth.Contract(ForeignBridgeFactoryABI, foreignAddressess.ForeignBridgeFactory)

  const method = foreignFactory.methods.deployForeignBridge(token.address)

  const [gas, gasPrice] = await Promise.all([
    method.estimateGas({
      from
    }),
    fetchGasPrice('standard')
  ])

  const p = method.send({
    gas,
    from,
    gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei')
  })

  const receipt = await p

  const event = receipt.events.ForeignBridgeDeployed
  const result = {
    foreignBridgeAddress: event.returnValues._foreignBridge,
    foreignBridgeBlockNumber: event.returnValues._blockNumber
  }

  console.log(result)

  return result
}

async function deployHomeBridge (token, web3, from) {
  console.log('Deploying home bridge using factory')

  const homeFactory = new web3.eth.Contract(HomeBridgeFactoryABI, homeAddresses.HomeBridgeFactory, {
    from
  })

  const method = homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS)
  const gas = await method.estimateGas()

  const receipt = await method.send({
    from,
    gas,
    gasPrice: '1000000000'
  })

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
  web3,
  from) {
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

  const gas = await method.estimateGas()

  const receipt = await method.send({
    from,
    gas,
    gasPrice: '1000000000'
  })

  console.log('Bridge mapping added')
  return receipt
}

async function deployBridge (token) {
  const [deployForeignBridgeResponse, deployHomeBridgeResponse] = await Promise.all([
    deployForeignBridge(token, foreignWeb3, foreignFrom),
    deployHomeBridge(
      token,
      homeWeb3,
      homeFrom
    )
  ])

  const { foreignBridgeAddress, foreignBridgeBlockNumber } = deployForeignBridgeResponse
  const { homeBridgeAddress, homeTokenAddress, homeBridgeBlockNumber } = deployHomeBridgeResponse

  const foreignTokenAddress = token.address
  const receipt = await addBridgeMapping(
    foreignTokenAddress,
    homeTokenAddress,
    foreignBridgeAddress,
    homeBridgeAddress,
    foreignBridgeBlockNumber,
    homeBridgeBlockNumber,
    homeWeb3,
    homeFrom
  )

  await handleReceipt(receipt)

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
  const mapper = new homeWeb3.eth.Contract(BridgeMapperABI, homeAddresses.BridgeMapper)
  const homeAddress = await mapper.methods.homeTokenByForeignToken(tokenAddress).call()
  return homeAddress && !isZeroAddress(homeAddress)
}

module.exports = {
  deployBridge,
  bridgeMappingExists
}
