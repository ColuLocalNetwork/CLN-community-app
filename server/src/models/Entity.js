
module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  const Schema = mongoose.Schema
  const EntitySchema = new Schema({
    account: { type: String, required: [true, "can't be blank"] },
    communityAddress: { type: String, required: [true, "can't be blank"] },
    uri: { type: String },
    name: { type: String },
    type: { type: String },
    roles: { type: String, required: [true, "can't be blank"] },
    isAdmin: { type: String, default: false },
    active: { type: Boolean, default: true }
  })

  EntitySchema.index({ communityAddress: 1, account: 1 }, { unique: true })

  const Entity = mongoose.model('Entity', EntitySchema)

  function entity () {}

  entity.getModel = () => {
    return Entity
  }

  return entity
}
