const router = require('express').Router()
const mongoose = require('mongoose')
const CommunityProgress = mongoose.model('CommunityProgress')
const { agenda } = require('@services/agenda')

/**
 * @apiDefine DeploymentData
 * @apiSuccess {String} _id Id of the deploy progress
 * @apiSuccess {Object} steps Steps with info about each step
 * @apiSuccess {String} communityAddress Community address if deploy process is completed
 * @apiSuccess {Boolean} done Done status if the deploy process is completed
 */

/**
 * @api {get} /deployments/:id Fetch deployment progress by id
 * @apiName GetDeployment
 * @apiGroup Deployment
 *
 * @apiParam {String} id Auto Generated by the database
 *
 * @apiUse DeploymentData
 */
router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  const communityProgress = await CommunityProgress.findById(id)
  return res.json({ data: communityProgress })
})

/**
 * @api {get} /deployments Fetch deployment progress by community address
 * @apiName GetDeploymentByCommunityAddress
 * @apiGroup Deployment
 *
 * @apiParam {String} communityAddress Community address
 *
 * @apiUse DeploymentData
 */
router.get('/', async (req, res, next) => {
  const { communityAddress } = req.query
  const communityProgress = await CommunityProgress.findOne({ communityAddress })
  return res.json({ data: communityProgress })
})

/**
 * @api {post} /communities/deploy Start deployment process
 * @apiName DeployCommunity
 * @apiGroup Deployment
 *
 * @apiParam {Object} steps The steps (with arguments) to deploy
 *
 * @apiSuccess {Object} steps Steps to deploy
 */

router.post('/', async (req, res, next) => {
  const { steps } = req.body
  const communityProgress = await new CommunityProgress({ steps }).save()

  agenda.now('deploy', { communityProgressId: communityProgress._id })
  return res.json({ data: communityProgress })
})

module.exports = router
