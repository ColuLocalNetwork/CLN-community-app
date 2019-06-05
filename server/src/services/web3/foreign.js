const config = require('config')
const { createWeb3, createContract, send } = require('@utils/web3')

const bridgeType = 'foreign'

const { from, web3 } = createWeb3(config.get(`network.${bridgeType}.provider`))

module.exports = {
  from,
  web3,
  createContract: createContract.bind(null, web3, bridgeType),
  send: send.bind(null, web3, bridgeType)
}
