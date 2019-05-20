const foreign = require('@services/web3/foreign')
const home = require('@services/web3/home')
const BasicTokenAbi = require('@fuse/token-factory-contracts/build/abi/BasicToken')

const fetchTokenData = async (address, { tokenUri } = {}) => {
  const tokenContractInstance = new foreign.web3.eth.Contract(BasicTokenAbi, address)
  const [name, symbol, totalSupply, tokenURI] = await Promise.all([
    tokenContractInstance.methods.name().call(),
    tokenContractInstance.methods.symbol().call(),
    tokenContractInstance.methods.totalSupply().call(),
    tokenUri && tokenContractInstance.methods.tokenURI().call()
  ])

  return { name, symbol, totalSupply, tokenURI }
}

const transferOwnhership = async (token) => {
  const tokenContractInstance = new home.web3.eth.Contract(BasicTokenAbi, token.address)

  const method = tokenContractInstance.methods.transferOwnhership(token.owner)

  return home.send(method, {
    from: home.from
  })
}

module.exports = {
  fetchTokenData,
  transferOwnhership
}
