module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  mongoose.community = mongoose.community || require('./Community')(mongoose)
  mongoose.metadata = mongoose.metadata || require('./Metadata')(mongoose)
  mongoose.event = mongoose.event || require('./Event')(mongoose)
  mongoose.user = mongoose.user || require('./User')(mongoose)
  mongoose.token = mongoose.token || require('./Token')(mongoose)
  return mongoose
}
