import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS = process.env.UPLOADS_DIR || 'uploads'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Keep all image uploads in one stable folder so stored DB paths stay consistent.
    const dir = path.join(__dirname, '..', UPLOADS, 'image')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // Different devices/browsers may send inconsistent file MIME metadata.
  // Do not block here based on type; keep only size constraint at middleware level.
  fileFilter: (req, file, cb) => cb(null, true),
})

export const uploadFields = (fields) => upload.fields(fields)
export const uploadSingle = (fieldName) => upload.single(fieldName)
