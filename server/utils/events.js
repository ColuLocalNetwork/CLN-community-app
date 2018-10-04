const fs = require('fs')
const utils = require('./community')

const saveLastBlockNumber = (blockNumber) => {
  console.log('writing', blockNumber)
  fs.writeFile('blockNumber', blockNumber, (error) => console.log('written', blockNumber) && error && console.error(error))
}

const getLastBlockNumber = () => {
  try {
    return fs.readFileSync('blockNumber', {
      encoding: 'utf8'
    })
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 0
    } else {
      throw error
    }
  }
}

const processTokenCreatedEvent = async (event) => {
  console.log(`recieved TokenCreated event at ${event.blockNumber} blockNumber`)
  const eventArgs = event.returnValues
  const ccAddress = eventArgs.token
  const owner = eventArgs.owner
  const factoryAddress = event.address
  const communityData = await utils.getCommunityData(factoryAddress, ccAddress)

  const community = await utils.addNewCommunity({ccAddress, owner, ...communityData})
  saveLastBlockNumber(event.blockNumber + 1)
  return community
}

module.exports = {
  processTokenCreatedEvent,
  getLastBlockNumber
}
