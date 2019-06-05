const foreign = require('@services/web3/foreign')
const BasicTokenAbi = require('@fuse/token-factory-contracts/build/abi/BasicToken')

/* eslint no-useless-call: "off" */

const fetchTokenData = async (address, fields = {}, web3 = foreign.web3, blockNumber = undefined) => {
  const tokenContractInstance = new web3.eth.Contract(BasicTokenAbi, address)
  const [name, symbol, totalSupply, tokenURI] = await Promise.all([
    tokenContractInstance.methods.name().call(undefined, blockNumber),
    tokenContractInstance.methods.symbol().call(undefined, blockNumber),
    tokenContractInstance.methods.totalSupply().call(undefined, blockNumber),
    fields.tokenURI ? tokenContractInstance.methods.tokenURI().call(undefined, blockNumber) : undefined
  ])

  return { name, symbol, totalSupply: totalSupply.toString(), tokenURI }
}

module.exports = {
  fetchTokenData
}
