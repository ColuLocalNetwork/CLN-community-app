const mongoose = require('mongoose')
const router = require('express').Router()
const mailUtils = require('@utils/mail')

const User = mongoose.model('User')

router.post('/', async (req, res) => {
  const user = new User(req.body.user)

  // const results = await user.save()
  const results = user
  mailUtils.sendWelcomeMail(user)

  if (user.subscribe) {
    mailUtils.subscribeUser(user)
  }

  res.json({
    object: 'user',
    data: results
  })
})

// router.post('/verify', async (req, res) => {
//   const user = new User(req.body.user)
//
//   const results = await user.save()
//
//   sendWelcomeMail(user)
//
//   res.json({
//     object: 'user',
//     data: results
//   })
// })

module.exports = router
