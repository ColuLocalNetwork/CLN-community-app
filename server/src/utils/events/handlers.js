const communityUtils = require('../community')
const eventUtils = require('../event')

const processTokenCreatedEvent = async (event) => {
  const blockNumber = event.blockNumber
  console.log(`recieved TokenCreated event at ${blockNumber} blockNumber`)
  const eventArgs = event.returnValues
  const ccAddress = eventArgs.token
  const owner = eventArgs.owner
  const factoryAddress = event.address
  const communityData = await communityUtils.getCommunityData(factoryAddress, ccAddress)

  return communityUtils.upsertCommunity({ccAddress, owner, blockNumber, ...communityData})
}

const processMarketOpenEvent = async (event) => {
  const blockNumber = event.blockNumber
  console.log(`recieved MarketOpen event at ${blockNumber} blockNumber`)
  const eventArgs = event.returnValues
  const mmAddress = eventArgs.marketMaker

  return communityUtils.openMarket(mmAddress)
}

const eventsHandlers = {
  TokenCreated: processTokenCreatedEvent,
  MarketOpen: processMarketOpenEvent
}

const processEvent = function (eventName, event) {
  if (eventsHandlers.hasOwnProperty(eventName)) {
    eventUtils.addNewEvent({
      eventName,
      blockNumber: event.blockNumber,
      address: event.address
    })
    return eventsHandlers[eventName](event)
  }
}

const processReceipt = async (receipt) => {
  const events = Object.entries(receipt.events)
  let promisses = []
  for (let [eventName, event] of events) {
    if (eventsHandlers.hasOwnProperty(eventName)) {
      if (Array.isArray(event)) {
        const eventPromisses = event.map((singleEvent) => processEvent(eventName, singleEvent))
        promisses = [...promisses, ...eventPromisses]
      } else {
        promisses.push(processEvent(eventName, event))
      }
    }
  }
  return Promise.all(promisses)
}

module.exports = {
  processTokenCreatedEvent,
  processMarketOpenEvent,
  processEvent,
  processReceipt
}
