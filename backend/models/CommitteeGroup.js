import mongoose from 'mongoose'

const committeeMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, default: '', trim: true },
    image: { type: String, default: null },
  },
  { _id: true }
)

const committeeGroupSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    shortLabel: { type: String, required: true, trim: true },
    icon: { type: String, default: '🏛️', trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    cardVariant: { type: String, default: 'orange', trim: true },
    members: { type: [committeeMemberSchema], default: [] },
  },
  { timestamps: true }
)

committeeGroupSchema.index({ createdAt: -1 })

export default mongoose.model('CommitteeGroup', committeeGroupSchema)
