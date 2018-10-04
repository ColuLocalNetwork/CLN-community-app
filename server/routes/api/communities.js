const router = require('express').Router()
const mongoose = require('mongoose')
const utils = require('../../utils/subscriber')

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
  // console.log(req.body.community)
  const {receipt} = req.body.community
  console.log(receipt.events.TokenCreated)
  await utils.processTokenCreatedEvent(receipt.events.TokenCreated)
  // const community = new Community({...req.body.community, verified: false})
  // await community.save()
  // return res.json({data: community})
  return res.json({})
})

module.exports = router
