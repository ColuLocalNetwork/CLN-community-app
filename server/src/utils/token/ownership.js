const home = require('@services/web3/home')
const BasicTokenAbi = require('@fuse/token-factory-contracts/build/abi/BasicToken')
const { handleReceipt } = require('@events/handlers')

const transferOwnership = async (token, stepName, results, accountAddress) => {
  const { homeTokenAddress } = results.bridge
  const tokenContractInstance = new home.web3.eth.Contract(BasicTokenAbi, homeTokenAddress)

  const method = tokenContractInstance.methods.transferOwnership(accountAddress)

  const receipt = await home.send(method, {
    from: home.from
  })

  return handleReceipt(receipt)
}

module.exports = {
  transferOwnership
}
