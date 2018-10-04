const utils = require('./community')

const processTokenCreatedEvent = async (event) => {
  const blockNumber = event.blockNumber
  console.log(`recieved TokenCreated event at ${blockNumber} blockNumber`)
  const eventArgs = event.returnValues
  const ccAddress = eventArgs.token
  const owner = eventArgs.owner
  const factoryAddress = event.address
  const communityData = await utils.getCommunityData(factoryAddress, ccAddress)

  try {
    const community = await utils.addNewCommunity({ccAddress, owner, blockNumber, ...communityData})
    return community
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return null
    }
    throw error
  }
}

module.exports = {
  processTokenCreatedEvent
}
