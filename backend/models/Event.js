import mongoose from 'mongoose'

const squadMemberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
)

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    captain: { type: String, default: '', trim: true },
    img: { type: String, default: null },
    members: { type: [squadMemberSchema], default: [] },
  },
  { _id: false }
)

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    sport: { type: String, required: true, trim: true },
    date: { type: String, default: '' },
    location: { type: String, default: '', trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    teamA: { type: teamSchema, required: true },
    teamB: { type: teamSchema, required: true },
  },
  { timestamps: true }
)

eventSchema.index({ createdAt: -1 })
eventSchema.index({ date: -1 })

export default mongoose.model('Event', eventSchema)
