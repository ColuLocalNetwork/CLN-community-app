const config = require('config')
const Agenda = require('agenda')
const processPastTokenCreatedEvents = require('@utils/events/tasks').processPastTokenCreatedEvents
const processPastMarketOpenEvents = require('@utils/events/tasks').processPastMarketOpenEvents

const agenda = new Agenda({db: {address: config.get('mongo.uri')}})

agenda.define('processPastEvents', async (job, done) => {
  console.log('leonhi')
  await processPastTokenCreatedEvents()
  await processPastMarketOpenEvents()
  console.log('leonbye')

  done()
})
//
// agenda.define('processPastMarketOpenEvents', async (job, done) => {
//   await processPastMarketOpenEvents()
//   done()
// })
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

  await agenda.now('processPastEvents')
  await agenda.every('10 minutes', 'processPastEvents')

  // await agenda.now('processPastMarketOpenEvents')
  // await agenda.every('10 minutes', 'processPastMarketOpenEvents')

  console.log('Agenda job scheduling is successfully defined')
}

module.exports = {
  start
}
