// admin/utils/helpers.js

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export const truncate = (str, n = 40) =>
  str && str.length > n ? str.slice(0, n) + '…' : str || '—'

export const buildFormData = (obj) => {
  const fd = new FormData()
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== null && v !== undefined) fd.append(k, v)
  })
  return fd
}

export const validateRequired = (fields, values) => {
  const errors = {}
  fields.forEach(f => {
    if (!values[f] || String(values[f]).trim() === '') {
      errors[f] = 'This field is required'
    }
  })
  return errors
}

const DEFAULT_API_URL = (() => {
  if (typeof window === 'undefined') return 'http://localhost:5000/api'
  const host = String(window.location.hostname || '').toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1') return 'http://localhost:5000/api'
  return `${window.location.origin.replace(/\/$/, '')}/api`
})()

const normalizeApiBaseUrl = (rawUrl) => {
  const raw = (rawUrl || '').trim()
  if (!raw) return DEFAULT_API_URL

  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw.replace(/\/$/, '')
  if (raw.startsWith('/')) {
    if (typeof window === 'undefined') return DEFAULT_API_URL
    return `${window.location.origin.replace(/\/$/, '')}${raw}`.replace(/\/$/, '')
  }
  if (raw.startsWith(':')) return `http://localhost${raw}`
  if (raw.startsWith('localhost') || raw.startsWith('127.0.0.1')) return `http://${raw}`

  try {
    return new URL(raw, window.location.origin).toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_API_URL
  }
}

const apiBase = normalizeApiBaseUrl(import.meta.env.VITE_API_URL)
const originBase = apiBase.replace(/\/api$/, '')

export const API_IMG = (path) => {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${originBase}${path}`
}