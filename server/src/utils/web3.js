const Web3 = require('web3')
const config = require('config')

function add0xPrefix (str) {
  if (str.indexOf('0x') === 0) {
    return str
  }
  return `0x${str}`
}

const createWeb3 = (providerUrl) => {
  const web3 = new Web3(providerUrl)
  const account = web3.eth.accounts.wallet.add(add0xPrefix(config.get('secrets.fuse.bridge.privateKey')))
  return {from: account.address, web3}
}

module.exports = {
  createWeb3
}
