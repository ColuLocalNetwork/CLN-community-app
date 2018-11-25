const router = require('express').Router()
const mongoose = require('mongoose')
const Community = mongoose.model('Community')
const processTokenCreatedEvent = require('@utils/events/process').processTokenCreatedEvent
const processOpenMarketEvent = require('@utils/events/process').processOpenMarketEvent
const paginate = require('express-paginate')

router.get('/', async (req, res, next) => {
  const [ results, itemCount ] = await Promise.all([
    Community.find({}).limit(req.query.limit).skip(req.skip),
    Community.count({})
  ])

  const pageCount = Math.ceil(itemCount / req.query.limit)

  res.json({
    object: 'list',
    has_more: paginate.hasNextPages(req)(pageCount),
    data: results
  })
})

router.get('/owner/:address', async (req, res) => {
  const owner = req.params.address
  const results = await Community.find({ owner }).sort({ blockNumber: -1 })

  res.json({
    object: 'list',
    data: results
  })
})

router.get('/:address', async (req, res, next) => {
  const ccAddress = req.params.address
  const community = await Community.findOne({ ccAddress })
  return res.json({ data: community })
})

router.post('/', async (req, res, next) => {
  const { receipt } = req.body
  await processTokenCreatedEvent(receipt.events.TokenCreated)
  return res.json({})
})

router.post('/openMarket', async (req, res, next) => {
  const { receipt } = req.body
  await processOpenMarketEvent(receipt.events.OpenMarket)
  return res.json({})
})

module.exports = router
