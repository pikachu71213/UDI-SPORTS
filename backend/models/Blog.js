import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  heading:      { type: String, required: true },
  pageName:     { type: String, required: true },
  shortContent: { type: String, required: true },
  content:      { type: String, default: '' },
  image:        { type: String, default: null },
  category:     { type: String, default: '' },
  author:       { type: String, default: '' },
  readTime:     { type: String, default: '' },
  tags:         [{ type: String }],
}, { timestamps: true })

blogSchema.index({ createdAt: -1 })
blogSchema.index({ category: 1, createdAt: -1 })
blogSchema.index({ pageName: 1, createdAt: -1 })

export default mongoose.model('Blog', blogSchema)
