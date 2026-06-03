import IncomingContact from '../models/IncomingContact.js'
import IncomingMember from '../models/IncomingMember.js'
import { setOTP, verifyOTP } from '../utils/otpStore.js'
import { sendOTPEmail } from '../utils/emailService.js'
import { uploadImageFromFile } from '../utils/cloudinary.js'
import { toPublicMediaUrl } from '../utils/mediaUrl.js'

const NAME_REGEX = /^[A-Za-z][A-Za-z\s.'-]{1,79}$/
const isValidFullName = (value) => NAME_REGEX.test(String(value || '').trim())
const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
const normalizeGender = (value = '') => {
  const g = String(value || '').trim().toLowerCase()
  if (g === 'male' || g === 'female' || g === 'other') return g
  if (g.startsWith('other')) return 'other'
  return ''
}
const normalizePhone = (value = '') => String(value || '').replace(/\D/g, '').slice(-10)
const toBoolean = (value) =>
  value === true ||
  value === 'true' ||
  value === '1' ||
  value === 1 ||
  value === 'yes' ||
  value === 'on'
const MEMBERSHIP_FEE_MAP = {
  'EWS (₹1,200)': '₹1,200',
  'general (₹2,500)': '₹2,500',
  'EWS (₹5,000)': '₹5,000',
  'ex sports (₹12,500)': '₹12,500',
  'general (₹25,000)': '₹25,000',
  'silver (₹50,000)': '₹50,000',
  'gold (₹75,000)': '₹75,000',
  'diamond (₹1,00,000)': '₹1,00,000',
  'up to ₹1 cr (₹2,50,000)': '₹2,50,000',
  '₹1 cr - ₹5 cr (₹5,00,000)': '₹5,00,000',
  '₹5 cr - ₹25 cr (₹10,00,000)': '₹10,00,000',
  '₹25 cr - ₹50 cr (₹20,00,000)': '₹20,00,000',
  '₹50 cr - ₹100 cr (₹35,00,000)': '₹35,00,000',
  'above ₹100 cr (₹50,00,000)': '₹50,00,000',
}
const normalizeMembershipKey = (value = '') =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')

// ─── Public: Send OTP to email (no auth) ───────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body
    const em = (email || '').trim()
    if (!em || !em.includes('@')) {
      return res.status(400).json({ message: 'Valid email address is required' })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setOTP(em, otp)
    await sendOTPEmail(em, otp)
    return res.json({ message: 'OTP sent to your email', expiresIn: 600 })
  } catch (e) {
    console.error('sendOtp error:', e)
    return res.status(500).json({ message: e.message || 'Failed to send OTP' })
  }
}

// ─── Public: Verify OTP (no auth) ───────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body
    const em = (email || '').trim()
    const otpStr = String(otp || '').replace(/\D/g, '')
    if (!em || !otpStr || otpStr.length !== 6) {
      return res.status(400).json({ message: 'Email and 6-digit OTP are required' })
    }
    const valid = verifyOTP(em, otpStr)
    if (!valid) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' })
    }
    return res.json({ message: 'Email verified successfully' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Verification failed' })
  }
}

// ─── Public: Submit contact form (no auth) ───────
export const submitContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      age,
      aadharNumber,
      qualification,
      gender,
      message,
    } = req.body

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: 'Full name, email and message are required' })
    }
    if (!isValidFullName(fullName)) {
      return res.status(400).json({ message: 'Please enter a valid full name (letters only)' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please enter a valid email' })
    }
    const cleanPhone = normalizePhone(phone)
    if (cleanPhone && cleanPhone.length !== 10) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit mobile number' })
    }

    const doc = await IncomingContact.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      address: (address || '').trim(),
      age: age ? Number(age) : undefined,
      aadharNumber: (aadharNumber || '').trim(),
      qualification: (qualification || '').trim(),
      gender: normalizeGender(gender),
      message: message.trim(),
    })
    return res.status(201).json({ message: 'Message sent successfully', id: doc._id })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to submit' })
  }
}

// ─── Public: Submit membership form (no auth) ─────
export const submitMemberForm = async (req, res) => {
  try {
    const body = { ...req.body }
    const category = String(body.category || '').trim().toLowerCase()
    const isMembershipQueryFlow = !!category
    const formType = isMembershipQueryFlow
      ? 'membership-query'
      : body.formType === 'special-member'
      ? 'special-member'
      : 'general-member'

    if (!isValidFullName(body.fullName)) {
      return res.status(400).json({ message: 'Please enter a valid full name (letters only)' })
    }
    if (!isValidEmail(body.email || '')) {
      return res.status(400).json({ message: 'Please enter a valid email' })
    }
    const cleanPhone = normalizePhone(body.phone)
    if (isMembershipQueryFlow && cleanPhone.length !== 10) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit phone number' })
    }
    if (isMembershipQueryFlow && !['individual', 'player', 'corporate'].includes(category)) {
      return res.status(400).json({ message: 'Invalid membership category' })
    }
    if (isMembershipQueryFlow && !String(body.membershipType || '').trim()) {
      return res.status(400).json({ message: 'Membership type is required' })
    }
    if (isMembershipQueryFlow && !body.address?.trim()) {
      return res.status(400).json({ message: 'Address is required' })
    }
    const acceptedTerms = toBoolean(body.termsAccepted)
    if (isMembershipQueryFlow && !acceptedTerms) {
      return res.status(400).json({ message: 'Please accept terms and conditions' })
    }
    if (isMembershipQueryFlow && Number(body.age) && (Number(body.age) < 5 || Number(body.age) > 100)) {
      return res.status(400).json({ message: 'Enter valid age (5–100)' })
    }

    if (req.file) {
      body.photo =
        (await uploadImageFromFile(req.file, 'udiisa/incoming-members')) || `/uploads/image/${req.file.filename}`
    }

    const membershipType = String(body.membershipType || body.memberType || '').trim()
    const normalizedMembershipType = normalizeMembershipKey(membershipType)
    const amount = MEMBERSHIP_FEE_MAP[normalizedMembershipType] || ''

    const doc = await IncomingMember.create({
      formType,
      category,
      memberType: body.memberType || '',
      membershipType,
      fullName: body.fullName || '',
      age: body.age ? Number(body.age) : undefined,
      gender: normalizeGender(body.gender),
      phone: cleanPhone,
      companyName: body.companyName || '',
      email: String(body.email || '').trim().toLowerCase(),
      aadharNumber: body.aadharNumber || '',
      panNumber: body.panNumber || '',
      qualification: body.qualification || '',
      fullAddress: body.fullAddress || body.address || '',
      sportsInterest: body.sportsInterest || '',
      utrNumber: body.utrNumber || '',
      paymentSender: body.paymentSender || '',
      designation: body.designation || '',
      organization: body.organization || '',
      linkedin: body.linkedin || '',
      contribution: body.contribution || '',
      amount,
      termsAccepted: acceptedTerms,
      message: body.message || '',
      photo: body.photo || null,
    })
    return res.status(201).json({ message: 'Application submitted successfully', id: doc._id })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to submit' })
  }
}

// ─── Admin: List contact forms ───────────────────
export const getContactForms = async (req, res) => {
  try {
    const { search } = req.query
    const filter = {}
    if (search && search.trim()) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { message: new RegExp(search, 'i') },
      ]
    }
    const list = await IncomingContact.find(filter).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch' })
  }
}

export const deleteContactForm = async (req, res) => {
  try {
    const doc = await IncomingContact.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete' })
  }
}

// ─── Admin: List member forms ─────────────────────
export const getMemberForms = async (req, res) => {
  try {
    const { search, category } = req.query
    const filter = {}
    const normalizedCategory = String(category || '').trim().toLowerCase()
    if (['individual', 'player', 'corporate'].includes(normalizedCategory)) {
      filter.category = normalizedCategory
      filter.formType = 'membership-query'
    }
    if (search && search.trim()) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { memberType: new RegExp(search, 'i') },
        { membershipType: new RegExp(search, 'i') },
        { utrNumber: new RegExp(search, 'i') },
      ]
    }
    const list = await IncomingMember.find(filter).sort({ createdAt: -1 }).lean()
    list.forEach(m => {
      m.photo = toPublicMediaUrl(req, m.photo)
      m.name = m.fullName
      m.phone = m.phone || '—'
      m.address = m.fullAddress || m.address || ''
      m.membershipType = m.membershipType || ''
      m.category = m.category || ''
      m.formType = m.formType || ''
      m.companyName = m.companyName || ''
      m.aadharNumber = m.aadharNumber || ''
      m.panNumber = m.panNumber || ''
      m.qualification = m.qualification || ''
      m.sportsInterest = m.sportsInterest || ''
      m.paymentSender = m.paymentSender || ''
      m.designation = m.designation || ''
      m.organization = m.organization || ''
      m.linkedin = m.linkedin || ''
      m.contribution = m.contribution || ''
      m.termsAccepted = !!m.termsAccepted
      m.gender = m.gender ? m.gender.charAt(0).toUpperCase() + m.gender.slice(1) : '—'
      if (m.formType === 'membership-query') {
        const typeLabel = m.membershipType || m.memberType || '—'
        const normalizedTypeLabel = String(typeLabel).trim().toLowerCase()
        m.memberType = typeLabel
        m.amount = m.amount || MEMBERSHIP_FEE_MAP[normalizedTypeLabel] || '—'
      } else if (m.formType === 'special-member') {
        m.memberType = 'Special Member'
        m.amount = m.amount || '—'
      } else {
        const amt = m.memberType === 'sports-men' ? '₹1,200' : m.memberType === 'general' ? '₹12,000' : m.amount || '—'
        m.amount = amt
        m.memberType = m.memberType === 'sports-men'
          ? 'Sports Men'
          : m.memberType === 'general'
          ? 'General'
          : m.memberType || '—'
      }
      m.utr = m.utrNumber
      m.submittedAt = m.createdAt
    })
    return res.json(list)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch' })
  }
}

export const deleteMemberForm = async (req, res) => {
  try {
    const doc = await IncomingMember.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete' })
  }
}
