const router = require('express').Router()
const mongoose = require('mongoose')
const Community = mongoose.model('Community')
const CommunityProgress = mongoose.model('CommunityProgress')
const deploy = require('@utils/deploy')

router.get('/', async (req, res, next) => {
  const { tokenAddress } = req.query
  const community = await Community.findOne({ tokenAddress }).lean()
  return res.json({ data: community })
})

router.get('/:communityAddress', async (req, res, next) => {
  const { listAddress } = req.params
  const community = await Community.findOne({ listAddress }).lean()
  return res.json({ data: community })
})

// const getCommunityProgress = ({ communityAddress }) => communityAddress ? CommunityProgress.find({ communityAddress }) : new CommunityProgress()

router.post('/deploy', async (req, res, next) => {
  // const communityProgress = await getCommunityProgress(req.query)
  // const { foreignTokenAddress } = req.params
  const { steps } = req.body
  const communityProgress = await new CommunityProgress({ steps: { ...steps, transferOwnership: true } }).save()

  deploy(communityProgress)

  return res.json({ data: communityProgress })
})

module.exports = router
