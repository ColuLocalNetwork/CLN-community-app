const router = require('express').Router()
const handleReceipt = require('@utils/events/handlers').handleReceipt
const web3 = require('@services/web3')

router.post('/:transactionHash', async (req, res, next) => {
  console.log(req.params)
  const receipt = await web3.eth.getTransactionReceipt(req.params.transactionHash)
  console.log(receipt)
  await handleReceipt(receipt)
  return res.json({})
})

// router.post('/contract/:add', async (req, res, next) => {
//   const { receipt } = req.body
//   await handleReceipt(receipt)
//   return res.json({})
// })

module.exports = router
