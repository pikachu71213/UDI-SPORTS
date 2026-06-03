import { Router } from 'express'
import * as ctrl from '../controllers/blogController.js'
import { authMiddleware } from '../middleware/auth.js'
import { uploadSingle } from '../middleware/upload.js'

const r = Router()
r.use(authMiddleware)

r.get('/', ctrl.getBlogs)
r.get('/:id', ctrl.getBlog)
r.post('/', uploadSingle('image'), ctrl.addBlog)
r.put('/:id', uploadSingle('image'), ctrl.updateBlog)
r.delete('/:id', ctrl.deleteBlog)

export default r
