const router = require('express').Router()

const auth = require('../auth')
const utils = require('../../utils')

router.get('/:protocol/:hash', async (req, res, next) => {
  const protocol = req.params.protocol
  const hash = req.params.hash
  const metadata = await utils.getMetadata(protocol, hash)
  res.json(metadata)
})

router.post('/', async (req, res, next) => {
  const metadata = Buffer.from(JSON.stringify(req.body.metadata))

  res.json(await utils.addMetadata(metadata))
})

module.exports = router
