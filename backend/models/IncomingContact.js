import mongoose from 'mongoose'

const incomingContactSchema = new mongoose.Schema({
  fullName:      { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, default: '' },
  address:       { type: String, default: '' },
  age:           { type: Number },
  aadharNumber:  { type: String, default: '' },
  qualification: { type: String, default: '' },
  gender:        { type: String, default: '' },
  message:       { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('IncomingContact', incomingContactSchema)
