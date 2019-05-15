const { hasRole, roles: { ADMIN_ROLE, USER_ROLE, BUSINESS_ROLE, APPROVED_ROLE } } = require('@fuse/roles')

module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  const Schema = mongoose.Schema
  const EntitySchema = new Schema({
    account: { type: String, required: [true, "can't be blank"] },
    communityAddress: { type: String, required: [true, "can't be blank"] },
    uri: { type: String },
    name: { type: String },
    roles: { type: String, required: [true, "can't be blank"] }
  }, { timestamps: true })

  EntitySchema.index({ communityAddress: 1, account: 1 }, { unique: true })

  EntitySchema.virtual('isAdmin').get(function () {
    return hasRole(this.roles, ADMIN_ROLE)
  })

  EntitySchema.virtual('isApproved').get(function () {
    return hasRole(this.roles, APPROVED_ROLE)
  })

  EntitySchema.virtual('type').get(function () {
    if (hasRole(this.roles, BUSINESS_ROLE)) {
      return 'business'
    }
    if (hasRole(this.roles, USER_ROLE)) {
      return 'user'
    }
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
