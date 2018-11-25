const router = require('express').Router()
const processReceipt = require('@utils/events/process').processReceipt

router.post('/', async (req, res, next) => {
  const { receipt } = req.body
  await processReceipt(receipt)
  return res.json({})
})

module.exports = router
