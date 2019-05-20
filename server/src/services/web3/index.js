const Web3 = require('web3')
const config = require('config')

const web3 = new Web3(config.get('networks.foreign.provider'))

module.exports = web3
