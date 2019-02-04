const mongoose = require('mongoose')
const router = require('express').Router()
const sendgridUtils = require('@utils/sendgrid')
const sigUtil = require('eth-sig-util')
const config = require('config')
const moment = require('moment')

const User = mongoose.model('User')
const chainId = config.get('web3.chainId')

const generateSignatureData = ({ accountAddress, date, chainId }) => {
  return { types: {
    EIP712Domain: [
      { name: 'name', type: 'string' }, { name: 'version', type: 'string' }, { name: 'chainId', type: 'uint256' }
    ],
    Person: [{ name: 'wallet', type: 'address' }],
    Login: [
      { name: 'account', type: 'string' },
      { name: 'date', type: 'string' },
      { name: 'content', type: 'string' }
    ]
  },
  primaryType: 'Login',
  domain: { name: 'CLN Communities QA', version: '1', chainId },
  message: { account: accountAddress, date, content: 'Login request' }
  }
}

router.post('/', async (req, res) => {
  const user = new User(req.body.user)

  const results = await user.save()

  // TODO: waiting for email templates
  // sendgridUtils.sendWelcomeMail(user)

  if (user.subscribe) {
    sendgridUtils.subscribeUser(user)
  }

  res.json({
    object: 'user',
    data: results
  })
})

router.post('/login/:accountAddress', async (req, res) => {
  const {signature, date} = req.body
  const {accountAddress} = req.params

  const signatureDate = moment(date)
  if (!signatureDate.isValid()) {
    return res.status(400).json({
      error: 'Bad date supplied'
    })
  }

  const now = moment()
  if (now.diff(signatureDate, 'minutes') > 5 || now.diff(signatureDate, 'minutes') < 0) {
    return res.status(400).json({
      error: 'Bad date supplied'
    })
  }

  const recoveredAccount = sigUtil.recoverTypedSignature({
    data: generateSignatureData({accountAddress, date, chainId}),
    sig: signature
  })

  if (recoveredAccount !== accountAddress.toLowerCase()) {
    return res.status(400).json({
      error: 'Bad signature supplied'
    })
  }

  res.json({verified: recoveredAccount === accountAddress.toLowerCase(), recoveredAccount})
})

module.exports = router
