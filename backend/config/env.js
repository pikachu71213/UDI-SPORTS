const normalizeOrigin = (value = '') => String(value).trim().replace(/\/$/, '')

const parseOriginList = (value = '') =>
  String(value)
    .split(',')
    .map((item) => normalizeOrigin(item))
    .filter(Boolean)

export const NODE_ENV = process.env.NODE_ENV || 'development'
export const IS_PRODUCTION = NODE_ENV === 'production'

const corsOrigins = new Set([
  ...parseOriginList(process.env.CORS_ORIGINS),
  normalizeOrigin(process.env.FRONTEND_URL),
  normalizeOrigin(process.env.ADMIN_URL),
].filter(Boolean))

export const ENV = {
  nodeEnv: NODE_ENV,
  isProduction: IS_PRODUCTION,
  jwtSecret: String(process.env.JWT_SECRET || '').trim(),
  mongodbUri: String(process.env.MONGODB_URI || '').trim(),
  corsOrigins,
}

export function assertRequiredEnv() {
  const missing = []
  if (!ENV.jwtSecret) missing.push('JWT_SECRET')
  if (!ENV.mongodbUri) missing.push('MONGODB_URI')
  if (IS_PRODUCTION && ENV.corsOrigins.size === 0) {
    missing.push('CORS_ORIGINS or FRONTEND_URL/ADMIN_URL')
  }
  if (IS_PRODUCTION && ENV.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production')
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

