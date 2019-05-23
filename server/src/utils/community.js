const { handleReceipt } = require('@events/handlers')
const { web3, from, send } = require('@services/web3/home')
const CommunityTransferManagerABI = require('@fuse/entities-contracts/build/abi/CommunityTransferManagerWithEvents')

const CommunityTransferManagerBytecode = require('@fuse/entities-contracts/build/bytecode/CommunityTransferManager')
const { combineRoles, roles: { ADMIN_ROLE, USER_ROLE, APPROVED_ROLE } } = require('@fuse/roles')

<<<<<<< HEAD
const deployCommunity = async (token, step, results, accountAddress) => {
  console.log('Deploying community transfer manager')

  const method = new web3.eth.Contract(CommunityTransferManagerABI).deploy({
    data: CommunityTransferManagerBytecode, arguments: [step.name] })
=======
const deployCommunity = async (communityProgress) => {
  const { name, isClosed, adminAddress } = communityProgress.steps.community.args
  const method = new web3.eth.Contract(CommunityTransferManagerABI).deploy({ data: CommunityTransferManagerBytecode, arguments: [name] })
>>>>>>> changing the deployment of community
  const transferManagerContract = await send(method, {
    from
  })

  const entitiesListAddress = await transferManagerContract.methods.entitiesList().call()

  const communityAddress = transferManagerContract._address

  // const { homeTokenAddress } = results.bridge

  // new Community({
  //   communityAddress,
  //   entitiesListAddress
  //   // tokenAddress: token.address,
  //   // homeTokenAddress
  // }).save()

  const communityMethods = []

  if (isClosed) {
    communityMethods.push(transferManagerContract.methods.addRule(APPROVED_ROLE, APPROVED_ROLE))
  }
  const adminMultiRole = combineRoles(USER_ROLE, ADMIN_ROLE, APPROVED_ROLE)

  communityMethods.push(
    transferManagerContract.methods.addEntity(adminAddress, adminMultiRole))

  for (let method of communityMethods) {
    const receipt = await send(method, { from })
    console.log(receipt)
    await handleReceipt(receipt)
  }

  // const setTransferManagerMethod = new web3.eth.Contract(IRestrictedTokenABI, homeTokenAddress).methods.setTransferManager(communityAddress)
  // await send(setTransferManagerMethod, {
  //   from
  // })

  return {
    communityAddress,
    entitiesListAddress
  }
}

module.exports = {
  deployCommunity
}
