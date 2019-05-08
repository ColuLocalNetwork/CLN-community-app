const mongoose = require('mongoose')
const Bridge = mongoose.model('Bridge')
const Community = mongoose.model('Community')
// const { handleReceipt } = require('@events/handlers')
const { web3, from, send } = require('@services/web3/home')
const CommunityTransferManagerABI = require('@fuse/entities-contracts/build/abi/CommunityTransferManager')
// const IRestrictedTokenABI = require('@fuse/entities-contracts/build/abi/IRestrictedToken')
const CommunityTransferManagerBytecode = require('@constants/bytecode/CommunityTransferManager.json').data

const deployTransferManager = async (token, step) => {
  console.log('Deploying community transfer manager')

  const method = new web3.eth.Contract(CommunityTransferManagerABI).deploy({ data: CommunityTransferManagerBytecode })
  // console.log(method)
  const transferManagerContract = await send(method, {
    from,
    gasPrice: '1000000000'
  })

  const communityAddress = transferManagerContract._address
  // add rule here
  if (step.isClosed) {

  }

  const adminRole = '0x0000000000000000000000000000000000000000000000000000000000000003'
  const addAdminMethod = transferManagerContract.methods.addEntity(token.owner, adminRole)

  await send(addAdminMethod, {
    from
  })

  const { homeTokenAddress } = await Bridge.findOne({ foreignTokenAddress: token.address })

  // const setTransferManagerMethod = new web3.eth.Contract(IRestrictedTokenABI, homeTokenAddress).methods.setTransferManager(communityAddress)
  // const receipt = await send(setTransferManagerMethod, {
  //   from,
  //   gasPrice: '1000000000'
  // })

  // await handleReceipt(receipt)

  return new Community({
    communityAddress,
    tokenAddress: token.address,
    homeTokenAddress,
    isClosed: step.isClosed
  }).save()
}

module.exports = {
  deployTransferManager
}
