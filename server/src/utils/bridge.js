const Web3 = require('web3')
const config = require('config')
// const EthereumWallet = require('ethereumjs-wallet')
const ForeignBridgeFactoryABI = require('@constants/abi/ForeignBridgeFactory.js')
const HomeBridgeFactoryABI = require('@constants/abi/HomeBridgeFactory.js')
const BridgeMapperABI = require('@constants/abi/BridgeMapper.js')
const foreignAddressess = require('@utils/network').addresses
const homeAddresses = config.get('web3.addresses.fuse')
// const Web3Utils = require('web3-utils')

const TOKEN_DECIMALS = 18

const createWeb3 = (providerUrl) => {
  // const wallet = EthereumWallet.fromPrivateKey(Buffer.from(process.env.PRIVATE_KEY, 'hex'))
  // const from = wallet.getChecksumAddressString()
  // const provider = new WalletProvider(wallet, providerUrl)
  const web3 = new Web3(providerUrl)
  const account = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY)
  console.log(account)
  return {from: account.address, web3}
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
  console.log('est')

  const p = foreignFactory.methods.deployForeignBridge(token.address)

  const gas = await p.estimateGas({
    from
  })
  console.log(gas)

  console.log({from})
  const a = foreignFactory.methods.deployForeignBridge(token.address)
  debugger
  const receipt = await a.send({
    gas,
    from
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

async function test (token) {
  const {from, web3} = createWeb3(config.get('web3.fuseProvider'))

  const homeFactory = new web3.eth.Contract(require('@constants/abi/Fiat.js'), '0x1f55a28b10db292403e3e9146e52788d0d60e562', {
    from
  })

  const gas = await homeFactory.methods.transfer('0xD418c5d0c4a3D87a6c555B7aA41f13EF87485Ec6', 1)
    .estimateGas()
  console.log(gas)
  const tr = homeFactory.methods.transfer('0xD418c5d0c4a3D87a6c555B7aA41f13EF87485Ec6', 1).send({
    gas,
    gasPrice: '1000000000',
    from
  })
  console.log(tr)

  tr.on('transactionHash', async (transactionHash) => {
    console.log({transactionHash})
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
  console.log(receipt)
}

async function deployHomeBridge (token) {

  console.log('Deploying home bridge using factory')
  const {from, web3} = createWeb3(config.get('web3.fuseProvider'))

  // await web3.eth.sendTransaction({
  //   from,
  //   to: '0xD418c5d0c4a3D87a6c555B7aA41f13EF87485Ec6',
  //   value: 1,
  //   gasPrice: '1000000000'
  // })
  //
  // console.log('DONE')
  const homeFactory = new web3.eth.Contract(HomeBridgeFactoryABI, homeAddresses.HomeBridgeFactory, {
    from
  })

  const gas = await homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS)
    .estimateGas()
  console.log(gas)

  const a = homeFactory.methods.deployHomeBridge(token.name, token.symbol, TOKEN_DECIMALS)

  debugger
  const tr = a.send({
    gas,
    gasPrice: '1000000000',
    from
  }, function myCallback () {
    debugger
  })

  console.log(tr)
  tr.on('transactionHash', async (transactionHash) => {
    console.log({transactionHash})
  })

  // tr.on('data', async (data) => {
  //   console.log({data})
  // })

  tr.on('confirmation', (confirmationNumber, r) => {
    console.log({confirmationNumber, r})
  })

  debugger
  tr.on('receipt', (receipt) => {
    debugger
    console.log({receipt})
  })

  tr.on('error', (error) => {
    console.log({error})
  })

  const receipt = await tr
  //
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
  // await test(token)
  // await deployHomeBridge(
  //   token
  // )
  const { foreignBridgeAdderss, foreignBridgeBlockNumber } = await deployForeignBridge(token)
  // const { homeBridgeAddress, homeBridgeToken, homeBridgeBlockNumber } = await deployHomeBridge(
  //   token
  // )
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
