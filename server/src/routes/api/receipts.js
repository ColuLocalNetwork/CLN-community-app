const router = require('express').Router()
const handleReceipt = require('@events/handlers').handleReceipt
const handleEvent = require('@events/handlers').handleEvent

router.post('/', async (req, res, next) => {
  const { receipt } = req.body
  await handleReceipt(receipt)
  return res.json({})
})

router.post('/event', async (req, res, next) => {
  const { event } = req.body
  await handleEvent(event)
  return res.json({})
})

module.exports = router
