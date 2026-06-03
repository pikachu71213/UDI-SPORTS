/**
 * In-memory store for password reset tokens.
 * Token -> { email, expiresAt }. Expiry 1 hour.
 */

const EXPIRY_MS = 60 * 60 * 1000
const store = new Map()

export function setResetToken(token, email) {
  store.set(token, {
    email: email.toLowerCase().trim(),
    expiresAt: Date.now() + EXPIRY_MS,
  })
}

export function getResetToken(token) {
  const entry = store.get(token)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(token)
    return null
  }
  return entry.email
}

export function clearResetToken(token) {
  store.delete(token)
}
