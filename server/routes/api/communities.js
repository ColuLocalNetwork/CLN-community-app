const router = require('express').Router()
const mongoose = require('mongoose')
const utils = require('../../utils/events')

const Community = mongoose.model('Community')

router.get('/', async (req, res, next) => {
  const communities = await Community.find()
  return res.json({data: communities})
})

router.get('/:address', async (req, res, next) => {
  const address = req.params.address
  const community = await Community.findOne({address})
  return res.json({data: community})
})

router.post('/', async (req, res, next) => {
  const {receipt} = req.body.community
  await utils.processTokenCreatedEvent(receipt.events.TokenCreated)
  return res.json({})
})

module.exports = router
