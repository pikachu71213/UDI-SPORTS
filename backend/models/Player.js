import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
  playerName:  { type: String, required: true },
  sportsName:  { type: String, required: true },
  gender:      { type: String, enum: ['male', 'female', 'other'], default: '' },
  achievement: { type: String, default: '' },
  photo:       { type: String, default: null },
}, { timestamps: true })

playerSchema.index({ createdAt: -1 })
playerSchema.index({ sportsName: 1, createdAt: -1 })

export default mongoose.model('Player', playerSchema)
