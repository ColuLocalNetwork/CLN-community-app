
module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  const Schema = mongoose.Schema

  const EntityDirectorySchema = new Schema({
    address: {type: String, required: [true, "can't be blank"]},
    network: {type: String, required: [true, "can't be blank"]},
    ccAddress: {type: String, required: [true, "can't be blank"]},
    blockNumber: {type: Number}
  }, {timestamps: true})

  EntityDirectorySchema.index({address: 1}, {unique: true})
  EntityDirectorySchema.index({ccAddress: 1})

  EntityDirectorySchema.set('toJSON', {
    versionKey: false
  })

  const EntityDirectory = mongoose.model('EntityDirectory', EntityDirectorySchema)

  function community () {}

  community.getModel = () => {
    return EntityDirectory
  }

  return community
}
