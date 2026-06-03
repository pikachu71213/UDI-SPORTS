import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Admin from '../models/Admin.js'
import { setResetToken, getResetToken, clearResetToken } from '../utils/resetTokenStore.js'
import { setResetOtp, verifyResetOtp, clearResetOtp } from '../utils/resetOtpStore.js'
import { sendOTPEmail, sendResetPasswordEmail } from '../utils/emailService.js'
import { ENV } from '../config/env.js'

const JWT_SECRET = ENV.jwtSecret
// Admin reset link must point to admin app (use ADMIN_URL when admin is on separate domain)
const ADMIN_BASE_URL = (process.env.ADMIN_URL || process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')

const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000))
const normalizeEmail = (value = '') => String(value).trim().toLowerCase()
const findAdminByEmail = async (email = '') => {
  const normalized = normalizeEmail(email)
  if (!normalized) return null
  return Admin.findOne({
    email: { $regex: `^${escapeRegex(normalized)}$`, $options: 'i' },
  })
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const normalizedEmail = normalizeEmail(email)
    const rawPassword = String(password)
    const trimmedPassword = rawPassword.trim()

    const admin = await Admin.findOne({
      email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: 'i' },
    })
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' })

    // Support both bcrypt-hashed and legacy plaintext passwords.
    let match = false
    if (typeof admin.password === 'string' && admin.password.startsWith('$2')) {
      match = await bcrypt.compare(rawPassword, admin.password)
      if (!match && rawPassword !== trimmedPassword) {
        match = await bcrypt.compare(trimmedPassword, admin.password)
      }
    } else {
      match = admin.password === rawPassword || admin.password === trimmedPassword
    }
    if (!match) return res.status(401).json({ message: 'Invalid email or password' })

    // Keep password secure after successful login.
    let shouldSaveAdmin = false
    if (!(typeof admin.password === 'string' && admin.password.startsWith('$2'))) {
      admin.password = await bcrypt.hash(trimmedPassword, 10)
      shouldSaveAdmin = true
    }
    if (shouldSaveAdmin) await admin.save()

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, admin: { id: admin._id, email: admin.email, name: admin.name } })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Login failed' })
  }
}

export const getProfile = async (req, res) => {
  try {
    return res.json({ admin: req.admin })
  } catch {
    return res.status(500).json({ message: 'Failed to get profile' })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new password required' })
    if (String(newPassword).trim().length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const admin = await Admin.findById(req.admin._id)
    if (!admin) return res.status(404).json({ message: 'Admin not found' })

    const rawCurrent = String(currentPassword)
    const trimmedCurrent = rawCurrent.trim()
    const rawNew = String(newPassword)
    const trimmedNew = rawNew.trim()

    let match = false
    if (typeof admin.password === 'string' && admin.password.startsWith('$2')) {
      match = await bcrypt.compare(rawCurrent, admin.password)
      if (!match && rawCurrent !== trimmedCurrent) {
        match = await bcrypt.compare(trimmedCurrent, admin.password)
      }
    } else {
      match = admin.password === rawCurrent || admin.password === trimmedCurrent
    }
    if (!match) return res.status(401).json({ message: 'Current password is wrong' })

    admin.password = await bcrypt.hash(trimmedNew, 10)
    await admin.save()
    return res.json({ message: 'Password updated' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Update failed' })
  }
}

export const logout = async (req, res) => {
  return res.json({ message: 'Logged out' })
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const em = normalizeEmail(email)
    if (!em) return res.status(400).json({ message: 'Email required' })

    const admin = await findAdminByEmail(em)
    if (!admin) {
      // Don't reveal if email exists
      return res.json({ message: 'If this email is registered, you will receive reset instructions.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    setResetToken(token, em)
    const resetLink = `${ADMIN_BASE_URL}/admin/reset-password?token=${token}`
    await sendResetPasswordEmail(em, resetLink)

    return res.json({ message: 'If this email is registered, you will receive reset instructions.' })
  } catch (e) {
    console.error('forgotPassword:', e)
    return res.status(500).json({ message: 'Failed to process request' })
  }
}

export const sendPasswordOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    if (!email) return res.status(400).json({ message: 'Email required' })

    const admin = await findAdminByEmail(email)
    if (!admin) {
      // Don't reveal whether email exists.
      return res.json({ message: 'If this email is registered, an OTP will be sent.' })
    }

    const otp = generateOtp()
    setResetOtp(email, otp)
    await sendOTPEmail(email, otp)
    return res.json({ message: 'OTP sent successfully' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to send OTP' })
  }
}

export const verifyPasswordOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const otp = String(req.body?.otp || '').trim()
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' })

    const admin = await findAdminByEmail(email)
    if (!admin) return res.status(400).json({ message: 'Invalid or expired OTP' })

    const isValid = verifyResetOtp(email, otp)
    if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' })

    return res.json({ message: 'OTP verified' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to verify OTP' })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, email, otp, newPassword } = req.body
    if (!newPassword) return res.status(400).json({ message: 'New password required' })
    if (String(newPassword).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    // Flow 1: token based reset link
    if (token) {
      const tokenEmail = getResetToken(token)
      if (!tokenEmail) return res.status(400).json({ message: 'Invalid or expired reset link. Please request a new one.' })

      const admin = await Admin.findOne({ email: tokenEmail })
      if (!admin) return res.status(400).json({ message: 'Invalid or expired reset link.' })

      admin.password = await bcrypt.hash(newPassword, 10)
      await admin.save()
      clearResetToken(token)
      return res.json({ message: 'Password updated. You can now sign in.' })
    }

    // Flow 2: OTP based reset
    const normalizedEmail = normalizeEmail(email)
    const normalizedOtp = String(otp || '').trim()
    if (!normalizedEmail || !normalizedOtp) return res.status(400).json({ message: 'Email and OTP required' })

    const admin = await findAdminByEmail(normalizedEmail)
    if (!admin) return res.status(400).json({ message: 'Invalid or expired OTP' })

    const isValidOtp = verifyResetOtp(normalizedEmail, normalizedOtp)
    if (!isValidOtp) return res.status(400).json({ message: 'Invalid or expired OTP' })

    admin.password = await bcrypt.hash(newPassword, 10)
    await admin.save()
    clearResetOtp(normalizedEmail)
    return res.json({ message: 'Password updated. You can now sign in.' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to reset password' })
  }
}
