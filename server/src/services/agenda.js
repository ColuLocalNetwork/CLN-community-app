const config = require('config')
const Agenda = require('agenda')
const processPastTokenCreatedEvents = require('@utils/events/web3').processPastTokenCreatedEvents
// const getPastMarketOpenEvents = require('@utils/events/web3').getPastMarketOpenEvents

const agenda = new Agenda({db: {address: config.get('mongo.uri')}})

agenda.define('processPastTokenCreatedEvents', async (job, done) => {
  await processPastTokenCreatedEvents()
  done()
})

// agenda.define('getPastMarketOpenEvents', async (job, done) => {
//   await getPastMarketOpenEvents()
//   done()
// })

async function start () {
  console.log('Starting Agenda job scheduling')

  agenda.on('start', job => console.info(`Job ${job.attrs.name} starting`))
  agenda.on('complete', job => console.info(`Job ${job.attrs.name} finished`))
  agenda.on('success', job => console.info(`Job ${job.attrs.name} succeeded`))
  agenda.on('fail', job => console.warn(`Job ${job} failed`))

  await agenda.start()

  await agenda.now('processPastTokenCreatedEvents')
  await agenda.every('10 minutes', 'processPastTokenCreatedEvents')

  console.log('Agenda job scheduling is successfully defined')
}

module.exports = {
  start
}
