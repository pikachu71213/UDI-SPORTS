import mongoose from 'mongoose'

const generalMemberSchema = new mongoose.Schema({
  type:            { type: String, enum: ['individual', 'players', 'body-corporate'], required: true },
  name:            { type: String, required: true },
  email:           { type: String },
  phone:           { type: String },
  companyName:     { type: String },
  contactPerson:  { type: String },
}, { timestamps: true })

generalMemberSchema.index({ type: 1, createdAt: -1 })
generalMemberSchema.index({ createdAt: -1 })

export default mongoose.model('GeneralMember', generalMemberSchema)
