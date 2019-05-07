const mongoose = require('mongoose')
const Entity = mongoose.model('Entity')

const handleTransferManagerSet = async (event) => {
  const token = event.address
  const communityAddress = event.returnValues.transferManager
  console.log({ token, communityAddress })
}

const getEntityProps = (roles) => ({
  isAdmin: true
})

const handleEntityAdded = async (event) => {
  const communityAddress = event.address
  const { roles, account } = event.returnValues

  const { isAdmin } = getEntityProps(roles)
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
