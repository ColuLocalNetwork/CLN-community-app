const mongoose = require('mongoose')
const Account = mongoose.model('Token')

const lockAccount = async (bridgeType) => {
  return Account.updateOne({ bridgeType, isLocked: false }, { isLocked: true, lockingTime: new Date() })
}

const unlockAccount = async (bridgeType, account) => {
  return Account.updateOne({ bridgeType, account }, { isLocked: false, lockingTime: null })
}

module.exports = {
  lockAccount,
  unlockAccount
}
