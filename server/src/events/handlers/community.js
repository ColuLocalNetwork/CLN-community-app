const mongoose = require('mongoose')
const Entity = mongoose.model('Entity')
const Community = mongoose.model('Community')

const handleTransferManagerSet = async (event) => {
  const token = event.address
  const communityAddress = event.returnValues.transferManager
  console.log({ token, communityAddress })
}

const handleEntityAdded = async (event) => {
  const entitiesListAddress = event.address
  const { communityAddress } = await Community.findOne({ entitiesListAddress }, 'communityAddress')
  const { roles, account } = event.returnValues

  return Entity.findOneAndUpdate({ account, communityAddress }, { communityAddress, roles, account }, { new: true, upsert: true })
}

const handleEntityRemoved = async (event) => {
  const entitiesListAddress = event.address
  const { account } = event.returnValues
  const { communityAddress } = await Community.findOne({ entitiesListAddress }, 'communityAddress')

  return Entity.deleteOne({ account, communityAddress })
}

const handleEntityRolesUpdated = async (event) => {
  const entitiesListAddress = event.address
  const { communityAddress } = await Community.findOne({ entitiesListAddress }, 'communityAddress')
  const { roles, account } = event.returnValues

  return Entity.updateOne({ account, communityAddress }, { roles })
}

module.exports = {
  handleTransferManagerSet,
  handleEntityAdded,
  handleEntityRemoved,
  handleEntityRolesUpdated
}
