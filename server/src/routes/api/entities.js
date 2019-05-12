const paginate = require('express-paginate')
const router = require('express').Router()
const mongoose = require('mongoose')
const Entity = mongoose.model('Entity')
const metadataUtils = require('@utils/metadata')
const { addUser } = require('@utils/usersRegistry')

router.put('/:account', async (req, res) => {
  const { account } = req.params
  const { name, type } = req.body.metadata
  const { hash } = await metadataUtils.createMetadata(req.body.metadata)
  const uri = `ipfs://${hash}`

  try {
    await addUser(account, uri)
  } catch (err) {
    console.log('user already added to User Registry')
  }

  const entity = await Entity.findOneAndUpdate({ account }, { uri, type, name }, { new: true, upsert: true })
  return res.json({ data: entity })
})

router.get('/:account', async (req, res, next) => {
  const { account } = req.params
  const business = await Entity.findOne({ account }).lean()

  return res.json({ data: business })
})

const getQueryFilter = ({ query: { type, communityAddress } }) =>
  type ? { type, communityAddress } : { communityAddress }

router.get('/', async (req, res, next) => {
  const queryFilter = getQueryFilter(req)
  let [ results, itemCount ] = await Promise.all([
    Entity.find(queryFilter).sort({ name: 1 }).limit(req.query.limit).skip(req.skip).lean(),
    Entity.estimatedDocumentCount({})
  ])

  console.log(results)

  const pageCount = Math.ceil(itemCount / req.query.limit)

  res.json({
    object: 'list',
    has_more: paginate.hasNextPages(req)(pageCount),
    data: results
  })
})

module.exports = router
