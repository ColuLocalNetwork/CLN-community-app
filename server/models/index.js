module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  mongoose.community = require('./Community')(mongoose)
  mongoose.metadata = require('./Metadata')(mongoose)
  return mongoose
}
