const { handleReceipt } = require('@events/handlers')
const { createContract, from, send } = require('@services/web3/home')
const CommunityTransferManagerABI = require('@fuse/entities-contracts/build/abi/CommunityTransferManagerWithEvents')

const CommunityTransferManagerBytecode = require('@fuse/entities-contracts/build/bytecode/CommunityTransferManager')
const { combineRoles, roles: { ADMIN_ROLE, USER_ROLE, APPROVED_ROLE } } = require('@fuse/roles')

const deployCommunity = async (communityProgress) => {
  const { name, isClosed, adminAddress } = communityProgress.steps.community.args
  const method = createContract(CommunityTransferManagerABI).deploy({ data: CommunityTransferManagerBytecode, arguments: [name] })
  method.methodName = 'deploy'

  const transferManagerContract = await send(method, {
    from
  })

  const communityAddress = transferManagerContract.address

  const communityMethods = []

  if (isClosed) {
    communityMethods.push(transferManagerContract.methods.addRule(APPROVED_ROLE, APPROVED_ROLE))
    communityMethods[0].methodName = 'addRule'
  }
  const adminMultiRole = combineRoles(USER_ROLE, ADMIN_ROLE, APPROVED_ROLE)

  const addEntityMethod = transferManagerContract.methods.addEntity(adminAddress, adminMultiRole)
  addEntityMethod.methodName = 'addEntity'
  communityMethods.push(addEntityMethod)

  for (let method of communityMethods) {
    const receipt = await send(method, { from })
    await handleReceipt(receipt)
  }

  return {
    communityAddress,
    isClosed
  }
}

module.exports = {
  deployCommunity
}
