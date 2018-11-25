const config = require('config')
const web3 = require('@services/web3')

const eventsCallback = function (proccessEvent, error, events) {
  if (error) {
    console.error(error)
    return
  }
  events.forEach((event) => proccessEvent(event))
}

const processPastEvents = async (getLastBlockNumber, contract, proccessEvent) => {
  const lastBlockNumber = await getLastBlockNumber()
  const bindedEventsCallback = eventsCallback.bind(null, proccessEvent)
  try {
    contract.getPastEvents('TokenCreated', {fromBlock: lastBlockNumber, toBlock: 'latest'}, bindedEventsCallback)
  } catch (error) {
    const latestBlock = await web3.eth.getBlock('latest')
    const pageSize = config.get('web3.pageSize')
    for (let i = lastBlockNumber; i < latestBlock.number; i += pageSize) {
      contract.getPastEvents('TokenCreated', {fromBlock: i, toBlock: i + pageSize}, bindedEventsCallback)
    }
  }
}

module.exports = {
  processPastEvents
}
