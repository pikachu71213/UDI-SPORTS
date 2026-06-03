/**
 * Email service for sending OTP.
 * Uses nodemailer with SMTP from env.
 * Set: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * For Gmail: use App Password (not regular password)
 */

import nodemailer from 'nodemailer'

let transporter = null

const ORG_NAME = process.env.SMTP_FROM_NAME || 'UDIISA Sports NGO (India)'
const FALLBACK_FROM = process.env.SMTP_FROM || (process.env.SMTP_USER ? `"${ORG_NAME}" <${process.env.SMTP_USER}>` : undefined)
const REPLY_TO = process.env.SMTP_REPLY_TO || process.env.SMTP_USER

function getTransporter() {
  if (transporter) return transporter
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    console.warn('SMTP not configured (SMTP_USER, SMTP_PASS). OTP emails will not be sent.')
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
  return transporter
}

export async function sendOTPEmail(to, otp) {
  const trans = getTransporter()
  if (!trans) {
    console.log('📧 OTP (SMTP not configured):', otp, '→', to)
    return { ok: true, mock: true }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px; color: #1f2937;">
      <h2 style="color: #0B1E4B; margin: 0 0 12px;">UDIISA Sports NGO (India)</h2>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 14px;">
        Your one-time verification code is:
      </p>
      <div style="background: #0B1E4B; color: #ffffff; font-size: 30px; font-weight: 700; letter-spacing: 6px; padding: 14px 18px; border-radius: 8px; text-align: center; margin: 0 0 14px;">
        ${otp}
      </div>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 10px;">
        This code is valid for <strong>10 minutes</strong>. Please do not share it.
      </p>
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        If you did not request this, you can safely ignore this message.
      </p>
    </div>
  `
  const text = [
    'UDIISA Sports NGO (India)',
    '',
    'Your one-time verification code is:',
    otp,
    '',
    'This code is valid for 10 minutes. Please do not share it.',
    'If you did not request this, you can safely ignore this message.',
  ].join('\n')

  await trans.sendMail({
    from: FALLBACK_FROM,
    sender: process.env.SMTP_USER,
    replyTo: REPLY_TO,
    to,
    subject: 'Your verification code - UDI Sports',
    html,
    text,
    headers: { 'X-Auto-Response-Suppress': 'All' },
  })
  return { ok: true }
}

/** Send password reset link email (admin) */
export async function sendResetPasswordEmail(to, resetLink) {
  const trans = getTransporter()
  if (!trans) {
    console.log('📧 Reset link (SMTP not configured):', resetLink, '→', to)
    return { ok: true, mock: true }
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 20px; color: #1f2937;">
      <h2 style="color: #0B1E4B; margin: 0 0 12px;">UDIISA Sports NGO (India) Admin</h2>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 14px;">
        We received a request to reset your password.
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 12px;">
        Open the link below to set a new password:
      </p>
      <p style="margin: 0 0 14px; word-break: break-all;">
        <a href="${resetLink}" style="color: #0B1E4B;">${resetLink}</a>
      </p>
      <p style="font-size: 12px; color: #6b7280; margin: 0;">
        This link is valid for <strong>1 hour</strong>. If you did not request this, please ignore this email.
      </p>
    </div>
  `
  const text = [
    'UDIISA Sports NGO (India) Admin',
    '',
    'We received a request to reset your password.',
    'Open this link to set a new password:',
    resetLink,
    '',
    'This link is valid for 1 hour. If you did not request this, please ignore this email.',
  ].join('\n')

  await trans.sendMail({
    from: FALLBACK_FROM,
    sender: process.env.SMTP_USER,
    replyTo: REPLY_TO,
    to,
    subject: 'Password reset request - UDI Sports',
    html,
    text,
    headers: { 'X-Auto-Response-Suppress': 'All' },
  })
  return { ok: true }
}
