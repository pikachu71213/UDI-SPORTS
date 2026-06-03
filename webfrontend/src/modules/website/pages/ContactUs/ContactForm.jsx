import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaTimesCircle,
  FaShieldAlt, FaWhatsapp, FaIdCard,
} from 'react-icons/fa'
import { MdVerified, MdClose, MdSend } from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi'
import { submitContact, sendOtp, verifyOtp } from '../../../../shared/services/publicApi'

const ORG_INFO = {
  address: '5091, 9th Floor, Tower 5, Parker Residency, Tehsil Rai, District Sonipat, Haryana',
  whatsapp: '+91 83075 98050',
  email: 'info@udisports.in',
}

const GENDER_OPTS = [
  { value: '', label: '— Select Gender —' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other / Prefer not to say' },
]

/* ══════════════════════════════════════════
   OTP MODAL
══════════════════════════════════════════ */
const OTPModal = ({ email, onVerified, onClose }) => {
  const OTP_LEN    = 6
  const RESEND_SEC = 60

  const [digits, setDigits]       = useState(Array(OTP_LEN).fill(''))
  const [timer, setTimer]         = useState(RESEND_SEC)
  const [canResend, setCanResend] = useState(false)
  const [err, setErr]             = useState('')
  const [shake, setShake]         = useState(false)
  const [loading, setLoading]     = useState(false)
  const [otpSent, setOtpSent]     = useState(false)
  const refs        = useRef([])
  const inFlightRef = useRef(false)
  const sentForRef  = useRef('')
  const normalized  = (email || '').trim().toLowerCase()

  useEffect(() => { setTimeout(() => refs.current[0]?.focus(), 120) }, [])

  const requestOtp = useCallback(async (force = false) => {
    if (!normalized || inFlightRef.current) return
    if (!force && sentForRef.current === normalized) return
    inFlightRef.current = true; setErr('')
    try {
      await sendOtp(normalized)
      sentForRef.current = normalized
      setOtpSent(true); setTimer(RESEND_SEC); setCanResend(false)
    } catch (e) {
      sentForRef.current = ''
      setErr(e?.response?.data?.message || 'Failed to send OTP')
    } finally { inFlightRef.current = false }
  }, [normalized])

  useEffect(() => { if (normalized && !otpSent) requestOtp() }, [normalized, otpSent, requestOtp])
  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setTimer(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])

  const setDigit = (i, val) => {
    const d = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]; next[i] = d; setDigits(next); setErr('')
    if (d && i < OTP_LEN - 1) refs.current[i + 1]?.focus()
  }
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowLeft'  && i > 0)           refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < OTP_LEN - 1) refs.current[i + 1]?.focus()
  }
  const onPaste = (e) => {
    e.preventDefault()
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN)
    const next = Array(OTP_LEN).fill('')
    p.split('').forEach((c, i) => { next[i] = c })
    setDigits(next); setErr('')
    refs.current[Math.min(p.length, OTP_LEN - 1)]?.focus()
  }
  const resend = () => {
    setDigits(Array(OTP_LEN).fill('')); setTimer(RESEND_SEC)
    setCanResend(false); setErr(''); requestOtp(true)
    setTimeout(() => refs.current[0]?.focus(), 50)
  }
  const verify = async () => {
    const entered = digits.join('')
    if (entered.length < OTP_LEN) { setErr('Please enter all 6 digits'); doShake(); return }
    setLoading(true); setErr('')
    verifyOtp(normalized, entered)
      .then(() => { onVerified() })
      .catch((e) => {
        setErr(e?.response?.data?.message || 'Incorrect OTP. Please try again.')
        setDigits(Array(OTP_LEN).fill('')); doShake()
        setTimeout(() => refs.current[0]?.focus(), 50)
      })
      .finally(() => setLoading(false))
  }
  const doShake = () => { setShake(true); setTimeout(() => setShake(false), 500) }
  const filled  = digits.filter(Boolean).length

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4"
         style={{ background: 'rgba(11,30,75,0.55)', backdropFilter: 'blur(6px)' }}
         onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-[400px] bg-white rounded-[20px] overflow-hidden"
           style={{ boxShadow: '0 24px 80px rgba(11,30,75,0.22)', animation: 'modalPop 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}>
        <style>{`
          @keyframes modalPop { from{opacity:0;transform:scale(.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
          @keyframes shakeIt  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
          .do-shake { animation:shakeIt .45s ease }
          @keyframes spin360 { to{transform:rotate(360deg)} }
          .spin-loader { animation:spin360 .7s linear infinite }
        `}</style>

        {/* Header */}
        <div className="text-center relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg,#0B1E4B,#1e3a8a)', padding: '22px 24px 20px' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:100, height:100, borderRadius:'50%', background:'rgba(240,90,26,.12)' }} />
          <button type="button" onClick={onClose}
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  style={{ background:'rgba(255,255,255,.1)' }}>
            <MdClose style={{ fontSize: 15 }} />
          </button>
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ width:46, height:46, borderRadius:14, margin:'0 auto 10px',
              background:'linear-gradient(135deg,#F05A1A,#FF7D42)',
              boxShadow:'0 8px 24px rgba(240,90,26,.4)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <FaEnvelope style={{ color:'#fff', fontSize:20 }} />
            </div>
            <h3 style={{ color:'#fff', fontWeight:800, fontSize:17, margin:'0 0 3px' }}>Verify Your Email</h3>
            <p style={{ color:'rgba(255,255,255,.5)', fontSize:12, margin:0 }}>
              OTP sent to <strong style={{ color:'rgba(255,255,255,.8)' }}>{email}</strong>
            </p>
          </div>
        </div>

        <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ display:'flex', gap:8, padding:'10px 12px', borderRadius:10,
            background:'#EFF6FF', border:'1px solid #bfdbfe' }}>
            <FaShieldAlt style={{ color:'#60a5fa', fontSize:12, flexShrink:0, marginTop:1 }} />
            <p style={{ fontSize:12, color:'#2563eb', margin:0, lineHeight:1.5 }}>
              Enter the <strong>6-digit OTP</strong>. Valid for <strong>10 minutes</strong>.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <label style={{ fontSize:11, fontWeight:800, color:'#0B1E4B', textTransform:'uppercase', letterSpacing:1.3 }}>Enter OTP</label>
            <div className={shake ? 'do-shake' : ''} style={{ display:'flex', gap:6 }} onPaste={onPaste}>
              {digits.map((d, i) => (
                <input key={i} ref={el => refs.current[i] = el}
                       type="text" inputMode="numeric" maxLength={1} value={d}
                       onChange={e => setDigit(i, e.target.value)}
                       onKeyDown={e => onKey(i, e)}
                       style={{
                         width:'100%', height:48, borderRadius:10, textAlign:'center',
                         fontSize:20, fontWeight:800, outline:'none',
                         border: err ? '2px solid #f87171' : d ? '2px solid #F05A1A' : '2px solid #e2e8f0',
                         background: err ? '#fef2f2' : d ? '#FFF9F6' : '#fff',
                         color: err ? '#ef4444' : '#0B1E4B',
                         transition:'all .2s', caretColor:'transparent',
                       }} />
              ))}
            </div>
            {err && (
              <div style={{ display:'flex', gap:6, padding:'8px 11px', borderRadius:9,
                background:'#fef2f2', border:'1px solid #fecaca' }}>
                <FaTimesCircle style={{ color:'#f87171', fontSize:12, flexShrink:0 }} />
                <span style={{ fontSize:12, color:'#ef4444', fontWeight:600 }}>{err}</span>
              </div>
            )}
          </div>

          <button type="button" onClick={verify} disabled={filled < OTP_LEN || loading}
                  style={{
                    width:'100%', height:46, borderRadius:12, border:'none', cursor:'pointer',
                    background:'linear-gradient(135deg,#F05A1A,#FF7D42)', color:'#fff',
                    fontSize:14, fontWeight:800, letterSpacing:.5,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    boxShadow:'0 6px 24px rgba(240,90,26,.35)',
                    opacity: (filled < OTP_LEN || loading) ? 0.5 : 1, transition:'all .2s',
                  }}>
            {loading
              ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%' }} className="spin-loader" /> Verifying...</>
              : <><MdVerified style={{ fontSize:17 }} /> Verify OTP</>}
          </button>

          <div style={{ textAlign:'center' }}>
            {canResend ? (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7 }}>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Didn't receive the OTP?</p>
                <button type="button" onClick={resend}
                        style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px',
                          borderRadius:9, background:'#0B1E4B', color:'#fff', border:'none',
                          fontSize:12, fontWeight:800, cursor:'pointer' }}>
                  <FaEnvelope style={{ fontSize:10 }} /> Resend OTP
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <div style={{ position:'relative', width:30, height:30, flexShrink:0 }}>
                  <svg style={{ width:'100%', height:'100%', transform:'rotate(-90deg)' }} viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#F05A1A" strokeWidth="2.5"
                            strokeDasharray={`${2*Math.PI*13}`}
                            strokeDashoffset={`${2*Math.PI*13*(1-timer/RESEND_SEC)}`}
                            strokeLinecap="round"
                            style={{ transition:'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:8, fontWeight:800, color:'#F05A1A' }}>{timer}</span>
                </div>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>
                  Resend in <strong style={{ color:'#0B1E4B' }}>{timer}s</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   ATOMS
══════════════════════════════════════════ */
const Field = ({ label, required, hint, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    <label style={{ fontSize:11, fontWeight:800, color:'#0B1E4B',
      textTransform:'uppercase', letterSpacing:1.2, lineHeight:1 }}>
      {label}{required && <span style={{ color:'#F05A1A', marginLeft:3 }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize:11, color:'#94a3b8', margin:0, lineHeight:1.4 }}>{hint}</p>}
  </div>
)

const inputBase = (err) => ({
  width:'100%', height:42, padding:'0 12px', borderRadius:9,
  border: `1.5px solid ${err ? '#f87171' : '#e2e8f0'}`,
  background:'#fff', color:'#0B1E4B', fontSize:13, fontWeight:500,
  outline:'none', fontFamily:"'Plus Jakarta Sans', sans-serif",
  boxSizing:'border-box', transition:'border-color .2s, box-shadow .2s',
})

const Err = ({ msg }) => msg ? (
  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:11,
    color:'#ef4444', fontWeight:600, marginTop:1 }}>
    <FaTimesCircle style={{ fontSize:10 }} /> {msg}
  </span>
) : null

/* ══════════════════════════════════════════
   INFO PANEL
══════════════════════════════════════════ */
const InfoPanel = () => (
  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
    <div style={{ background:'#fff', borderRadius:18, border:'1.5px solid #f1f5f9',
      boxShadow:'0 4px 20px rgba(11,30,75,.07)', padding:'18px 18px',
      display:'flex', flexDirection:'column', gap:14 }}>
      <p style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:800,
        color:'#0B1E4B', textTransform:'uppercase', letterSpacing:1.5, margin:0 }}>
        <HiSparkles style={{ color:'#F05A1A', fontSize:14 }} /> Get In Touch
      </p>

      {[
        { icon:<FaMapMarkerAlt/>, label:'Address', value:ORG_INFO.address, color:'#F05A1A', bg:'#FFF3EC' },
        { icon:<FaWhatsapp/>,     label:'WhatsApp', value:ORG_INFO.whatsapp, color:'#1a6b3a', bg:'#f0faf4',
          href:`https://wa.me/${ORG_INFO.whatsapp.replace(/\s+/g,'')}` },
        { icon:<FaEnvelope/>,     label:'Email', value:ORG_INFO.email, color:'#2563eb', bg:'#EFF6FF',
          href:`mailto:${ORG_INFO.email}` },
      ].map((item, i, arr) => (
        <div key={i}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, flexShrink:0,
              background:item.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:item.color, fontSize:13 }}>{item.icon}</span>
            </div>
            <div style={{ minWidth:0 }}>
              <p style={{ fontSize:10, fontWeight:800, color:'#94a3b8',
                textTransform:'uppercase', letterSpacing:1.1, margin:'0 0 2px' }}>{item.label}</p>
              {item.href
                ? <a href={item.href} target="_blank" rel="noreferrer"
                     style={{ fontSize:12.5, fontWeight:700, color:item.color, textDecoration:'none', wordBreak:'break-all' }}>{item.value}</a>
                : <p style={{ fontSize:12.5, fontWeight:600, color:'#0B1E4B', margin:0, lineHeight:1.55 }}>{item.value}</p>
              }
            </div>
          </div>
          {i < arr.length-1 && <div style={{ borderTop:'1px solid #f1f5f9', marginTop:14 }} />}
        </div>
      ))}
    </div>

    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'13px 14px', borderRadius:12,
      background:'#FFF3EC', border:'1px solid rgba(240,90,26,.2)' }}>
      <FaShieldAlt style={{ color:'#F05A1A', fontSize:14, flexShrink:0, marginTop:1 }} />
      <div>
        <p style={{ fontSize:12, fontWeight:800, color:'#0B1E4B', margin:'0 0 2px' }}>Quick Response</p>
        <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.55 }}>
          We respond within <strong style={{ color:'#0B1E4B' }}>24 hours</strong>.
          For urgent matters, please call directly.
        </p>
      </div>
    </div>
  </div>
)

/* ══════════════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════════════ */
const SuccessScreen = ({ name }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    textAlign:'center', padding:'48px 24px', gap:14 }}>
    <div style={{ width:72, height:72, borderRadius:'50%', background:'#f0faf4',
      border:'3px solid #1a6b3a', display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 8px 28px rgba(26,107,58,.2)' }}>
      <MdVerified style={{ color:'#1a6b3a', fontSize:34 }} />
    </div>
    <div>
      <h3 style={{ color:'#0B1E4B', fontWeight:800, fontSize:20, margin:'0 0 8px', letterSpacing:.5 }}>
        Message Sent! 🎉
      </h3>
      <p style={{ color:'#64748b', fontSize:13.5, maxWidth:340, lineHeight:1.7, margin:0 }}>
        Thank you <strong style={{ color:'#F05A1A' }}>{name}</strong>! We'll get back to you within <strong style={{ color:'#0B1E4B' }}>24 hours</strong>.
      </p>
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:6,
      padding:'9px 16px', borderRadius:11, background:'#FFF3EC',
      border:'1px solid rgba(240,90,26,.2)' }}>
      <span style={{ color:'#F05A1A', fontSize:13 }}>✓</span>
      <span style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>A confirmation email will be sent shortly.</span>
    </div>
  </div>
)

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
const ContactForm = () => {
  const [searchParams] = useSearchParams()

  const INIT = {
    fullName:      searchParams.get('name')    || '',
    email:         searchParams.get('email')   || '',
    emailVerified: false,
    mobile:        '',
    aadharNumber:  '',
    gender:        '',
    address:       '',
    message:       searchParams.get('message') || '',
  }

  const [form, setForm]       = useState(INIT)
  const [errors, setErrors]   = useState({})
  const [done, setDone]       = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const prefilled = {
    name:    !!searchParams.get('name'),
    email:   !!searchParams.get('email'),
    message: !!searchParams.get('message'),
  }

  const set    = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const clrErr = k      => setErrors(p => ({ ...p, [k]: '' }))

  const handleVerified = () => {
    set('emailVerified', true)
    clrErr('email')
    setShowOTP(false)
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())  e.fullName = 'Full name is required'
    if (!form.email.trim())     e.email    = 'Email is required'
    if (!form.emailVerified)    e.email    = 'Please verify your email first'
    if (!form.mobile.trim())    e.mobile   = 'Mobile number is required'
    if (form.mobile.trim() && !/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g,'')))
                                e.mobile   = 'Enter a valid 10-digit mobile number'
    if (!form.gender)           e.gender   = 'Please select gender'
    if (!form.address.trim())   e.address  = 'Address is required'
    if (!form.message.trim())   e.message  = 'Message is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await submitContact({
        fullName:     form.fullName.trim(),
        email:        form.email.trim(),
        phone:        form.mobile.trim(),
        aadharNumber: form.aadharNumber.trim() || undefined,
        gender:       form.gender,
        address:      form.address.trim(),
        message:      form.message.trim(),
      })
      setDone(true)
    } catch (e) {
      setErrors({ submit: e?.response?.data?.message || 'Failed to send. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) return <SuccessScreen name={form.fullName} />

  return (
    <>
      <style>{`
        .cf-input:focus  { border-color:#F05A1A !important; box-shadow:0 0 0 3px rgba(240,90,26,.1) !important; }
        .cf-select:focus { border-color:#F05A1A !important; box-shadow:0 0 0 3px rgba(240,90,26,.1) !important; }
        .cf-textarea:focus { border-color:#F05A1A !important; box-shadow:0 0 0 3px rgba(240,90,26,.1) !important; }
        .cf-input::placeholder   { color:#cbd5e1; font-weight:400; }
        .cf-textarea::placeholder { color:#cbd5e1; font-weight:400; }
        @keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:.6} }
        .prefill-badge { animation: pulse-badge 2s ease infinite; }
        @keyframes spin360 { to{transform:rotate(360deg)} }
      `}</style>

      {showOTP && (
        <OTPModal email={form.email} onVerified={handleVerified} onClose={() => setShowOTP(false)} />
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:16 }}>

        {/* Title */}
        <div style={{ marginBottom:2 }}>
          <h2 style={{ margin:'0 0 4px', lineHeight:1.1 }}>
            <span style={{ fontWeight:800, color:'#0B1E4B', fontSize:'clamp(18px,3vw,26px)', letterSpacing:.5 }}>GET IN </span>
            <span style={{ fontWeight:800, color:'#F05A1A', fontSize:'clamp(18px,3vw,26px)', letterSpacing:.5 }}>TOUCH WITH US</span>
          </h2>
          <p style={{ color:'#94a3b8', fontSize:12.5, margin:0, lineHeight:1.55 }}>
            Send us a message — we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Pre-fill notice */}
        {(prefilled.name || prefilled.email || prefilled.message) && (
          <div style={{ display:'flex', alignItems:'flex-start', gap:9, padding:'11px 13px',
            borderRadius:11, background:'#eff6ff', border:'1px solid #bfdbfe' }}>
            <span style={{ fontSize:16 }}>✨</span>
            <div>
              <p style={{ fontSize:12.5, fontWeight:700, color:'#1d4ed8', margin:'0 0 2px' }}>
                Details pre-filled from your quick form!
              </p>
              <p style={{ fontSize:11.5, color:'#3b82f6', margin:0 }}>
                Please review, complete remaining fields, and verify your email.
              </p>
            </div>
          </div>
        )}

        {/* ── FULL NAME ── */}
        <Field label="Full Name" required>
          <div style={{ position:'relative' }}>
            <input type="text" placeholder="Enter your full name"
              value={form.fullName} className="cf-input"
              onChange={e => { set('fullName', e.target.value); clrErr('fullName') }}
              style={{ ...inputBase(errors.fullName), paddingLeft: prefilled.name ? 36 : 12 }} />
            {prefilled.name && (
              <span className="prefill-badge" style={{ position:'absolute', left:11, top:'50%',
                transform:'translateY(-50%)', fontSize:14 }}>✏️</span>
            )}
          </div>
          <Err msg={errors.fullName} />
        </Field>

        {/* ── EMAIL + VERIFY ── */}
        <Field label="Email Address" required>
          <div style={{ display:'flex', gap:7 }}>
            <input type="email" placeholder="your@email.com"
              value={form.email} disabled={form.emailVerified}
              className="cf-input"
              onChange={e => { set('email', e.target.value); set('emailVerified', false); clrErr('email') }}
              style={{
                ...inputBase(errors.email), flex:1,
                background: form.emailVerified ? '#f0faf4' : '#fff',
                color:      form.emailVerified ? '#1a6b3a' : '#0B1E4B',
                border:     form.emailVerified ? '1.5px solid #1a6b3a' : undefined,
                cursor:     form.emailVerified ? 'not-allowed' : 'text',
                minWidth:0,
              }} />
            {form.emailVerified ? (
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'0 11px',
                height:42, borderRadius:9, background:'#f0faf4',
                border:'1.5px solid #1a6b3a', color:'#1a6b3a',
                fontSize:12, fontWeight:800, whiteSpace:'nowrap', flexShrink:0 }}>
                <MdVerified style={{ fontSize:15 }} /> Verified
              </div>
            ) : (
              <button type="button" onClick={() => setShowOTP(true)}
                      disabled={!form.email || !form.email.includes('@')}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'0 13px',
                        height:42, borderRadius:9, border:'none',
                        background:'#0B1E4B', color:'#fff', fontSize:12, fontWeight:800,
                        cursor:'pointer', flexShrink:0, whiteSpace:'nowrap',
                        opacity: (!form.email || !form.email.includes('@')) ? .4 : 1,
                        transition:'all .2s' }}>
                <FaEnvelope style={{ fontSize:10 }} /> Verify
              </button>
            )}
          </div>
          <Err msg={errors.email} />
        </Field>

        {/* ── MOBILE ── */}
        <Field label="Mobile Number" required>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
              fontSize:12, fontWeight:700, color:'#64748b', pointerEvents:'none',
              borderRight:'1px solid #e2e8f0', paddingRight:7, lineHeight:1 }}>
              +91
            </div>
            <input type="tel" placeholder="98765 43210" maxLength={10}
              value={form.mobile} className="cf-input"
              onChange={e => { set('mobile', e.target.value.replace(/\D/g,'')); clrErr('mobile') }}
              style={{ ...inputBase(errors.mobile), paddingLeft:48 }} />
          </div>
          <Err msg={errors.mobile} />
        </Field>

        {/* ── AADHAAR (optional) ── */}
        <Field label="Aadhaar Number" hint="Optional — kept strictly confidential">
          <div style={{ position:'relative' }}>
            <input type="text" placeholder="XXXX XXXX XXXX" maxLength={14}
              value={form.aadharNumber} className="cf-input"
              onChange={e => {
                const raw = e.target.value.replace(/\D/g,'').slice(0,12)
                const fmt = raw.match(/.{1,4}/g)?.join(' ') || raw
                set('aadharNumber', fmt)
              }}
              style={{ ...inputBase(false), paddingLeft:40 }} />
            <FaIdCard style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)',
              color:'#cbd5e1', fontSize:15, pointerEvents:'none' }} />
          </div>
        </Field>

        {/* ── GENDER ── */}
        <Field label="Gender" required>
          <div style={{ position:'relative' }}>
            <select value={form.gender} className="cf-select"
                    onChange={e => { set('gender', e.target.value); clrErr('gender') }}
                    style={{ ...inputBase(errors.gender), appearance:'none', cursor:'pointer', paddingRight:32 }}>
              {GENDER_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
              color:'#94a3b8', fontSize:10, pointerEvents:'none' }}>▼</div>
          </div>
          <Err msg={errors.gender} />
        </Field>

        {/* ── ADDRESS ── */}
        <Field label="Full Address" required>
          <input type="text" placeholder="House No., Street, Area, City, State – PIN Code"
            value={form.address} className="cf-input"
            onChange={e => { set('address', e.target.value); clrErr('address') }}
            style={inputBase(errors.address)} />
          <Err msg={errors.address} />
        </Field>

        {/* ── MESSAGE ── */}
        <Field label="Your Message" required>
          <div style={{ position:'relative' }}>
            <textarea rows={4} placeholder="Write your question, suggestion or query here…"
              value={form.message} className="cf-textarea"
              onChange={e => { set('message', e.target.value); clrErr('message') }}
              style={{ ...inputBase(errors.message), height:'auto', padding:'10px 12px',
                resize:'none', lineHeight:1.6,
                paddingLeft: prefilled.message ? 36 : 12 }} />
            {prefilled.message && (
              <span className="prefill-badge" style={{ position:'absolute', left:11, top:11, fontSize:14 }}>✏️</span>
            )}
          </div>
          <Err msg={errors.message} />
        </Field>

        {errors.submit && (
          <div style={{ padding:'10px 13px', borderRadius:9, background:'#fef2f2',
            border:'1px solid #fecaca', fontSize:12.5, color:'#ef4444', fontWeight:600 }}>
            {errors.submit}
          </div>
        )}

        {/* ── SUBMIT ── */}
        <button type="submit" disabled={submitting}
                style={{
                  width:'100%', height:46, borderRadius:12, border:'none', cursor:'pointer',
                  background:'linear-gradient(135deg,#F05A1A,#FF7D42)', color:'#fff',
                  fontSize:14, fontWeight:800, letterSpacing:.4,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  boxShadow:'0 6px 24px rgba(240,90,26,.38)',
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  opacity: submitting ? .7 : 1, transition:'all .2s',
                  marginTop:2,
                }}>
          {submitting
            ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin360 .7s linear infinite' }} /> Sending...</>
            : <><MdSend style={{ fontSize:17 }} /> Send Message</>}
        </button>
      </form>
    </>
  )
}

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
export default function ContactUs() {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(180deg,#F4F6FB 0%,#fff 100%)' }}>
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 20px;
          align-items: start;
        }
        .info-sticky { position: sticky; top: 20px; order: 1; }
        .form-col    { order: 2; }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .info-sticky { position: static; order: 2; }
          .form-col    { order: 1; }
        }
      `}</style>

      <div style={{ maxWidth:1160, margin:'0 auto', padding:'clamp(16px,3vw,32px) clamp(14px,4vw,28px)' }}>
        <div className="contact-grid">

          {/* Left — Info Panel */}
          <div className="info-sticky">
            <InfoPanel />
          </div>

          {/* Right — Contact Form (shown first on mobile) */}
          <div className="form-col" style={{
            background:'#fff', borderRadius:20,
            border:'1.5px solid #f1f5f9',
            boxShadow:'0 4px 28px rgba(11,30,75,.07)',
            padding:'clamp(18px,3vw,30px)',
          }}>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}