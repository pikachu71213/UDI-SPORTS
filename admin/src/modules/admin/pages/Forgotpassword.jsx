// admin/pages/ForgotPassword.jsx
//
// Flow:
//   Step 1 — Enter email address to receive OTP
//   Step 2 — Enter 6-digit OTP sent to the email
//   Step 3 — Enter new password + confirm password
//   Step 4 — Done
//
// API wiring (replace mock calls):
//   authService.sendOtp(email)                     → POST /admin/auth/send-otp
//   authService.verifyOtp(email, otp)              → POST /admin/auth/verify-otp
//   authService.resetPassword(email, otp, newPass) → POST /admin/auth/reset-password

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaEnvelope } from 'react-icons/fa'
import { MdSecurity } from 'react-icons/md'
import { useAdminToast } from '../hooks/ToastContext'
import authService from '../services/authService'

// ─── Tiny spinner ─────────────────────────────────────────────────────────────
const Spinner = () => (
  <span className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
)

// ─── Password input with show/hide toggle ─────────────────────────────────────
function PasswordInput({ label, value, onChange, show, onToggle, error, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[11.5px] font-extrabold text-[#0B1E4B] uppercase tracking-wider">
        {label} <span className="text-[#F05A1A]">*</span>
      </label>
      <div className="relative">
        <FaLock className="absolute left-[13px] top-1/2 -translate-y-1/2 text-slate-400 text-[12px] pointer-events-none" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full h-[44px] pl-[36px] pr-[44px] rounded-[10px]
            border bg-white text-[13.5px] font-medium text-slate-700
            placeholder:text-slate-300
            focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 bg-red-50' : 'border-slate-200'}
          `}
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-[12px] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          {show ? <FaEyeSlash className="text-[13px]" /> : <FaEye className="text-[13px]" />}
        </button>
      </div>
      {error && <p className="text-[11.5px] text-red-500 font-medium mt-[2px]">{error}</p>}
    </div>
  )
}

// ─── Single OTP digit box ─────────────────────────────────────────────────────
function OtpBox({ value, inputRef, onChange, onKeyDown, onPaste }) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      className="
        w-[46px] h-[54px] text-center text-[22px] font-extrabold
        rounded-[12px] border-2 border-slate-200 bg-white
        text-[#0B1E4B] tracking-widest
        focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/15
        transition-all duration-150 caret-transparent
        sm:w-[52px] sm:h-[58px]
      "
    />
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const _toast   = useAdminToast()
  const toast    = {
    success: (msg) => _toast?.success?.(msg),
    error:   (msg) => _toast?.error?.(msg),
  }
  const navigate = useNavigate()
  const [notice, setNotice] = useState({ type: '', text: '' })

  // ── Step: 'email' | 'otp' | 'reset' | 'done' ──
  const [step, setStep] = useState('email')  // FIX: was 'otp' — must start at 'email'

  // ── Email state ──
  const [email,      setEmail]      = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailBusy,  setEmailBusy]  = useState(false)

  // ── OTP state ──
  const OTP_LENGTH = 6
  const [otp,        setOtp]        = useState(Array(OTP_LENGTH).fill(''))
  const [otpError,   setOtpError]   = useState('')
  const [otpBusy,    setOtpBusy]    = useState(false)
  const [resendBusy, setResendBusy] = useState(false)
  const [resendCool, setResendCool] = useState(0)
  const otpRefs = useRef([])

  // ── Password state ──
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passErrors,  setPassErrors]  = useState({})
  const [resetBusy,   setResetBusy]   = useState(false)

  // ── Resend cooldown timer ──
  useEffect(() => {
    if (resendCool <= 0) return
    const t = setTimeout(() => setResendCool(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCool])

  // ── Send OTP to email ──
  // FIX: setStep called inside finally AFTER setEmailBusy(false) to avoid React batching issues
  const handleSendOtp = async () => {
    if (!email.trim()) { setEmailError('Enter your email address'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email address'); return }
    setNotice({ type: '', text: '' })
    setEmailBusy(true)
    let success = false
    try {
      await authService.sendOtp(email.trim().toLowerCase())
      toast.success('OTP sent! Check your email.')
      setNotice({ type: 'success', text: 'OTP sent successfully. Please check your inbox/spam folder.' })
      success = true
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to send OTP. Please ensure backend server is running.'
      toast.error(message)
      setNotice({ type: 'error', text: message })
    } finally {
      setEmailBusy(false)
      if (success) {
        setResendCool(60)
        setStep('otp')
      }
    }
  }

  // ── OTP box handlers ──
  const handleOtpChange = (i, val) => {
    const char = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = char
    setOtp(next)
    setOtpError('')
    if (char && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus()
  }

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (otp[i]) {
        const next = [...otp]; next[i] = ''; setOtp(next)
      } else if (i > 0) {
        otpRefs.current[i - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      otpRefs.current[i - 1]?.focus()
    } else if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) {
      otpRefs.current[i + 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    const next = [...otp]
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setOtp(next)
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  // ── Verify OTP ──
  // FIX: same pattern — setStep after busy flag cleared in finally
  const handleVerifyOtp = async () => {
    const code = otp.join('')
    if (code.length < OTP_LENGTH) { setOtpError('Please enter all 6 digits'); return }
    setNotice({ type: '', text: '' })
    setOtpBusy(true)
    let success = false
    try {
      await authService.verifyOtp(email.trim().toLowerCase(), code)
      toast.success('OTP verified!')
      setNotice({ type: 'success', text: 'OTP verified. Set your new password.' })
      success = true
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid or expired OTP'
      setOtpError(message)
      setNotice({ type: 'error', text: message })
      setOtp(Array(OTP_LENGTH).fill(''))
      otpRefs.current[0]?.focus()
    } finally {
      setOtpBusy(false)
      if (success) setStep('reset')
    }
  }

  // ── Resend OTP ──
  const handleResend = async () => {
    setNotice({ type: '', text: '' })
    setResendBusy(true)
    try {
      await authService.sendOtp(email.trim().toLowerCase())
      toast.success('New OTP sent!')
      setNotice({ type: 'success', text: 'A new OTP has been sent to your email.' })
      setOtp(Array(OTP_LENGTH).fill(''))
      setOtpError('')
      setResendCool(60)
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to resend OTP'
      toast.error(message)
      setNotice({ type: 'error', text: message })
    } finally {
      setResendBusy(false)
    }
  }

  // ── Reset password ──
  // FIX: same pattern — setStep after busy flag cleared in finally
  const handleResetPassword = async () => {
    const err = {}
    if (!newPass)                      err.newPass     = 'New password required'
    if (newPass && newPass.length < 6) err.newPass     = 'Minimum 6 characters'
    if (!confirmPass)                  err.confirmPass = 'Please confirm password'
    if (newPass !== confirmPass)       err.confirmPass = 'Passwords do not match'
    if (Object.keys(err).length) { setPassErrors(err); return }

    setNotice({ type: '', text: '' })
    setResetBusy(true)
    let success = false
    try {
      await authService.resetPassword(email.trim().toLowerCase(), otp.join(''), newPass)
      setNotice({ type: 'success', text: 'Password reset successful.' })
      success = true
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to reset password'
      toast.error(message)
      setNotice({ type: 'error', text: message })
    } finally {
      setResetBusy(false)
      if (success) setStep('done')
    }
  }

  // ── Masked email display ──
  const maskedEmail = email.replace(/(.{2}).+(@.+)/, '$1***$2')

  // ── Step meta ──
  const stepsMeta = [
    { key: 'email', label: 'Enter Email'  },
    { key: 'otp',   label: 'Verify OTP'   },
    { key: 'reset', label: 'New Password' },
  ]
  const stepIndex = { email: 0, otp: 1, reset: 2, done: 3 }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">

        {/* Card */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_40px_rgba(11,30,75,0.10)] overflow-hidden">

          {/* Card top accent bar */}
          <div className="h-[5px] bg-gradient-to-r from-[#0B1E4B] via-[#F05A1A] to-[#0B1E4B]" />

          <div className="p-[32px]">

            {/* ── Header ── */}
            <div className="flex items-center gap-[14px] mb-[28px]">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-gradient-to-br from-[#0B1E4B] to-[#152B6B] flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(11,30,75,.25)]">
                <MdSecurity className="text-white text-[22px]" />
              </div>
              <div>
                <h2 className="text-[18px] font-extrabold text-[#0B1E4B] m-0 leading-tight">
                  {step === 'email' && 'Forgot Password'}
                  {step === 'otp'   && 'Verify OTP'}
                  {step === 'reset' && 'Reset Password'}
                  {step === 'done'  && 'All Done!'}
                </h2>
                <p className="text-[12px] text-slate-400 m-0 mt-[3px]">
                  {step === 'email' && 'Enter your email to receive an OTP'}
                  {step === 'otp'   && `Code sent to ${maskedEmail}`}
                  {step === 'reset' && 'Create your new password'}
                  {step === 'done'  && 'Your password has been updated'}
                </p>
              </div>
            </div>

            {/* ── Step indicator ── */}
            {step !== 'done' && (
              <div className="flex items-center gap-[8px] mb-[28px]">
                {stepsMeta.map((s, i) => {
                  const currentIdx = stepIndex[step]
                  const isActive   = step === s.key
                  const isComplete = currentIdx > i
                  return (
                    <div key={s.key} className="flex items-center gap-[8px] flex-1">
                      <div className={`
                        flex items-center justify-center w-[26px] h-[26px] rounded-full text-[11px] font-extrabold flex-shrink-0 transition-all duration-300
                        ${isComplete ? 'bg-emerald-500 text-white' : isActive ? 'bg-[#F05A1A] text-white shadow-[0_2px_8px_rgba(240,90,26,.4)]' : 'bg-slate-100 text-slate-400'}
                      `}>
                        {isComplete ? <FaCheckCircle className="text-[12px]" /> : i + 1}
                      </div>
                      <span className={`text-[11.5px] font-bold transition-colors whitespace-nowrap ${isActive ? 'text-[#0B1E4B]' : isComplete ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                      {i < stepsMeta.length - 1 && (
                        <div className={`flex-1 h-[2px] rounded-full transition-colors duration-300 ${isComplete ? 'bg-emerald-400' : 'bg-slate-100'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {notice.text && step !== 'done' && (
              <div
                className={`mb-[16px] rounded-[10px] px-[12px] py-[10px] text-[12.5px] font-semibold ${
                  notice.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}
              >
                {notice.text}
              </div>
            )}

            {/* ════════════════════════════════════════
                STEP 1 — Email
            ════════════════════════════════════════ */}
            {step === 'email' && (
              <div className="flex flex-col gap-[20px]">
                <p className="text-[13px] text-slate-500 leading-relaxed m-0">
                  Enter the <span className="font-bold text-[#0B1E4B]">admin email address</span> associated with your account. We'll send you a verification code.
                </p>

                <div className="flex flex-col gap-[6px]">
                  <label className="text-[11.5px] font-extrabold text-[#0B1E4B] uppercase tracking-wider">
                    Email Address <span className="text-[#F05A1A]">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-[13px] top-1/2 -translate-y-1/2 text-slate-400 text-[12px] pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError('') }}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      placeholder="Enter your admin email"
                      className={`
                        w-full h-[44px] pl-[36px] pr-[12px] rounded-[10px]
                        border bg-white text-[13.5px] font-medium text-slate-700
                        placeholder:text-slate-300
                        focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10
                        transition-all duration-200
                        ${emailError ? 'border-red-400 bg-red-50' : 'border-slate-200'}
                      `}
                    />
                  </div>
                  {emailError && <p className="text-[11.5px] text-red-500 font-medium mt-[2px]">{emailError}</p>}
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={emailBusy}
                  className="w-full h-[46px] rounded-[12px] bg-gradient-to-r from-[#0B1E4B] to-[#152B6B] text-white text-[14px] font-extrabold flex items-center justify-center gap-[8px] hover:shadow-[0_4px_18px_rgba(11,30,75,.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {emailBusy ? <Spinner /> : <FaEnvelope className="text-[12px]" />}
                  {emailBusy ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </div>
            )}

            {/* ════════════════════════════════════════
                STEP 2 — OTP
            ════════════════════════════════════════ */}
            {step === 'otp' && (
              <div className="flex flex-col gap-[20px]">
                <p className="text-[13px] text-slate-500 leading-relaxed m-0">
                  Enter the <span className="font-bold text-[#0B1E4B]">6-digit OTP</span> we sent to{' '}
                  <span className="font-bold text-[#F05A1A]">{maskedEmail}</span>
                </p>

                {/* OTP boxes */}
                <div className="flex justify-center gap-[8px] sm:gap-[10px]">
                  {otp.map((digit, i) => (
                    <OtpBox
                      key={i}
                      value={digit}
                      inputRef={el => (otpRefs.current[i] = el)}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-[12.5px] text-red-500 font-semibold text-center m-0 -mt-[6px]">{otpError}</p>
                )}

                {/* Verify button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={otpBusy || otp.join('').length < OTP_LENGTH}
                  className="w-full h-[46px] rounded-[12px] bg-gradient-to-r from-[#0B1E4B] to-[#152B6B] text-white text-[14px] font-extrabold flex items-center justify-center gap-[8px] hover:shadow-[0_4px_18px_rgba(11,30,75,.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {otpBusy ? <Spinner /> : null}
                  {otpBusy ? 'Verifying…' : 'Verify OTP'}
                </button>

                {/* Resend */}
                <div className="flex items-center justify-center gap-[6px] text-[12.5px]">
                  <span className="text-slate-400">Didn't receive the code?</span>
                  {resendCool > 0 ? (
                    <span className="text-slate-400 font-semibold">Resend in {resendCool}s</span>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={resendBusy}
                      className="text-[#F05A1A] font-extrabold hover:underline disabled:opacity-60 transition-all"
                    >
                      {resendBusy ? 'Sending…' : 'Resend OTP'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                STEP 3 — New Password
            ════════════════════════════════════════ */}
            {step === 'reset' && (
              <div className="flex flex-col gap-[16px]">
                <PasswordInput
                  label="New Password"
                  value={newPass}
                  onChange={e => { setNewPass(e.target.value); setPassErrors(p => ({ ...p, newPass: '' })) }}
                  show={showNew}
                  onToggle={() => setShowNew(p => !p)}
                  placeholder="Enter new password (min 6 chars)"
                  error={passErrors.newPass}
                />

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPass}
                  onChange={e => { setConfirmPass(e.target.value); setPassErrors(p => ({ ...p, confirmPass: '' })) }}
                  show={showConfirm}
                  onToggle={() => setShowConfirm(p => !p)}
                  placeholder="Re-enter new password"
                  error={passErrors.confirmPass}
                />

                {/* Password strength hint */}
                {newPass.length > 0 && (
                  <div className="flex gap-[4px] mt-[-4px]">
                    {[1, 2, 3, 4].map(n => {
                      const strength =
                        newPass.length >= 10 && /[A-Z]/.test(newPass) && /\d/.test(newPass) && /[^A-Za-z0-9]/.test(newPass) ? 4
                        : newPass.length >= 8 && /[A-Z\d]/.test(newPass) ? 3
                        : newPass.length >= 6 ? 2 : 1
                      const color =
                        strength >= 4 ? 'bg-emerald-500'
                        : strength >= 3 ? 'bg-yellow-400'
                        : strength >= 2 ? 'bg-orange-400' : 'bg-red-400'
                      return (
                        <div key={n} className={`flex-1 h-[3px] rounded-full transition-all ${n <= strength ? color : 'bg-slate-100'}`} />
                      )
                    })}
                  </div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={resetBusy}
                  className="w-full h-[46px] rounded-[12px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white text-[14px] font-extrabold flex items-center justify-center gap-[8px] hover:shadow-[0_4px_18px_rgba(240,90,26,.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-[4px]"
                >
                  {resetBusy ? <Spinner /> : <FaLock className="text-[12px]" />}
                  {resetBusy ? 'Saving…' : 'Save New Password'}
                </button>
              </div>
            )}

            {/* ════════════════════════════════════════
                STEP 4 — Done
            ════════════════════════════════════════ */}
            {step === 'done' && (
              <div className="flex flex-col items-center gap-[16px] py-[8px]">
                <div className="w-[72px] h-[72px] rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                  <FaCheckCircle className="text-emerald-500 text-[36px]" />
                </div>
                <div className="text-center">
                  <p className="text-[15px] font-extrabold text-[#0B1E4B] m-0">Password Reset Successful</p>
                  <p className="text-[13px] text-slate-400 m-0 mt-[6px] leading-relaxed">
                    Your password has been updated.<br />You can now log in with your new password.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="w-full h-[46px] rounded-[12px] bg-gradient-to-r from-[#0B1E4B] to-[#152B6B] text-white text-[14px] font-extrabold flex items-center justify-center gap-[8px] hover:shadow-[0_4px_18px_rgba(11,30,75,.35)] transition-all duration-200 mt-[4px]"
                >
                  Go to Login
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Back link */}
        {step !== 'done' && (
          <button
            onClick={() => {
              if (step === 'email') navigate('/admin/login')
              else if (step === 'otp') setStep('email')
              else if (step === 'reset') setStep('otp')
            }}
            className="mt-[16px] mx-auto flex items-center gap-[6px] text-[12.5px] text-slate-400 hover:text-[#0B1E4B] font-semibold transition-colors"
          >
            <FaArrowLeft className="text-[11px]" />
            {step === 'email' ? 'Back to Login' : 'Back'}
          </button>
        )}
      </div>
    </div>
  )
}