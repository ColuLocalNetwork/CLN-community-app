const mongoose = require('mongoose')
const { deployBridge } = require('./bridge')
const { deployCommunity } = require('./community')
const { transferOwnership } = require('./token')
const { lockAccount, unlockAccount } = require('@utils/account')
const CommunityProgress = mongoose.model('CommunityProgress')
const Community = mongoose.model('Community')

const deployFunctions = {
  community: deployCommunity,
  bridge: deployBridge,
  transferOwnership
}

const stepsOrder = ['community', 'bridge', 'transferOwnership']

const mandatorySteps = {
  bridge: true,
  community: true,
  transferOwnership: true
}

const deploy = async ({ communityProgressId }) => {
  let communityProgress = await CommunityProgress.findById(communityProgressId)

  const account = await lockAccount()
  communityProgress = CommunityProgress.findByIdAndUpdate(communityProgress._id, { account })

  for (let stepName of stepsOrder) {
    const currentStep = communityProgress.steps[stepName]

    const stepFailed = async (errorMsg, error) => {
      console.error(error)
      console.log(errorMsg)
      await CommunityProgress.findByIdAndUpdate(communityProgress._id,
        { [`steps.${stepName}`]: { ...currentStep, done: false, error: errorMsg } },
        { new: true })
      return error || Error(errorMsg)
    }

    if (!currentStep && mandatorySteps[stepName]) {
      throw stepFailed(`step ${stepName} should be mandatory`)
    }

    if (communityProgress.steps[stepName].done) {
      console.log(`${stepName} already deployed`)
    } else {
      try {
        console.log(`starting step ${stepName}`)
        const deployFunction = deployFunctions[stepName]
        const results = await deployFunction(communityProgress)
        communityProgress = await CommunityProgress.findByIdAndUpdate(communityProgress._id,
          { [`steps.${stepName}`]: { ...currentStep, done: true, results } },
          { new: true })
        console.log(`step ${stepName} done`)
      } catch (error) {
        throw stepFailed(`step ${stepName} failed`, error)
      }
    }
  }
  const { steps } = communityProgress
  const { communityAddress, isClosed } = steps.community.results
  const { homeTokenAddress, foreignTokenAddress, foreignBridgeAddress, homeBridgeAddress } = steps.bridge.results

  new Community({
    communityAddress,
    isClosed,
    homeTokenAddress,
    foreignTokenAddress,
    foreignBridgeAddress,
    homeBridgeAddress
  }).save()

  await CommunityProgress.findByIdAndUpdate(communityProgress._id, { communityAddress, done: true })
  await unlockAccount(account)

  console.log('Community deploy is done')
}

module.exports = {
  deploy
}
