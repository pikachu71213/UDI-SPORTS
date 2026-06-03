import mongoose from 'mongoose'

const committeeMemberSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  position:    { type: String, required: true },
  companyName: { type: String, default: '' },
  photo:       { type: String, default: null },
}, { timestamps: true })

export default mongoose.model('CommitteeMember', committeeMemberSchema)
