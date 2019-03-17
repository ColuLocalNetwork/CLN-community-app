const router = require('express').Router()
const mongoose = require('mongoose')
const Business = mongoose.model('Business')
const paginate = require('express-paginate')

router.get(':/listAddress', async (req, res, next) => {
  const {listAddress} = req.params
  const [ results, itemCount ] = await Promise.all([
    Business.find({listAddress}).sort({name: 1}).limit(req.query.limit).skip(req.skip),
    Business.count({})
  ])

  const pageCount = Math.ceil(itemCount / req.query.limit)

  res.json({
    object: 'list',
    has_more: paginate.hasNextPages(req)(pageCount),
    data: results
  })
})

module.exports = router
