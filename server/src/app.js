require('module-alias/register')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const config = require('config')
const paginate = require('express-paginate')
const process = require('process')
const agenda = require('./services/agenda')
const util = require('util')
const addBridgeForToken = require('@utils/bridge').addBridgeForToken

const token = {
  '_id': '5c616695cbfc015d31fd055b',
  'owner': '0x28eF70800b19B3bf15bF8210f351a95F15613aeb',
  'blockNumber': 4997976,
  'factoryAddress': '0x824E01Cf7013f459Aa010D73627B006a8740b183',
  'address': '0x92b894A3c389bEE987A09d3217d55B70a696a15c',
  'name': 'ABC',
  'symbol': 'ABC',
  'totalSupply': '1000000000000000000000000',
  'tokenURI': 'ipfs://QmP5QKd7Wn7GChop3gcVvy4F4r58E2bhAKcxemKr4kjT73',
  'createdAt': '2019-02-11T12:12:05.763Z',
  'updatedAt': '2019-02-11T12:12:05.763Z'
}

addBridgeForToken(token)
// require('express-async-errors')
//
// console.log('The server configurations are:')
// console.log(util.inspect(config, {depth: null}))
//
// var isProduction = process.env.NODE_ENV === 'production'
//
// var app = express()
//
// if (config.get('api.allowCors')) {
//   const cors = require('cors')
//   app.use(cors())
// }
//
// app.use(morgan('common'))
//
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
//
// app.use(paginate.middleware(10, 50))
//
// app.use(express.static(path.join(__dirname, '../public')))
//
// // react-router routing
// app.get('/view/*', function (request, response) {
//   response.sendFile(path.resolve(__dirname, '../public', 'index.html'))
// })
//
// mongoose.set('debug', config.get('mongo.debug'))
//
// // cloning options object cause mongoose is filling it with unneeded data about the connection
// mongoose.connect(config.get('mongo.uri'), config.get('mongo.options')).catch((error) => {
//   console.error(error)
//   process.exit(1)
// })
//
// require('./models')(mongoose)
//
// app.use(require('./routes'))
//
// agenda.start()
//
// /// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })
//
// /// error handlers
// if (!isProduction) {
//   app.use(function (err, req, res, next) {
//     console.log(err.stack)
//
//     res.status(err.status || 500)
//
//     res.json({'errors': {
//       message: err.message,
//       error: err
//     }})
//   })
// } else {
//   app.use(function (err, req, res, next) {
//     res.status(err.status || 500)
//     res.json({'errors': {
//       message: err.message,
//       error: {}
//     }})
//   })
// }
//
// // finally, let's start our server...
// var server = app.listen(config.get('api.port') || 8080, function () {
//   console.log('Listening on port ' + server.address().port)
// })
