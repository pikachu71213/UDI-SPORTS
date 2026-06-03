/**
 * In-memory OTP store with expiry (10 min).
 * For production with multiple servers, use Redis.
 */

const OTP_EXPIRY_MS = 10 * 60 * 1000 // 10 minutes
const store = new Map()

export function setOTP(email, otp) {
  const key = email.toLowerCase().trim()
  store.set(key, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  })
}

export function verifyOTP(email, otp) {
  const key = email.toLowerCase().trim()
  const entry = store.get(key)
  if (!entry) return false
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return false
  }
  const match = entry.otp === String(otp)
  if (match) store.delete(key)
  return match
}
