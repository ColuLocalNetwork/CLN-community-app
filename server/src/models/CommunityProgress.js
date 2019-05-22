
module.exports = (mongoose) => {
  mongoose = mongoose || require('mongoose')
  const Schema = mongoose.Schema

  const CommunityProgressSchema = new Schema({
    communityAddress: { type: String, required: [true, "can't be blank"] },
    steps: { type: Object, default: {} },
    stepErrors: { type: Object }
  }, { timestamps: true })

  CommunityProgressSchema.index({ communityAddress: 1 }, { unique: true })

  CommunityProgressSchema.set('toJSON', {
    versionKey: false
  })

  const CommunityProgress = mongoose.model('CommunityProgress', CommunityProgressSchema)

  function communityProgress () {}

  communityProgress.getModel = () => {
    return CommunityProgress
  }

  return communityProgress
}
