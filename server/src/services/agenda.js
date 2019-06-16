const config = require('config')
const Agenda = require('agenda')
const tasks = require('@tasks')

const agenda = new Agenda({ db: { address: config.get('mongo.uri'), options: config.get('mongo.options') } })

const getConfig = (taskName) => config.has(`agenda.tasks.${taskName}`) ? config.get(`agenda.tasks.${taskName}`) : {}

Object.entries(tasks).forEach(([taskName, task]) => {
  console.log(`adding definition of task ${taskName}`)
  agenda.define(taskName, getConfig(taskName), async (job, done) => {
    job.attrs.data ? await task(job.attrs.data) : await task()
    done()
  })
})

async function start () {
  console.log('Starting Agenda job scheduling')

  agenda.on('start', job => console.info(`Job ${job.attrs.name} starting. id: ${job.attrs._id}`))
  agenda.on('complete', job => console.info(`Job ${job.attrs.name} finished. id: ${job.attrs._id}`))
  agenda.on('success', job => console.info(`Job ${job.attrs.name} succeeded. id: ${job.attrs._id}`))
  agenda.on('fail', job => console.warn(`Job ${job.attrs.name} failed`))

  await agenda.start()

  if (config.get('agenda.startPeriodicTasks')) {
    await agenda.now('processPastBridgeMappingEvents')
    await agenda.now('processPastTokenCreatedEvents')
    await agenda.every('10 minutes', 'processPastTokenCreatedEvents')

    // run the task every hour
    await agenda.every('00 * * * *', 'processPastTransferEvents')
    await agenda.now('processPastTransferEvents')
  }

  console.log('Agenda job scheduling is successfully defined')
}

module.exports = {
  start,
  agenda
}
