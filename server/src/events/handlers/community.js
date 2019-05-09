const mongoose = require('mongoose')
const Entity = mongoose.model('Entity')
const { hasRole, roles: { ADMIN_ROLE } } = require('@fuse/roles')

const handleTransferManagerSet = async (event) => {
  const token = event.address
  const communityAddress = event.returnValues.transferManager
  console.log({ token, communityAddress })
}

const handleEntityAdded = async (event) => {
  const communityAddress = event.address
  const { roles, account } = event.returnValues

  const isAdmin = hasRole(roles, ADMIN_ROLE)
  return new Entity({
    communityAddress,
    account,
    roles,
    isAdmin,
    active: true
  }).save()
}

module.exports = {
  handleTransferManagerSet,
  handleEntityAdded
}
