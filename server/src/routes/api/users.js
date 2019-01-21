const mongoose = require('mongoose')
const router = require('express').Router()
const sendWelcomeMail = require('@utils/mail').sendWelcomeMail

const User = mongoose.model('User')

router.post('/', async (req, res) => {
  const user = new User(req.body.user)

  const results = await user.save()

  sendWelcomeMail(user)

  res.json({
    object: 'user',
    data: results
  })
})

module.exports = router
