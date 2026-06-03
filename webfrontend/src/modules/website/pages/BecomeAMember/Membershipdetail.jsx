import { useState, useRef, useEffect, useCallback } from 'react'
import {
  FaUser, FaRunning, FaBuilding, FaCheckCircle, FaTimesCircle,
  FaFileAlt, FaEnvelope, FaShieldAlt,
  FaTrophy, FaMedal, FaUsers, FaGlobe, FaIdCard,
  FaCertificate, FaHandshake, FaMicrophone,
} from 'react-icons/fa'
import { MdVerified, MdClose, MdGroups } from 'react-icons/md'
import { HiSparkles, HiArrowRight } from 'react-icons/hi'
import { BsStarFill, BsBuildingsFill } from 'react-icons/bs'
import { GiDiamondTrophy, GiLaurelCrown } from 'react-icons/gi'
import { useNavigate, useLocation } from 'react-router-dom'
import { sendOtp, verifyOtp, submitMemberForm } from '../../../../shared/services/publicApi'

/* ════════════════════════════════════════════════════════
   AMOUNT DISPLAY HELPER
   Pass the row's amountNum, membershipId, and subType.
   Returns the string to show in the fee table.
════════════════════════════════════════════════════════ */
const getAmountDisplay = (amountNum, membershipId, subType) => {
  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`

  /* ── Individual Players ── */
  if (membershipId === 'individual') {
    // EWS → ₹1,200   General → ₹2,500   (plain, no donation split)
    return fmt(amountNum)
  }

  /* ── Individual Patron ── */
  if (membershipId === 'player') {
    if (subType === 'EWS') {
      // ₹5,000  (plain)
      return fmt(5000)
    }
    if (subType === 'Ex Sports') {
      // ₹5,000 # ₹7,500 
      return `${fmt(5000)} # ${fmt(7500)} `
    }
    if (subType === 'General') {
      // ₹5,000 # ₹20,000 
      return `${fmt(5000)} # ${fmt(20000)} `
    }
    if (subType === 'Silver') {
      // ₹5,000 # ₹45,000 
      return `${fmt(5000)} # ${fmt(45000)} `
    }
    if (subType === 'Gold') {
      // ₹5,000 # ₹70,000 
      return `${fmt(5000)} # ${fmt(70000)} `
    }
    if (subType === 'Diamond') {
      // ₹5,000 # ₹95,000 
      return `${fmt(5000)} # ${fmt(95000)} `
    }
    return fmt(amountNum)
  }

  /* ── Lifetime Corporate ── */
  if (membershipId === 'corporate') {
    // membership fee = ₹5,000; rest = recommended donation
    const membershipFee = 5000
    const donation = amountNum - membershipFee
    return `${fmt(membershipFee)} # ${fmt(donation)} `
  }

  return fmt(amountNum)
}

/* ════════════════════════════════════════════════════════
   MEMBERSHIP DATA
════════════════════════════════════════════════════════ */

const MEMBERSHIP_DATA = {
  individual: {
    id: 'individual',
    label: 'Individual Players Membership',
    shortLabel: 'Individual',
    Icon: FaUser,
    accentColor: '#0B1E4B',
    accentLight: '#EEF2FF',
    tagline: 'For sports enthusiasts, officials & volunteers',
    description: 'Individual Players Membership is open to any person who has an interest in the promotion and development of sports in India. It provides direct access to UDIISA events, training programmes, and community networks. This membership is valid for 1 year.',
    eligibility: [
      'Indian citizen aged 18 years or above',
      'Genuine interest in sports development or administration',
      'Not serving any ban or suspension from a recognised sports body',
      'Membership is subject to approval by Governing Body',
    ],
    documents: [
      'Recent passport-size photograph',
      'Copy of Aadhaar / Passport / Voter ID',
      'PAN Card copy',
      'Brief letter of intent (100–200 words)',
    ],
    feeTable: [
      { subType: 'EWS',     amount: '₹1,200',  amountNum: 1200,  benefits: ['Membership Certificate', 'Membership ID Card'], badgeCls: 'bg-emerald-600 text-white', rowBg: '' },
      { subType: 'General', amount: '₹2,500',  amountNum: 2500,  benefits: ['Membership Certificate', 'Membership ID Card'], badgeCls: 'bg-[#0B1E4B] text-white',   rowBg: 'bg-blue-50/40' },
    ],
    notes: [
      'Subscription valid till 31 March 2027 on first-cum-first-served basis.',
      'Subscription for FY 2027-28 may be revised as per UDIISA decision.',
      'Membership is subject to approval by Governing Body.',
      'Membership rights are non-transferable.',
      'GST 18% extra applicable.',
    ],
    benefits: [
      { icon: FaCertificate, text: 'Official UDIISA Membership Certificate' },
      { icon: FaIdCard,      text: 'Personalised Membership ID Card' },
      { icon: FaTrophy,      text: 'Access to UDIISA national & state sports events' },
      { icon: MdGroups,      text: 'Invitation to Annual General Body Meeting (AGM)' },
      { icon: HiSparkles,    text: 'Monthly sports newsletter & knowledge bulletins' },
      { icon: FaShieldAlt,   text: 'Grievance redressal & member support helpline' },
    ],
    membershipOpts: ['— Select Sub-Type —', 'EWS (₹1,200)', 'General (₹2,500)'],
  },

  player: {
    id: 'player',
    label: 'Individual Patron Membership',
    shortLabel: 'Patron',
    Icon: FaRunning,
    accentColor: '#F05A1A',
    accentLight: '#FFF3EC',
    tagline: 'For active Players, patrons & sports leaders',
    description: 'Individual Patron Membership is designed for active Players, ex-sportspersons, and dedicated patrons of sports. Each higher tier automatically includes all privileges of the preceding lower tiers. This membership is valid for 1 year.',
    eligibility: [
      'Active or retired sportsperson / sports administrator',
      'Genuine commitment to sports development in India',
      'Membership is subject to approval by Governing Body',
      'Age: 14 years and above (guardian consent required under 18)',
    ],
    documents: [
      'Recent passport-size photograph',
      'Copy of Aadhaar / Passport / Voter ID',
      'Sports federation certificate or achievement proof (if applicable)',
      'PAN Card copy',
    ],
    feeTable: [
      { subType: 'EWS',       amount: '₹5,000',    amountNum: 5000,   benefits: ['Membership Certificate', 'ID Card'],                              badgeCls: 'bg-emerald-600 text-white', rowBg: '' },
      { subType: 'Ex Sports', amount: '₹12,500',   amountNum: 12500,  benefits: ['Membership Certificate', 'ID Card'],                              badgeCls: 'bg-slate-600 text-white',   rowBg: 'bg-slate-50/60' },
      { subType: 'General',   amount: '₹25,000',   amountNum: 25000,  benefits: ['Certificate', 'ID Card', 'Speaker Opportunity'],                  badgeCls: 'bg-[#F05A1A] text-white',   rowBg: 'bg-orange-50/40' },
      { subType: 'Silver',    amount: '₹50,000',   amountNum: 50000,  benefits: ['Certificate', 'ID', 'Speaker Opp.', 'Advisory Panel Access', 'Website Listing'],     badgeCls: 'bg-slate-400 text-white',   rowBg: 'bg-slate-50' },
      { subType: 'Gold',      amount: '₹75,000',   amountNum: 75000,  benefits: ['All Silver benefits', 'Governing Council Access'],                badgeCls: 'bg-amber-500 text-white',   rowBg: 'bg-amber-50/40' },
      { subType: 'Diamond',   amount: '₹1,00,000', amountNum: 100000, benefits: ['All Gold benefits', 'Founder Member Category'],                   badgeCls: 'bg-indigo-600 text-white',  rowBg: 'bg-indigo-50/40' },
    ],
    notes: [
      'Each higher membership tier automatically includes all privileges of the preceding lower tiers.',
      'Subscription valid till 31 March 2027 on first-cum-first-served basis.',
      'Subscription for FY 2027-28 may be revised as per UDIISA decision.',
      'Membership is subject to approval by Governing Body.',
      'Membership rights are non-transferable.',
      'GST 18% extra applicable.',
    ],
    benefits: [
      { icon: FaCertificate,   text: 'Official UDIISA Membership Certificate & ID Card' },
      { icon: FaMicrophone,    text: 'Speaker Opportunity at UDIISA events (General & above)' },
      { icon: FaHandshake,     text: 'Advisory Panel Access (Silver & above)' },
      { icon: GiLaurelCrown,   text: 'Governing Council Access (Gold & above)' },
      { icon: GiDiamondTrophy, text: 'Founder Member Category recognition (Diamond)' },
      { icon: FaTrophy,        text: 'Priority access to national sports events & programmes' },
    ],
    membershipOpts: ['— Select Sub-Type —', 'EWS (₹5,000)', 'Ex Sports (₹12,500)', 'General (₹25,000)', 'Silver (₹50,000)', 'Gold (₹75,000)', 'Diamond (₹1,00,000)'],
  },

  corporate: {
    id: 'corporate',
    label: 'Lifetime Corporate Membership',
    shortLabel: 'Corporate',
    Icon: FaBuilding,
    accentColor: '#1a6b3a',
    accentLight: '#F0FAF4',
    tagline: 'For companies, associations & sports organisations',
    description: 'Lifetime Corporate Membership is available to companies and organisations whose objectives align with sports promotion. Each higher tier includes all privileges of preceding tiers. Valid till 31 March 2027 on first-cum-first-served basis. This membership is valid for 1 year.',
    eligibility: [
      'Registered company, LLP, partnership firm, trust, NGO, or association in India',
      'Aims & objectives aligned with sports development or player welfare',
      'Minimum 2 years of existence (date of incorporation)',
      'Membership is subject to approval by Governing Body',
    ],
    documents: [
      'Certificate of Incorporation / Registration',
      'Memorandum & Articles of Association / Trust Deed',
      'Latest audited Balance Sheet / Annual Report',
      'GST Certificate copy',
      'PAN & Aadhaar of authorised signatory',
      'List of Directors / Trustees with full addresses',
    ],
    feeTable: [
      { subType: 'Up to ₹1 Cr',      amount: '₹2,50,000',  amountNum: 250000,  benefits: ['Website Listing'],                                          badgeCls: 'bg-emerald-600 text-white', rowBg: '' },
      { subType: '₹1 Cr – ₹5 Cr',    amount: '₹5,00,000',  amountNum: 500000,  benefits: ['Website Listing', 'Event Branding'],                        badgeCls: 'bg-teal-600 text-white',    rowBg: 'bg-teal-50/30' },
      { subType: '₹5 Cr – ₹25 Cr',   amount: '₹10,00,000', amountNum: 1000000, benefits: ['Website Listing', 'Event Branding', 'Speaking Opportunity'], badgeCls: 'bg-[#1a6b3a] text-white',   rowBg: 'bg-green-50/40' },
      { subType: '₹25 Cr – ₹50 Cr',  amount: '₹20,00,000', amountNum: 2000000, benefits: ['All above', 'Advisory Panel Access'],                       badgeCls: 'bg-slate-500 text-white',   rowBg: 'bg-slate-50/60' },
      { subType: '₹50 Cr – ₹100 Cr', amount: '₹35,00,000', amountNum: 3500000, benefits: ['All above', 'Governing Council Access'],                    badgeCls: 'bg-amber-600 text-white',   rowBg: 'bg-amber-50/40' },
      { subType: 'Above ₹100 Cr',     amount: '₹50,00,000', amountNum: 5000000, benefits: ['All above', 'Strategic Corporate Partner'],                 badgeCls: 'bg-indigo-700 text-white',  rowBg: 'bg-indigo-50/40' },
    ],
    notes: [
      'Each higher membership tier automatically includes all privileges of preceding lower tiers.',
      'Lifetime subscription valid till 31 March 2027 on first-cum-first-served basis.',
      'Subscription for FY 2027-28 may be revised as per UDIISA decision.',
      'Membership is subject to approval by Governing Body.',
      'Membership rights are non-transferable.',
      'GST 18% extra applicable.',
    ],
    benefits: [
      { icon: FaGlobe,         text: 'Brand listing on official UDIISA website' },
      { icon: BsBuildingsFill, text: 'Event branding at UDIISA national events' },
      { icon: FaMicrophone,    text: 'Speaking opportunity at major sports summits' },
      { icon: FaHandshake,     text: 'Advisory Panel Access (₹25 Cr+ slab & above)' },
      { icon: GiLaurelCrown,   text: 'Governing Council Access (₹50 Cr+ slab & above)' },
      { icon: BsStarFill,      text: 'Strategic Corporate Partner (Above ₹100 Cr slab)' },
    ],
    membershipOpts: ['— Select Turnover Slab —', 'Up to ₹1 Cr (₹2,50,000)', '₹1 Cr – ₹5 Cr (₹5,00,000)', '₹5 Cr – ₹25 Cr (₹10,00,000)', '₹25 Cr – ₹50 Cr (₹20,00,000)', '₹50 Cr – ₹100 Cr (₹35,00,000)', 'Above ₹100 Cr (₹50,00,000)'],
  },
}

const TABS = [
  { id: 'individual', label: 'Individual Players', shortLabel: 'Individual', Icon: FaUser },
  { id: 'player',     label: 'Individual Patron',  shortLabel: 'Patron',     Icon: FaRunning },
  { id: 'corporate',  label: 'Lifetime Corporate', shortLabel: 'Corporate',  Icon: FaBuilding },
]

const PATH_TO_TAB = {
  '/membership/individual-player':  'individual',
  '/membership/individual-patron':  'player',
  '/membership/lifetime-corporate': 'corporate',
}
const TAB_TO_PATH = {
  individual: '/membership/individual-player',
  player:     '/membership/individual-patron',
  corporate:  '/membership/lifetime-corporate',
}

const GENDER_OPTS = ['', 'Male', 'Female', 'Other / Prefer not to say']
const getMembershipAmountLabel = (value = '') => {
  const match = String(value || '').match(/\((₹[^)]+)\)/)
  return match ? match[1] : ''
}

/* ════════════════════════════════════════════════════════
   OTP MODAL
════════════════════════════════════════════════════════ */
function OTPModal({ email, onVerified, onClose }) {
  const LEN = 6, SEC = 60
  const [digits,    setDigits]    = useState(Array(LEN).fill(''))
  const [timer,     setTimer]     = useState(SEC)
  const [canResend, setCanResend] = useState(false)
  const [err,       setErr]       = useState('')
  const [shake,     setShake]     = useState(false)
  const [busy,      setBusy]      = useState(false)
  const [sent,      setSent]      = useState(false)
  const refs    = useRef([])
  const flying  = useRef(false)
  const sentFor = useRef('')
  const norm    = (email || '').trim().toLowerCase()

  const doSend = useCallback(async (force = false) => {
    if (!norm || flying.current) return
    if (!force && sentFor.current === norm) return
    flying.current = true; setErr('')
    try {
      await sendOtp(norm)
      sentFor.current = norm; setSent(true)
      setTimer(SEC); setCanResend(false)
    } catch (e) {
      sentFor.current = ''; setErr(e?.response?.data?.message || 'Failed to send OTP')
    } finally { flying.current = false }
  }, [norm])

  useEffect(() => { if (norm && !sent) doSend() }, [norm, sent, doSend])
  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return }
    const t = setTimeout(() => setTimer(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [timer])
  useEffect(() => { setTimeout(() => refs.current[0]?.focus(), 120) }, [])

  const handleDigit = (i, val) => {
    const ch = val.replace(/\D/g,'').slice(-1)
    const next = [...digits]; next[i] = ch; setDigits(next); setErr('')
    if (ch && i < LEN - 1) refs.current[i+1]?.focus()
  }
  const handleKey = (i, e) => {
    if (e.key==='Backspace' && !digits[i] && i>0) refs.current[i-1]?.focus()
    if (e.key==='ArrowLeft'  && i>0)     refs.current[i-1]?.focus()
    if (e.key==='ArrowRight' && i<LEN-1) refs.current[i+1]?.focus()
  }
  const handlePaste = (e) => {
    e.preventDefault()
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,LEN)
    const n = Array(LEN).fill('')
    p.split('').forEach((c,i) => { n[i] = c })
    setDigits(n)
    refs.current[Math.min(p.length, LEN-1)]?.focus()
  }
  const handleVerify = async () => {
    const code = digits.join('')
    if (code.length < LEN) { setErr('Please enter all 6 digits'); doShake(); return }
    setBusy(true); setErr('')
    verifyOtp(norm, code)
      .then(() => onVerified())
      .catch(e => {
        setErr(e?.response?.data?.message || 'Incorrect OTP. Please try again.')
        setDigits(Array(LEN).fill('')); doShake()
        setTimeout(() => refs.current[0]?.focus(), 50)
      })
      .finally(() => setBusy(false))
  }
  const doShake = () => { setShake(true); setTimeout(() => setShake(false), 500) }
  const masked  = email.replace(/(.{2}).+(@.+)/, '$1***$2')
  const filled  = digits.filter(Boolean).length

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 bg-[rgba(11,30,75,0.6)] backdrop-blur-[6px] overflow-hidden"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <style>{`
        @keyframes modalPop{from{opacity:0;transform:scale(.86) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes shakeX{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        .modal-pop{animation:modalPop .28s cubic-bezier(.34,1.56,.64,1) both}
        .shake-x{animation:shakeX .45s ease}
        @keyframes spinR{to{transform:rotate(360deg)}} .spinR{animation:spinR .7s linear infinite}
      `}</style>
      <div className="relative w-full max-w-[410px] bg-white rounded-[24px] shadow-[0_28px_90px_rgba(11,30,75,.24)] overflow-hidden modal-pop">
        <div className="bg-gradient-to-r from-[#0B1E4B] to-[#1e3a8a] !px-7 !py-6 text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[rgba(240,90,26,.12)]" />
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <MdClose className="text-[15px]" />
          </button>
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl !mx-auto !mb-3 bg-gradient-to-br from-[#F05A1A] to-[#FF7D42] flex items-center justify-center shadow-[0_8px_24px_rgba(240,90,26,.4)]">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <h3 className="text-white font-extrabold text-[17px] !m-0 !mb-1">Verify Your Email</h3>
            <p className="text-white/50 text-[12px] !m-0">OTP sent to <span className="text-white/80 font-semibold">{masked}</span></p>
          </div>
        </div>
        <div className="!p-7 flex flex-col !gap-5">
          <div className="flex items-start !gap-2.5 !px-3.5 !py-3 rounded-xl bg-blue-50 border border-blue-100">
            <FaShieldAlt className="text-blue-400 text-[12px] flex-shrink-0 !mt-px" />
            <p className="text-[12px] text-blue-600 !m-0 leading-[1.55]">Enter the <strong>6-digit OTP</strong> sent to your email. Valid for <strong>10 minutes</strong>.</p>
          </div>
          <div className="flex flex-col !gap-2.5">
            <label className="text-[11px] font-extrabold text-[#0B1E4B] uppercase tracking-[1.3px]">Enter OTP</label>
            <div className={`flex justify-between !gap-2 ${shake ? 'shake-x' : ''}`} onPaste={handlePaste}>
              {digits.map((d,i) => (
                <input key={i} ref={el => refs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1} value={d}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKey(i, e)}
                  className={`w-full h-[52px] rounded-xl text-center text-[20px] font-extrabold border-2 bg-white focus:outline-none transition-all caret-transparent select-none
                    ${err ? 'border-red-400 text-red-500 bg-red-50'
                       : d  ? 'border-[#F05A1A] text-[#0B1E4B] bg-[#FFF9F6] shadow-[0_2px_8px_rgba(240,90,26,.1)]'
                            : 'border-slate-200 text-[#0B1E4B] focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10'}`}
                />
              ))}
            </div>
            <div className="flex justify-center !gap-1.5">
              {digits.map((d,i) => <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${d ? 'bg-[#F05A1A] scale-125' : 'bg-slate-200'}`} />)}
            </div>
            {err && (
              <div className="flex items-center !gap-1.5 !px-3 !py-2 rounded-[10px] bg-red-50 border border-red-200">
                <FaTimesCircle className="text-red-400 text-[12px] flex-shrink-0" />
                <span className="text-[11.5px] font-semibold text-red-500">{err}</span>
              </div>
            )}
          </div>
          <button onClick={handleVerify} disabled={filled < LEN || busy}
            className="w-full h-[48px] rounded-[13px] bg-gradient-to-r from-[#F05A1A] to-[#FF7D42] text-white text-[14px] font-extrabold flex items-center justify-center !gap-2 shadow-[0_6px_24px_rgba(240,90,26,.35)] hover:shadow-[0_10px_32px_rgba(240,90,26,.5)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {busy ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinR" />Verifying…</> : <><MdVerified className="text-[17px]" />Verify OTP</>}
          </button>
          <div className="text-center">
            {canResend ? (
              <div className="flex flex-col items-center !gap-2">
                <p className="text-[12px] text-slate-400 !m-0">Didn't receive the code?</p>
                <button onClick={() => { setDigits(Array(LEN).fill('')); setTimer(SEC); setCanResend(false); setErr(''); doSend(true); setTimeout(() => refs.current[0]?.focus(), 50) }}
                  className="flex items-center !gap-1.5 !px-4 !py-2 rounded-[10px] bg-[#0B1E4B] text-white text-[12.5px] font-extrabold hover:bg-[#152B6B] transition-all">
                  <FaEnvelope className="text-[11px]" /> Resend OTP
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center !gap-2">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#f1f5f9" strokeWidth="2.5" />
                    <circle cx="16" cy="16" r="13" fill="none" stroke="#F05A1A" strokeWidth="2.5"
                      strokeDasharray={`${2*Math.PI*13}`}
                      strokeDashoffset={`${2*Math.PI*13*(1-timer/SEC)}`}
                      strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#F05A1A]">{timer}</span>
                </div>
                <p className="text-[12px] text-slate-400 !m-0">Resend in <span className="font-bold text-[#0B1E4B]">{timer}s</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   QUERY FORM MODAL
════════════════════════════════════════════════════════ */
function QueryFormModal({ tabData, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const [form, setForm] = useState({
    fullName: '', email: '', emailVerified: false,
    phone: '', gender: '', age: '',
    address: '', membershipType: '', message: '',
  })
  const [errors,  setErrors]  = useState({})
  const [showOTP, setShowOTP] = useState(false)
  const [success, setSuccess] = useState(false)
  const [busy,    setBusy]    = useState(false)
  const selectedMembershipType = form.membershipType && !form.membershipType.startsWith('—') ? form.membershipType : ''
  const selectedFee = getMembershipAmountLabel(selectedMembershipType)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())  e.fullName       = 'Full name is required'
    if (!form.email.trim())     e.email          = 'Email is required'
    if (!form.emailVerified)    e.email          = 'Please verify your email first'
    if (!form.phone.trim())     e.phone          = 'Phone number is required'
    if (!form.gender)           e.gender         = 'Please select gender'
    if (!form.age)              e.age            = 'Age is required'
    if (+form.age < 5 || +form.age > 100) e.age  = 'Enter valid age (5–100)'
    if (!form.address.trim())   e.address        = 'Address is required'
    if (!form.membershipType || form.membershipType.startsWith('—'))
                                e.membershipType = 'Please select membership type'
    return e
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setBusy(true)
    try {
      const payload = new FormData()
      payload.append('formType', 'membership-query')
      payload.append('category', tabData.id)
      payload.append('fullName', form.fullName.trim())
      payload.append('email', form.email.trim().toLowerCase())
      payload.append('phone', form.phone.trim())
      payload.append('gender', form.gender)
      payload.append('age', String(form.age))
      payload.append('address', form.address.trim())
      payload.append('membershipType', form.membershipType)
      payload.append('message', form.message.trim())
      payload.append('termsAccepted', 'true')
      await submitMemberForm(payload)
      setSuccess(true)
    } catch (e) {
      setErrors({ submit: e?.response?.data?.message || 'Submission failed. Please try again.' })
    } finally { setBusy(false) }
  }

  const ac = tabData.accentColor

  if (success) return (
    <div className="fixed inset-0 z-[9997] flex items-center justify-center !p-4 bg-[rgba(11,30,75,.6)] backdrop-blur-[6px] overflow-hidden">
      <div className="bg-white rounded-[24px] shadow-2xl !p-8 sm:!p-10 max-w-[380px] w-full text-center flex flex-col items-center !gap-5">
        <div className="w-20 h-20 rounded-full bg-[#f0faf4] border-4 border-[#1a6b3a] flex items-center justify-center">
          <MdVerified className="text-[#1a6b3a] text-[40px]" />
        </div>
        <div>
          <h3 className="text-[#0B1E4B] font-extrabold text-[18px] sm:text-[20px] !m-0 !mb-2">Query Submitted!</h3>
          <p className="text-slate-500 text-[13px] sm:text-[13.5px] leading-relaxed !m-0">
            Thank you for your interest in <span className="font-bold text-[#F05A1A]">{tabData.label}</span>.<br/>
            Our team will contact you within <strong className="text-[#0B1E4B]">48 hours</strong>.
          </p>
        </div>
        <div className="flex items-center !gap-2 !px-3 sm:!px-4 !py-2.5 rounded-xl bg-[#FFF3EC] border border-[rgba(240,90,26,.2)]">
          <FaCheckCircle className="text-[#F05A1A] text-[13px] flex-shrink-0" />
          <span className="text-[12px] sm:text-[12.5px] font-semibold text-slate-600">Confirmation email will be sent shortly.</span>
        </div>
        <button onClick={onClose} className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0B1E4B] to-[#152B6B] text-white font-extrabold text-[13.5px] hover:shadow-lg transition-all">
          Close
        </button>
      </div>
    </div>
  )

  return (
    <>
      {showOTP && (
        <OTPModal email={form.email}
          onVerified={() => { set('emailVerified', true); setShowOTP(false) }}
          onClose={() => setShowOTP(false)}
        />
      )}
      <div
        className="fixed inset-0 z-[9997] flex items-center justify-center !p-3 sm:!p-4 bg-[rgba(11,30,75,.6)] backdrop-blur-[6px] overflow-hidden"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <style>{`
          @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
          .slide-up{animation:slideUp .3s cubic-bezier(.16,1,.3,1) both}
          @keyframes spinR{to{transform:rotate(360deg)}} .spinR{animation:spinR .7s linear infinite}
        `}</style>
        <div className="relative bg-white rounded-[22px] sm:rounded-[28px] w-full max-w-[540px] max-h-[94vh] flex flex-col shadow-[0_32px_100px_rgba(11,30,75,.22)] overflow-hidden slide-up">
          <div className="h-[5px] w-full" style={{ background: `linear-gradient(90deg,#0B1E4B,${ac},#0B1E4B)` }} />
          {/* header */}
          <div className="!px-4 sm:!px-7 !pt-4 sm:!pt-5 !pb-3 sm:!pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center !gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tabData.accentLight }}>
                <tabData.Icon style={{ color: ac }} className="text-[13px] sm:text-[17px]" />
              </div>
              <div>
                <h3 className="!m-0 text-[13px] sm:text-[15px] font-extrabold text-[#0B1E4B]">Membership Application Form</h3>
                <p className="!m-0 text-[10px] sm:text-[11px] text-slate-400">Applying under: <span className="font-bold text-[#0B1E4B]">{tabData.label}</span></p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors flex-shrink-0">
              <MdClose className="text-[16px]" />
            </button>
          </div>
          {/* scrollable body */}
          <div className="flex-1 overflow-y-auto !px-4 sm:!px-7 !py-4 sm:!py-5 flex flex-col !gap-3 sm:!gap-4" style={{ scrollbarWidth: 'thin' }}>
            <div className="rounded-xl border border-[#dbe5ff] bg-[#f8fbff] !px-3.5 sm:!px-4 !py-3">
              <p className="!m-0 text-[10.5px] sm:text-[11px] font-extrabold tracking-[0.9px] uppercase text-slate-500">You are applying for</p>
              <p className="!m-0 !mt-1 text-[13px] sm:text-[14px] font-extrabold text-[#0B1E4B]">{tabData.label}</p>
              <p className="!m-0 !mt-1 text-[11.5px] sm:text-[12px] text-slate-500">
                {selectedMembershipType
                  ? <>Selected sub-type: <span className="font-bold text-[#0B1E4B]">{selectedMembershipType}</span></>
                  : <>Please select your membership sub-type below.</>}
              </p>
              {selectedFee && (
                <p className="!m-0 !mt-1 text-[11.5px] sm:text-[12px] font-semibold text-[#1a6b3a]">
                  Expected Fee: {selectedFee} + GST
                </p>
              )}
            </div>

            <QField label="Full Name" required error={errors.fullName}>
              <QInput type="text" placeholder="Enter your full name" value={form.fullName}
                onChange={e => set('fullName', e.target.value)} err={errors.fullName} />
            </QField>
            <QField label="Email Address" required error={errors.email}>
              <div className="flex !gap-2">
                <input type="email" placeholder="your@email.com" value={form.email}
                  disabled={form.emailVerified}
                  onChange={e => { set('email', e.target.value); set('emailVerified', false) }}
                  className={`flex-1 h-10 sm:h-11 !px-3 sm:!px-3.5 rounded-xl border-[1.5px] text-[12.5px] sm:text-[13.5px] font-medium placeholder:text-slate-300 focus:outline-none transition-all min-w-0
                    ${form.emailVerified ? 'border-[#1a6b3a] bg-[#f0faf4] text-[#1a6b3a] cursor-not-allowed'
                    : errors.email      ? 'border-red-400 bg-white text-[#0B1E4B]'
                    : 'border-slate-200 bg-white text-[#0B1E4B] focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10'}`}
                />
                {form.emailVerified ? (
                  <div className="flex items-center !gap-1 !px-2.5 sm:!px-4 h-10 sm:h-11 rounded-xl bg-[#f0faf4] border-[1.5px] border-[#1a6b3a] text-[#1a6b3a] text-[11px] sm:text-[12px] font-extrabold flex-shrink-0 whitespace-nowrap">
                    <MdVerified className="text-[13px]" /> Verified
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowOTP(true)}
                    disabled={!form.email || !form.email.includes('@')}
                    className="flex items-center !gap-1 !px-2.5 sm:!px-4 h-10 sm:h-11 rounded-xl bg-[#0B1E4B] text-white text-[11px] sm:text-[12px] font-extrabold flex-shrink-0 hover:bg-[#152B6B] disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap">
                    <FaEnvelope className="text-[10px]" /> Verify
                  </button>
                )}
              </div>
            </QField>
            <div className="grid grid-cols-2 !gap-2.5 sm:!gap-3">
              <QField label="Phone" required error={errors.phone}>
                <QInput type="tel" placeholder="+91 9876543210" value={form.phone}
                  onChange={e => set('phone', e.target.value)} err={errors.phone} />
              </QField>
              <QField label="Gender" required error={errors.gender}>
                <QSelect value={form.gender} onChange={e => set('gender', e.target.value)} err={errors.gender}>
                  {GENDER_OPTS.map(g => <option key={g} value={g}>{g || '— Select —'}</option>)}
                </QSelect>
              </QField>
            </div>
            <div className="grid grid-cols-2 !gap-2.5 sm:!gap-3">
              <QField label="Age" required error={errors.age}>
                <QInput type="number" placeholder="e.g. 28" min="5" max="100"
                  value={form.age} onChange={e => set('age', e.target.value)} err={errors.age} />
              </QField>
              <QField label={tabData.id === 'corporate' ? 'Turnover Slab' : 'Membership Sub-Type'} required error={errors.membershipType}>
                <QSelect value={form.membershipType} onChange={e => set('membershipType', e.target.value)} err={errors.membershipType}>
                  {tabData.membershipOpts.map(o => <option key={o} value={o}>{o}</option>)}
                </QSelect>
              </QField>
            </div>
            <QField label="Full Address" required error={errors.address}>
              <QInput type="text" placeholder="House No., Street, City, State – PIN"
                value={form.address} onChange={e => set('address', e.target.value)} err={errors.address} />
            </QField>
            <QField label="Message / Query (Optional)">
              <textarea rows={3} placeholder="Any questions or additional details…"
                value={form.message} onChange={e => set('message', e.target.value)}
                className="w-full !px-3 sm:!px-3.5 !py-2.5 rounded-xl border-[1.5px] border-slate-200 bg-white resize-none text-[12.5px] sm:text-[13.5px] font-medium text-[#0B1E4B] placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10 transition-all" />
            </QField>
            {errors.submit && (
              <div className="flex items-center !gap-2 !px-3 !py-2.5 rounded-xl bg-red-50 border border-red-200">
                <FaTimesCircle className="text-red-400 text-[13px]" />
                <span className="text-[12px] text-red-500 font-semibold">{errors.submit}</span>
              </div>
            )}
          </div>
          {/* footer */}
          <div className="!px-4 sm:!px-7 !py-3 sm:!py-4 border-t border-slate-100 flex !gap-2.5 sm:!gap-3 justify-end flex-shrink-0">
            <button onClick={onClose} className="!px-3.5 sm:!px-5 !py-2 sm:!py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-[12px] sm:text-[13px] font-bold transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={busy}
              className="flex items-center !gap-2 !px-4 sm:!px-6 !py-2 sm:!py-2.5 rounded-xl text-white text-[12px] sm:text-[13px] font-extrabold disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-px"
              style={{ background: `linear-gradient(135deg,${ac},${ac}cc)`, boxShadow: `0 4px 14px ${ac}40` }}>
              {busy ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinR" /> : <HiArrowRight className="text-[14px] sm:text-[15px]" />}
              {busy ? 'Submitting…' : 'Submit Query'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* tiny form atoms */
function QField({ label, required, error, children }) {
  return (
    <div className="flex flex-col !gap-1.5">
      {label && <label className="text-[10px] sm:text-[11px] font-extrabold text-[#0B1E4B] uppercase tracking-[1.3px]">
        {label}{required && <span className="text-[#F05A1A] !ml-0.5">*</span>}
      </label>}
      {children}
      {error && <span className="flex items-center !gap-1 text-[10.5px] sm:text-[11.5px] text-red-500 font-semibold">
        <FaTimesCircle className="text-[10px]" />{error}
      </span>}
    </div>
  )
}
function QInput({ err, ...props }) {
  return <input className={`w-full h-10 sm:h-11 !px-3 sm:!px-3.5 rounded-xl border-[1.5px] bg-white text-[12.5px] sm:text-[13.5px] font-medium text-[#0B1E4B] placeholder:text-slate-300 placeholder:font-normal focus:outline-none transition-all
    ${err ? 'border-red-400 focus:ring-2 focus:ring-red-400/10' : 'border-slate-200 focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10'}`} {...props} />
}
function QSelect({ err, children, ...props }) {
  return (
    <div className="relative">
      <select className={`w-full h-10 sm:h-11 !px-3 sm:!px-3.5 !pr-7 rounded-xl border-[1.5px] bg-white appearance-none text-[12.5px] sm:text-[13.5px] font-medium text-[#0B1E4B] cursor-pointer focus:outline-none transition-all
        ${err ? 'border-red-400' : 'border-slate-200 focus:border-[#F05A1A] focus:ring-2 focus:ring-[#F05A1A]/10'}`} {...props}>
        {children}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   TAB CONTENT
════════════════════════════════════════════════════════ */
function TabContent({ data, onFillOnline }) {
  const ac = data.accentColor

  return (
    <div className="flex flex-col" style={{ gap: 'clamp(14px, 2.5vw, 32px)' }}>

      {/* Description */}
      <p className="text-slate-600 leading-[1.8] !m-0"
        style={{ fontSize: 'clamp(12px, 1.5vw, 14px)', maxWidth: 820 }}>
        {data.description}
      </p>

      {/* Benefits Grid */}
      <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(11,30,75,.06)]"
        style={{ padding: 'clamp(14px, 2vw, 24px)' }}>
        <h4 className="flex items-center !m-0 font-extrabold text-[#0B1E4B] uppercase tracking-wider"
          style={{ gap: 'clamp(6px,1vw,10px)', fontSize: 'clamp(10px,1.2vw,12.5px)', marginBottom: 'clamp(12px,1.5vw,20px)' }}>
          <div className="rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ width: 'clamp(22px,2.5vw,28px)', height: 'clamp(22px,2.5vw,28px)', background: data.accentLight }}>
            <BsStarFill style={{ color: ac, fontSize: 'clamp(9px,1vw,11px)' }} />
          </div>
          Benefits to Members
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 'clamp(8px,1.5vw,16px)' }}>
          {data.benefits.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start rounded-[12px] sm:rounded-[14px] border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all"
              style={{ gap: 'clamp(8px,1.2vw,12px)', padding: 'clamp(10px,1.4vw,16px)' }}>
              <div className="rounded-[9px] sm:rounded-[10px] flex-shrink-0 flex items-center justify-center"
                style={{ width: 'clamp(28px,3vw,36px)', height: 'clamp(28px,3vw,36px)', background: data.accentLight, minWidth: 28 }}>
                <Icon style={{ color: ac, fontSize: 'clamp(11px,1.2vw,14px)' }} />
              </div>
              <p className="!m-0 text-slate-600 font-medium leading-[1.55]"
                style={{ fontSize: 'clamp(11px,1.2vw,12.5px)', paddingTop: 3 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Table */}
      <div className="overflow-x-auto rounded-[14px] sm:rounded-[18px] border border-slate-200 shadow-[0_2px_12px_rgba(11,30,75,.05)]">
        <table className="w-full text-left" style={{ minWidth: 420 }}>
          <thead>
            <tr style={{ background: 'linear-gradient(90deg,#0B1E4B,#1e3a8a)' }}>
              <th style={{ padding: 'clamp(8px,1.2vw,12px) clamp(10px,1.5vw,20px)', fontSize: 'clamp(9px,1vw,11px)', fontWeight: 800, color: 'rgba(255,255,255,.75)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {data.id === 'corporate' ? 'Company Turnover Range' : 'Membership Sub-Type'}
              </th>
              <th className="text-left" style={{ padding: 'clamp(8px,1.2vw,12px) clamp(10px,1.5vw,20px)', fontSize: 'clamp(9px,1vw,11px)', fontWeight: 800, color: 'rgba(255,255,255,.75)', letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Amount # Donation
              </th>
              <th className="hidden md:table-cell" style={{ padding: 'clamp(8px,1.2vw,12px) clamp(10px,1.5vw,20px)', fontSize: 'clamp(9px,1vw,11px)', fontWeight: 800, color: 'rgba(255,255,255,.75)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Key Benefits
              </th>
            </tr>
          </thead>
          <tbody>
            {data.feeTable.map((row, i) => (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? '#fff' : '#f8fafc',
                  borderBottom: i < data.feeTable.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <td style={{ padding: 'clamp(8px,1.2vw,12px) clamp(10px,1.5vw,20px)', fontSize: 'clamp(11px,1.2vw,13px)', color: '#1e293b', fontWeight: 600 }}>
                  {row.subType}
                </td>
                <td className="text-left" style={{ padding: 'clamp(8px,1.2vw,12px) clamp(10px,1.5vw,20px)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 'clamp(11px,1.2vw,13px)', fontWeight: 700, color: '#0B1E4B' }}>
                    {getAmountDisplay(row.amountNum, data.id, row.subType)}
                  </span>
                </td>
                <td className="hidden md:table-cell" style={{ padding: 'clamp(8px,1.2vw,12px) clamp(10px,1.5vw,20px)' }}>
                  <div className="flex flex-wrap !gap-1">
                    {row.benefits.map((b, j) => (
                      <span key={j} style={{ fontSize: 'clamp(10px,1.1vw,11.5px)', color: '#64748b' }}>
                        {b}{j < row.benefits.length - 1 ? ' •' : ''}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Eligibility + Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(10px, 2vw, 20px)' }}>
        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(11,30,75,.06)]"
          style={{ padding: 'clamp(14px, 2vw, 24px)' }}>
          <h4 className="flex items-center !m-0 font-extrabold text-[#0B1E4B] uppercase tracking-wider"
            style={{ gap: 'clamp(6px,1vw,10px)', fontSize: 'clamp(10px,1.2vw,12.5px)', marginBottom: 'clamp(12px,1.5vw,20px)' }}>
            <div className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ width: 'clamp(22px,2.5vw,28px)', height: 'clamp(22px,2.5vw,28px)', background: data.accentLight }}>
              <FaCheckCircle style={{ color: ac, fontSize: 'clamp(9px,1vw,12px)' }} />
            </div>
            Eligibility
          </h4>
          <ul className="flex flex-col !m-0 !p-0 list-none" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
            {data.eligibility.map((item, i) => (
              <li key={i} className="flex items-start" style={{ gap: 'clamp(6px,1vw,10px)' }}>
                <div className="rounded-full flex-shrink-0 flex items-center justify-center !mt-0.5"
                  style={{ width: 'clamp(16px,1.8vw,20px)', height: 'clamp(16px,1.8vw,20px)', background: data.accentLight, minWidth: 16 }}>
                  <span style={{ fontSize: 'clamp(8px,.9vw,9px)', fontWeight: 800, color: ac }}>{i+1}</span>
                </div>
                <span className="text-slate-600 leading-[1.65]" style={{ fontSize: 'clamp(11.5px,1.3vw,13px)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-[16px] sm:rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(11,30,75,.06)]"
          style={{ padding: 'clamp(14px, 2vw, 24px)' }}>
          <h4 className="flex items-center !m-0 font-extrabold text-[#0B1E4B] uppercase tracking-wider"
            style={{ gap: 'clamp(6px,1vw,10px)', fontSize: 'clamp(10px,1.2vw,12.5px)', marginBottom: 'clamp(12px,1.5vw,20px)' }}>
            <div className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ width: 'clamp(22px,2.5vw,28px)', height: 'clamp(22px,2.5vw,28px)', background: data.accentLight }}>
              <FaFileAlt style={{ color: ac, fontSize: 'clamp(9px,1vw,12px)' }} />
            </div>
            Documents Required
          </h4>
          <ul className="flex flex-col !m-0 !p-0 list-none" style={{ gap: 'clamp(8px,1.2vw,12px)' }}>
            {data.documents.map((doc, i) => (
              <li key={i} className="flex items-start" style={{ gap: 'clamp(6px,1vw,10px)' }}>
                <div className="rounded-full flex-shrink-0 flex items-center justify-center !mt-0.5 bg-[#FFF3EC]"
                  style={{ width: 'clamp(16px,1.8vw,20px)', height: 'clamp(16px,1.8vw,20px)', minWidth: 16 }}>
                  <FaCheckCircle className="text-[#F05A1A]" style={{ fontSize: 'clamp(7px,.8vw,9px)' }} />
                </div>
                <span className="text-slate-600 leading-[1.65]" style={{ fontSize: 'clamp(11.5px,1.3vw,13px)' }}>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-between rounded-[16px] sm:rounded-[20px] border-2 border-dashed"
        style={{ gap: 'clamp(10px,2vw,20px)', padding: 'clamp(12px,2vw,20px) clamp(14px,2vw,24px)', borderColor: `${ac}35`, background: data.accentLight }}>
        <div>
          <p className="!m-0 font-extrabold text-[#0B1E4B]" style={{ fontSize: 'clamp(12px,1.5vw,14px)' }}>
            Ready to apply for {data.shortLabel} Membership?
          </p>
          <p className="!m-0 !mt-1 text-slate-500" style={{ fontSize: 'clamp(11px,1.2vw,12.5px)' }}>
            Fill the online query form and our team will respond within 48 hours.
          </p>
        </div>
        <button onClick={onFillOnline}
          className="flex items-center !gap-2 !rounded-xl text-white font-extrabold transition-all hover:shadow-lg hover:-translate-y-px whitespace-nowrap"
          style={{
            padding: 'clamp(8px,1.1vw,10px) clamp(14px,1.8vw,20px)',
            fontSize: 'clamp(11.5px,1.3vw,13px)',
            background: `linear-gradient(135deg,${ac},${ac}dd)`,
            boxShadow: `0 4px 14px ${ac}30`,
          }}>
          <HiArrowRight style={{ fontSize: 'clamp(13px,1.4vw,15px)' }} /> Fill Online
        </button>
      </div>

    </div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════════ */
export default function MembershipDetail() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()
  const activeTab    = PATH_TO_TAB[pathname] || 'individual'
  const [showForm, setShowForm] = useState(false)
  const tabData = MEMBERSHIP_DATA[activeTab]

  const handleTabChange = (tabId) => {
    setShowForm(false)
    navigate(TAB_TO_PATH[tabId])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F4F6FB] to-white">
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .35s ease both}

        .mem-tab-bar {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          gap: clamp(4px, 1vw, 8px);
          padding: clamp(4px, .8vw, 8px);
        }
        .mem-tab-bar::-webkit-scrollbar { display: none; }
        .mem-tab-btn {
          flex-shrink: 0;
          white-space: nowrap;
        }
      `}</style>

      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: 'clamp(14px,3vw,40px) clamp(12px,3vw,32px)',
      }}>

        {/* ── TAB BAR ── */}
        <div
          className="mem-tab-bar bg-white w-fit rounded-[14px] sm:rounded-[18px] border border-slate-200 shadow-[0_4px_20px_rgba(11,30,75,.07)]"
          style={{ marginBottom: 'clamp(14px,2.5vw,32px)' }}
        >
          {TABS.map(tab => {
            const m      = MEMBERSHIP_DATA[tab.id]
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                className="mem-tab-btn flex items-center justify-center rounded-[10px] sm:rounded-[13px] font-extrabold cursor-pointer transition-all duration-200"
                style={{
                  gap: 'clamp(6px,1vw,10px)',
                  padding: 'clamp(7px,1.1vw,12px) clamp(10px,1.8vw,18px)',
                  fontSize: 'clamp(11px,1.2vw,13px)',
                  ...(active
                    ? { background: `linear-gradient(135deg,${m.accentColor},${m.accentColor}cc)`, color: '#fff', boxShadow: `0 4px 14px ${m.accentColor}35` }
                    : { background: 'transparent', color: '#64748b' }
                  ),
                }}
                onClick={() => handleTabChange(tab.id)}
              >
                <tab.Icon style={{ fontSize: 'clamp(12px,1.4vw,15px)', opacity: active ? 0.9 : 0.6 }} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* ── TAB HEADING ── */}
        <div className="flex items-center fade-up" key={activeTab + 'h'}
          style={{ gap: 'clamp(8px,1.5vw,14px)', marginBottom: 'clamp(12px,2vw,28px)' }}>
          <div className="rounded-[10px] sm:rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ width: 'clamp(32px,4vw,40px)', height: 'clamp(32px,4vw,40px)', background: tabData.accentLight }}>
            <tabData.Icon style={{ color: tabData.accentColor, fontSize: 'clamp(13px,1.8vw,17px)' }} />
          </div>
          <div>
            <h2 className="!m-0 font-extrabold text-[#0B1E4B] leading-tight"
              style={{ fontSize: 'clamp(15px,2.5vw,22px)' }}>
              {tabData.label}
            </h2>
            <p className="!m-0 text-slate-400" style={{ fontSize: 'clamp(10.5px,1.1vw,12.5px)' }}>
              {tabData.tagline}
            </p>
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="fade-up" key={activeTab + 'c'}>
          <TabContent data={tabData} onFillOnline={() => setShowForm(true)} />
        </div>

      </div>

      {showForm && <QueryFormModal tabData={tabData} onClose={() => setShowForm(false)} />}
    </div>
  )
}