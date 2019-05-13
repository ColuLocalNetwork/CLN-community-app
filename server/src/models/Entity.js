const { hasRole, roles: { ADMIN_ROLE } } = require('@fuse/roles')

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
    active: { type: Boolean, default: true }
  }, { timestamps: true })

  EntitySchema.index({ communityAddress: 1, account: 1 }, { unique: true })

  EntitySchema.virtual('isAdmin').get(function () {
    return hasRole(this.roles, ADMIN_ROLE)
  })

  EntitySchema.set('toJSON', {
    versionKey: false,
    virtuals: true
  })

  const Entity = mongoose.model('Entity', EntitySchema)

  function entity () {}

  entity.getModel = () => {
    return Entity
  }

  return entity
}
