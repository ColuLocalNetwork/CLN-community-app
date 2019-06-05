const router = require('express').Router()
const mongoose = require('mongoose')
const Community = mongoose.model('Community')

/**
 * @apiDefine CommunityData
 * @apiSuccess {Boolean} isClosed
 * @apiSuccess {String} communityAddress
 * @apiSuccess {String} homeTokenAddress
 * @apiSuccess {String} foreignTokenAddress
 * @apiSuccess {String} foreignBridgeAddress
 * @apiSuccess {String} homeBridgeAddress
 */

/**
 * @apiDefine CommunityProgressData
 * @apiSuccess {String} _id Id of the deploy progress
 * @apiSuccess {Object} steps Steps with info about each step
 * @apiSuccess {String} communityAddress Community address if deploy process is completed
 * @apiSuccess {Boolean} done Done status if the deploy process is completed
 */

/**
 * @api {get} /communities/:communityAddress Fetch community by community address
 * @apiName GetCommunity
 * @apiGroup Community
 *
 * @apiParam {String} communityAddress Community address
 *
 * @apiUse CommunityData
 */
router.get('/:communityAddress', async (req, res, next) => {
  const { communityAddress } = req.params
  const community = await Community.findOne({ communityAddress }).lean()
  return res.json({ data: community })
})

module.exports = router
