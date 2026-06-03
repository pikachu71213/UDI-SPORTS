import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { ENV, assertRequiredEnv } from './config/env.js'

import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import memberRoutes from './routes/memberRoutes.js'
import playerRoutes from './routes/playerRoutes.js'
import incomingRoutes from './routes/incomingRoutes.js'
import publicRoutes from './routes/publicRoutes.js'
import eventRoutes from './routes/eventRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000
const UPLOADS = process.env.UPLOADS_DIR || 'uploads'
const AUTH_LIMIT_WINDOW_MS = 15 * 60 * 1000
const REQUEST_TIMEOUT_MS = 30 * 1000

assertRequiredEnv()

app.set('trust proxy', 1)

const corsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin(origin, callback) {
    // Allow non-browser clients (curl, health checks) without Origin header.
    if (!origin) return callback(null, true)
    const normalized = String(origin).replace(/\/$/, '')
    if (!ENV.isProduction || ENV.corsOrigins.has(normalized)) return callback(null, true)
    const err = new Error(`Origin not allowed by CORS: ${origin}`)
    err.status = 403
    return callback(err)
  },
}

const authLimiter = rateLimit({
  windowMs: AUTH_LIMIT_WINDOW_MS,
  max: ENV.isProduction ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: ENV.isProduction ? 120 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' },
})

app.use(helmet())
app.use(cors(corsOptions))
app.use((req, res, next) => {
  res.setTimeout(REQUEST_TIMEOUT_MS, () => {
    if (!res.headersSent) res.status(504).json({ message: 'Request timeout' })
  })
  next()
})
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/uploads', express.static(path.join(__dirname, UPLOADS)))

app.use('/api', apiLimiter)
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/players', playerRoutes)
app.use('/api/incoming', incomingRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/events', eventRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true, message: 'UDI API running' }))

// 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  const message = ENV.isProduction && status === 500 ? 'Server error' : (err.message || 'Server error')
  res.status(status).json({ message })
})

async function start() {
  try {
    await mongoose.connect(ENV.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
    console.log('MongoDB connected')
  } catch (e) {
    console.error('MongoDB connection failed:', e.message)
    process.exit(1)
  }
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
}

start()
