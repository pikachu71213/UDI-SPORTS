import mongoose from 'mongoose'

const incomingMemberSchema = new mongoose.Schema({
  formType:        { type: String, enum: ['general-member', 'special-member', 'membership-query'], required: true },
  category:        { type: String, default: '' }, // individual | player | corporate (website tabs)
  memberType:      { type: String, default: '' },
  membershipType:  { type: String, default: '' },
  fullName:        { type: String, default: '' },
  age:             { type: Number },
  gender:          { type: String, default: '' },
  phone:           { type: String, default: '' },
  companyName:     { type: String, default: '' },
  email:           { type: String, default: '' },
  aadharNumber:    { type: String, default: '' },
  panNumber:       { type: String, default: '' },
  qualification:   { type: String, default: '' },
  fullAddress:     { type: String, default: '' },
  sportsInterest:  { type: String, default: '' },
  utrNumber:       { type: String, default: '' },
  amount:          { type: String, default: '' },
  paymentSender:   { type: String, default: '' },
  designation:     { type: String, default: '' },
  organization:    { type: String, default: '' },
  linkedin:        { type: String, default: '' },
  contribution:    { type: String, default: '' },
  termsAccepted:   { type: Boolean, default: false },
  message:         { type: String, default: '' },
  photo:           { type: String, default: null },
}, { timestamps: true })

export default mongoose.model('IncomingMember', incomingMemberSchema)
