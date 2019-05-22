const foreign = require('@services/web3/foreign')
const home = require('@services/web3/home')
const BasicTokenAbi = require('@fuse/token-factory-contracts/build/abi/BasicToken')

const fetchTokenData = async (address, fields = {}, web3 = foreign.web3) => {
  const tokenContractInstance = new web3.eth.Contract(BasicTokenAbi, address)
  const [name, symbol, totalSupply, tokenURI] = await Promise.all([
    tokenContractInstance.methods.name().call(),
    tokenContractInstance.methods.symbol().call(),
    tokenContractInstance.methods.totalSupply().call(),
    fields.tokenURI ? tokenContractInstance.methods.tokenURI().call() : undefined
  ])

  return { name, symbol, totalSupply, tokenURI }
}

const transferOwnership = async (token, stepName, results, accountAddress) => {
  const tokenContractInstance = new home.web3.eth.Contract(BasicTokenAbi, token.address)

  const method = tokenContractInstance.methods.transferOwnership(accountAddress)

  return home.send(method, {
    from: home.from
  })
}

module.exports = {
  fetchTokenData,
  transferOwnership
}
