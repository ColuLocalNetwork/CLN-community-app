const Web3 = require('web3')
const config = require('config')
const Wallet = require('ethereumjs-wallet')
const WalletProvider = require('truffle-wallet-provider')
const ForeignBridgeFactoryABI = require('@constants/abi/ForeignBridgeFactory.js')
const HomeBridgeFactoryABI = require('@constants/abi/HomeBridgeFactory.js')
const BridgeMapperABI = require('@constants/abi/BridgeMapper.js')
const foreignAddressess = require('@utils/network').addresses
const homeAddresses = config.get('web3.addresses.fuse')
// const Web3Utils = require('web3-utils')

const TOKEN_DECIMALS = 18

const createWeb3 = (providerUrl) => {
  const wallet = Wallet.fromPrivateKey(Buffer.from(process.env.PRIVATE_KEY, 'hex'))
  const from = wallet.getChecksumAddressString()
  const provider = new WalletProvider(wallet, providerUrl)
  const web3 = new Web3(provider)
  return {from, web3}
}

// async function sendRawTx ({ data, nonce, to, privateKey, url, gasPrice, value }) {
//   try {
//     const rawTx = {
//       nonce,
//       gasPrice: Web3Utils.toHex(gasPrice),
//       gasLimit: Web3Utils.toHex(GAS_LIMIT),
//       to,
//       data,
//       value
//     }
//
//     const tx = new Tx(rawTx)
//     tx.sign(privateKey)
//     const serializedTx = tx.serialize()
//     const txHash = await sendNodeRequest(
//       url,
//       'eth_sendRawTransaction',
//       `0x${serializedTx.toString('hex')}`
//     )
//     console.log('pending txHash', txHash)
//     const receipt = await getReceipt(txHash, url)
//     return receipt
//   } catch (e) {
//     console.error(e)
//   }
// }

async function deployForeignBridge (token) {
  console.log('Deploying foreign bridge using factory')
  const {from, web3} = createWeb3(config.get('web3.provider'))
  const foreignFactory = new web3.eth.Contract(ForeignBridgeFactoryABI, foreignAddressess.ForeignBridgeFactory, {
    from
  })
  const gas = await foreignFactory.methods.deployForeignBridge(token.address).estimateGas()
  const receipt = await foreignFactory.methods.deployForeignBridge(token.address).send({
    gas
  })
  const event = receipt.events.ForeignBridgeDeployed
  const result = {
    foreignBridgeAdderss: event.returnValues._foreignBridge,
    foreignBridgeBlockNumber: event.returnValues._blockNumber
  }
  console.log(result)
  return result
  // console.log('DONE')
}

async function deployHomeBridge (token) {
  console.log('Deploying home bridge using factory')
  const {from, web3} = createWeb3(config.get('web3.fuseProvider'))
  const homeFactory = new web3.eth.Contract(HomeBridgeFactoryABI, homeAddresses.HomeBridgeFactory, {
    from
  })

  const gas = await homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS)
    .estimateGas()
  console.log(gas)
  const tr = homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS).send({
    gas,
    gasPrice: '1000000000',
    from
  })

  tr.on('transactionHash', async (transactionHash) => {
    console.log({transactionHash})
    console.log(await web3.eth.getTransaction(transactionHash))
  })

  tr.on('confirmation', (confirmationNumber, r) => {
    console.log({confirmationNumber, r})
  })

  tr.on('receipt', (receipt) => {
    console.log({receipt})
  })

  tr.on('error', (error) => {
    console.log({error})
  })

  const receipt = await tr
  // const data = homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS).encodeABI({
  //   from
  // })
  // console.log(data)

  const event = receipt.events.HomeBridgeDeployed
  const result = {
    homeBridgeAddress: event.returnValues._homeBridge,
    homeBridgeBlockNumber: event.returnValues._blockNumber,
    homeBridgeToken: event.returnValues._token
  }

  console.log(result)
  return result
}

// async function addBridgeMapping (
//   foreignToken,
//   homeToken,
//   foreignBridge,
//   homeBridge,
//   foreignBlockNumber,
//   homeBlockNumber) {
//
// }

async function addBridgeForToken (token) {
  // await deployHomeBridge(
  //   token
  // )
  // const { foreignBridgeAdderss, foreignBridgeBlockNumber } = await deployForeignBridge(token)
  const { homeBridgeAddress, homeBridgeToken, homeBridgeBlockNumber } = await deployHomeBridge(
    token
  )
  // await addBridgeMapping(
  //   token,
  //   homeBridgeToken,
  //   foreignBridgeAdderss,
  //   homeBridgeAddress,
  //   foreignBridgeBlockNumber,
  //   homeBridgeBlockNumber
  // )
}

module.exports = {
  addBridgeForToken
}
