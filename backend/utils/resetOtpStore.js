/**
 * In-memory store for password reset OTP.
 * Email -> { otp, expiresAt }. Expiry 10 minutes.
 */

const EXPIRY_MS = 10 * 60 * 1000
const store = new Map()

const normalizeEmail = (email = '') => String(email).trim().toLowerCase()

export function setResetOtp(email, otp) {
  const key = normalizeEmail(email)
  store.set(key, {
    otp: String(otp),
    expiresAt: Date.now() + EXPIRY_MS,
  })
}

export function verifyResetOtp(email, otp) {
  const key = normalizeEmail(email)
  const entry = store.get(key)
  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  return entry.otp === String(otp).trim()
}

export function clearResetOtp(email) {
  const key = normalizeEmail(email)
  store.delete(key)
}
