
module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  const Schema = mongoose.Schema
  const BusinessSchema = new Schema({
    listAddress: {type: String, required: [true, "can't be blank"]},
    name: {type: String, required: [true, "can't be blank"]},
    hash: {type: String, required: [true, "can't be blank"]},
    active: {type: Boolean, default: true}
  })

  const Business = mongoose.model('Business', BusinessSchema)

  function business () {}

  business.getModel = () => {
    return Business
  }

  return business
}
