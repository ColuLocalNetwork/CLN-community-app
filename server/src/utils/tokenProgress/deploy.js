const mongoose = require('mongoose')
const { deployBridge } = require('@utils/bridge')
const { deployCommunity } = require('@utils/community')
const { stepFailed, stepDone } = require('@utils/tokenProgress')
const { transferOwnership, fetchTokenData } = require('@utils/token')
const Token = mongoose.model('Token')
const TokenProgress = mongoose.model('TokenProgress')

const deployFunctions = {
  tokenIssued: console.log,
  bridge: deployBridge,
  membersList: deployCommunity,
  transferOwnership: transferOwnership
}

const stepsOrder = ['tokenIssued', 'bridge', 'membersList']

const mandatorySteps = {
  bridge: true
}

const deploy = async (tokenAddress, steps) => {
  if (steps.tokenIssued && steps.tokenIssued.isImported) {
    await fetchTokenData()
  }
  const tokenProgress = await TokenProgress.findOne({ tokenAddress })
  if (!tokenProgress || !tokenProgress.steps.tokenIssued) {
    return stepFailed('tokenIssued', tokenAddress, 'No such token issued')
  }
  const token = await Token.findOne({ address: tokenProgress.tokenAddress })

  if (!token) {
    return stepFailed('tokenIssued', tokenProgress.tokenAddress, 'No such token issued')
  }
  for (let step of stepsOrder) {
    if (steps[step]) {
      if (tokenProgress.steps[step]) {
        console.log(`${step} already deployed`)
      } else {
        try {
          const deployFunction = deployFunctions[step]
          await deployFunction(token, steps[step])
          await stepDone(step, token.address)
        } catch (error) {
          console.log(error)
          return stepFailed(step, tokenProgress.tokenAddress, `step ${step} failed`)
        }
      }
    } else {
      if (mandatorySteps[step] && !tokenProgress.steps[step]) {
        return stepFailed(step, tokenProgress.tokenAddress, `step ${step} should be mandatory`)
      }
    }
  }
}

module.exports = deploy
