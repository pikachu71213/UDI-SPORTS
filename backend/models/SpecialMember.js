import mongoose from 'mongoose'

const specialMemberSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  companyName: { type: String, default: '' },
  membershipCategory: {
    type: String,
    enum: [ 'Body Corporate','Diamond', 'Gold', 'Silver', 'Dignitaries', 'Celebrity'],
    default: 'Silver',
  },
  photo:       { type: String, default: null },
}, { timestamps: true })

specialMemberSchema.index({ membershipCategory: 1, createdAt: -1 })
specialMemberSchema.index({ createdAt: -1 })

export default mongoose.model('SpecialMember', specialMemberSchema)
