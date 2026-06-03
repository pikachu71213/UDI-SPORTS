export const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || ''))
export const isDataUrl = (value) => /^data:/i.test(String(value || ''))

export const toPublicMediaUrl = (req, value) => {
  if (!value) return null
  if (isAbsoluteUrl(value)) return value
  if (isDataUrl(value)) return value

  const normalizedPath = String(value).startsWith('/') ? String(value) : `/${value}`
  const fromEnv = String(process.env.PUBLIC_BASE_URL || process.env.MEDIA_BASE_URL || '').trim().replace(/\/$/, '')
  if (fromEnv) return `${fromEnv}${normalizedPath}`

  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim()
  const forwardedHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim()
  const host = forwardedHost || req.get('host')
  const protocol = process.env.NODE_ENV === 'production'
    ? 'https'
    : (forwardedProto || req.protocol || 'http')

  return `${protocol}://${host}${normalizedPath}`
}
