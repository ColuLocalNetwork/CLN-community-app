const mongoose = require('mongoose')
const { deployBridge } = require('@utils/bridge')
const { deployCommunity } = require('@utils/community')
const { stepFailed, stepDone } = require('@utils/tokenProgress')
const { transferOwnership } = require('@utils/token')
const Token = mongoose.model('Token')

const deployFunctions = {
  bridge: deployBridge,
  membersList: deployCommunity,
  transferOwnership: transferOwnership
}

const stepsOrder = ['bridge', 'membersList', 'transferOwnership']

const mandatorySteps = {
  bridge: true
}

const deploy = async (tokenProgress, steps) => {
  const token = await Token.findOne({ address: tokenProgress.tokenAddress })

  if (!token) {
    return stepFailed('tokenIssued', tokenProgress.tokenAddress, 'No such token issued')
  }
  for (let stepName of stepsOrder) {
    if (steps[stepName]) {
      if (tokenProgress.steps[stepName]) {
        console.log(`${stepName} already deployed`)
      } else {
        try {
          console.log(`starting step ${stepName}`)
          const deployFunction = deployFunctions[stepName]
          await deployFunction(token, steps[stepName])
          await stepDone(stepName, token.address)
        } catch (error) {
          console.log(error)
          return stepFailed(stepName, tokenProgress.tokenAddress, `step ${stepName} failed`)
        }
      }
    } else {
      if (mandatorySteps[stepName] && !tokenProgress.steps[stepName]) {
        return stepFailed(stepName, tokenProgress.tokenAddress, `step ${stepName} should be mandatory`)
      }
    }
  }
}

module.exports = deploy
