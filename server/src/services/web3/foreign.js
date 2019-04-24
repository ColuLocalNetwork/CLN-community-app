const config = require('config')
const createWeb3 = require('@utils/web3').createWeb3

module.exports = createWeb3(config.get('web3.provider'))
