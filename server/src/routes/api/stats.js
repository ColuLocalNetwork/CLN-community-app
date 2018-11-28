const router = require('express').Router()
const mongoose = require('mongoose')
const Event = mongoose.model('Event')

router.get('/:address', async (req, res, next) => {
  const data = await Event.aggregate([
    {
      $match: {
        eventName: 'Transfer',
        address: req.params.address
      },
      $addFields: {
        convertedValue: { $toDecimal: '$returnValues.value' }
      }
    },
    {
      $group: {
        _id: {month: {$month: '$timestamp'}},
        count: {$sum: 1},
        volume: {$sum: '$convertedValue'}
      }
    }
  ])

  return res.json({data})
})

module.exports = router
