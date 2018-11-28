const router = require('express').Router()
const mongoose = require('mongoose')
const Event = mongoose.model('Event')

router.get('/:address', async (req, res, next) => {
  const interval = req.query.interval || 'month'

  if (interval !== 'month' && interval !== 'week') {
    throw Error('Bad interval parameter, correct values for interval is "month" or "week"')
  }

  const stats = await Event.aggregate([
    {
      $match: {
        eventName: 'Transfer',
        address: req.params.address
      }
    },
    {
      $group: {
        _id: {[interval]: {[`$${interval}`]: '$timestamp'}},
        totalCount: {$sum: 1},
        volume: {$sum: {$toDecimal: '$returnValues.value'}}
      }
    },
    {
      $project: {
        volume: {$toString: '$volume'},
        totalCount: 1
      }
    }
  ])

  return res.json({
    object: 'list',
    data: stats
  })
})

module.exports = router
