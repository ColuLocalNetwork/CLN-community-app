const router = require('express').Router()
const mongoose = require('mongoose')
const Token = mongoose.model('Token')
const paginate = require('express-paginate')

router.get('/', async (req, res, next) => {
  const [ results, itemCount ] = await Promise.all([
    Token.find({}).sort({blockNumber: -1}).limit(req.query.limit).skip(req.skip).lean(),
    Token.estimatedDocumentCount()
  ])

  const pageCount = Math.ceil(itemCount / req.query.limit)

  res.json({
    object: 'list',
    has_more: paginate.hasNextPages(req)(pageCount),
    data: results
  })
})

router.get('/owner/:owner', async (req, res) => {
  const {owner} = req.params
  const results = await Token.find({ owner }).sort({ blockNumber: -1 }).lean()

  res.json({
    object: 'list',
    data: results
  })
})

router.get('/:address', async (req, res, next) => {
  const {address} = req.params
  const token = await Token.findOne({ address }).lean()
  return res.json({ data: token })
})

module.exports = router
