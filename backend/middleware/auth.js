import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { ENV } from '../config/env.js'

const JWT_SECRET = ENV.jwtSecret

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Authentication required' })
    const decoded = jwt.verify(token, JWT_SECRET)
    const admin = await Admin.findById(decoded.id).select('-password')
    if (!admin) return res.status(401).json({ message: 'Invalid token' })
    req.admin = admin
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
