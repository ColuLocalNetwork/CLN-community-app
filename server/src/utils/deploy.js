const mongoose = require('mongoose')
const { deployBridge } = require('@utils/bridge')
const { deployCommunity } = require('@utils/community')
const { transferOwnership } = require('@utils/token/ownership')
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
  community: true
}

const deploy = async (communityProgress) => {
  for (let stepName of stepsOrder) {
    const currentStep = communityProgress.steps[stepName]

    const stepFailed = async (msg, error) => {
      console.error(error)
      console.log(msg)
      currentStep.error = msg
      await communityProgress.save()
      return error || Error(msg)
    }

    if (!currentStep && mandatorySteps[stepName]) {
      throw stepFailed(`step ${stepName} should be mandatory, communityProgress: ${communityProgress}`)
    }

    if (communityProgress.steps[stepName.done]) {
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
  const { communityAddress } = steps.community.results
  const { homeTokenAddress, foreignTokenAddress, foreignBridgeAddress, homeBridgeAddress } = steps.bridge.results

  new Community({
    communityAddress,
    homeTokenAddress,
    foreignTokenAddress,
    foreignBridgeAddress,
    homeBridgeAddress
  }).save()

  await CommunityProgress.findByIdAndUpdate(communityProgress._id, { communityAddress, done: true })

  console.log('Community deploy is done')
}

module.exports = deploy
