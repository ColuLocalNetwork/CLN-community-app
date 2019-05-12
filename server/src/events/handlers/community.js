const mongoose = require('mongoose')
const Entity = mongoose.model('Entity')
const Community = mongoose.model('Community')
const { hasRole, roles: { ADMIN_ROLE } } = require('@fuse/roles')

const handleTransferManagerSet = async (event) => {
  const token = event.address
  const communityAddress = event.returnValues.transferManager
  console.log({ token, communityAddress })
}

const handleEntityAdded = async (event) => {
  const entitiesListAddress = event.address
  const { communityAddress } = await Community.findOne({ entitiesListAddress }, 'communityAddress')
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
