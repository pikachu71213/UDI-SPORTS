import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBuilding } from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'
import { getPublicGeneralMembers, getPublicSpecialMembers } from '../../../../shared/services/publicApi'

/* ═══════════════════════════════════════════
   STATIC FALLBACK (general members only — API error)
═══════════════════════════════════════════ */
const GENERAL_STATIC_DATA = {
  individual: [
    { id: 1,  name: 'Arjun Sharma',          company: 'Sharma & Sons Pvt Ltd' },
    { id: 2,  name: 'Priya Singh',           company: 'Singh Enterprises' },
    { id: 3,  name: 'Rahul Verma',           company: 'Verma Industries' },
    { id: 4,  name: 'Neha Gupta',            company: 'Gupta Traders' },
    { id: 5,  name: 'Amit Kumar',            company: 'Kumar Associates' },
    { id: 6,  name: 'Sunita Yadav',          company: 'Yadav Foundation' },
    { id: 7,  name: 'Vikram Mehta',          company: 'Mehta Constructions' },
    { id: 8,  name: 'Kavita Reddy',          company: 'Reddy Exports' },
    { id: 9,  name: 'Mohit Srivastava',      company: 'Srivastava Group' },
    { id: 10, name: 'Aarti Bhatt',           company: 'Bhatt Enterprises' },
    { id: 11, name: 'Sandeep Tomar',         company: 'Tomar Agro' },
    { id: 12, name: 'Reema Jain',            company: 'Jain Jewellers' },
  ],
  players: [
    { id: 1,  name: 'Rohit Patel',           company: 'Rajasthan Athletics Club' },
    { id: 2,  name: 'Anjali Tiwari',         company: 'Delhi Sports Academy' },
    { id: 3,  name: 'Suresh Nair',           company: 'Kerala Sports Federation' },
    { id: 4,  name: 'Pooja Joshi',           company: 'Maharashtra Athletics' },
    { id: 5,  name: 'Deepak Chauhan',        company: 'Punjab Sports Council' },
    { id: 6,  name: 'Ritu Agarwal',          company: 'UP Sports Academy' },
    { id: 7,  name: 'Manoj Dubey',           company: 'MP Athletics Club' },
    { id: 8,  name: 'Simran Dhaliwal',       company: 'Haryana Sports Board' },
    { id: 9,  name: 'Yusuf Khan',            company: 'J&K Sports Federation' },
    { id: 10, name: 'Nalini Rao',            company: 'Karnataka Athletics' },
  ],
}

/* ═══════════════════════════════════════════
   SPECIAL TABS CONFIG
═══════════════════════════════════════════ */
const SPECIAL_TABS = [
  {
    key: 'diamond',
    label: 'Diamond',
    emoji: '💎',
    desc: 'Our most prestigious patrons with the highest level of contribution to sports.',
    tagLabel: 'Diamond Member',
    activeBg: 'linear-gradient(135deg,#e0f2ff,#bfdbfe)',
    activeBorder: '#3b82f6',
    activeColor: '#1d4ed8',
    activeShadow: '0 6px 28px rgba(59,130,246,0.28)',
    accentColor: '#1e40af',
    accentLight: '#eff6ff',
    accentBorder: 'rgba(59,130,246,0.22)',
    accentGlow: 'rgba(59,130,246,0.13)',
    ringFrom: '#93c5fd', ringTo: '#3b82f6',
    badgeBg: '#dbeafe', badgeColor: '#1e40af', badgeBorder: 'rgba(30,64,175,0.22)',
    stripFrom: '#3b82f6', stripTo: '#93c5fd',
    cardGradTop: 'linear-gradient(160deg,#dbeafe 0%,#eff6ff 60%,#fff 100%)',
  },
  {
    key: 'gold',
    label: 'Gold',
    emoji: '🥇',
    desc: 'Gold patrons who significantly support our national sports initiatives.',
    tagLabel: 'Gold Member',
    activeBg: 'linear-gradient(135deg,#fef9c3,#fef08a)',
    activeBorder: '#eab308',
    activeColor: '#854d0e',
    activeShadow: '0 6px 28px rgba(234,179,8,0.28)',
    accentColor: '#a16207',
    accentLight: '#fefce8',
    accentBorder: 'rgba(234,179,8,0.25)',
    accentGlow: 'rgba(234,179,8,0.13)',
    ringFrom: '#fde047', ringTo: '#eab308',
    badgeBg: '#fef9c3', badgeColor: '#854d0e', badgeBorder: 'rgba(133,77,14,0.22)',
    stripFrom: '#eab308', stripTo: '#fde047',
    cardGradTop: 'linear-gradient(160deg,#fef9c3 0%,#fefce8 60%,#fff 100%)',
  },
  {
    key: 'silver',
    label: 'Silver',
    emoji: '🥈',
    desc: 'Silver members who actively contribute to our growing sports community.',
    tagLabel: 'Silver Member',
    activeBg: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
    activeBorder: '#94a3b8',
    activeColor: '#334155',
    activeShadow: '0 6px 28px rgba(100,116,139,0.22)',
    accentColor: '#475569',
    accentLight: '#f8fafc',
    accentBorder: 'rgba(148,163,184,0.3)',
    accentGlow: 'rgba(148,163,184,0.12)',
    ringFrom: '#cbd5e1', ringTo: '#94a3b8',
    badgeBg: '#f1f5f9', badgeColor: '#334155', badgeBorder: 'rgba(51,65,85,0.18)',
    stripFrom: '#94a3b8', stripTo: '#cbd5e1',
    cardGradTop: 'linear-gradient(160deg,#e2e8f0 0%,#f8fafc 60%,#fff 100%)',
  },
  {
    key: 'dignitaries',
    label: 'Dignitaries',
    emoji: '👑',
    desc: 'Eminent personalities, officials and leaders who grace our organization.',
    tagLabel: 'Dignitary',
    activeBg: 'linear-gradient(135deg,#fdf4ff,#f3e8ff)',
    activeBorder: '#a855f7',
    activeColor: '#6b21a8',
    activeShadow: '0 6px 28px rgba(168,85,247,0.28)',
    accentColor: '#7e22ce',
    accentLight: '#fdf4ff',
    accentBorder: 'rgba(168,85,247,0.22)',
    accentGlow: 'rgba(168,85,247,0.13)',
    ringFrom: '#d8b4fe', ringTo: '#a855f7',
    badgeBg: '#f3e8ff', badgeColor: '#6b21a8', badgeBorder: 'rgba(107,33,168,0.22)',
    stripFrom: '#a855f7', stripTo: '#d8b4fe',
    cardGradTop: 'linear-gradient(160deg,#f3e8ff 0%,#fdf4ff 60%,#fff 100%)',
  },
  {
    // ── NEW: Celebrity ────────────────────────────────────────────────────────
    key: 'celebrity',
    label: 'Celebrity',
    emoji: '🌟',
    desc: 'Famous personalities from sports, entertainment and media who support UDIISA.',
    tagLabel: 'Celebrity Member',
    activeBg: 'linear-gradient(135deg,#fdf2f8,#fce7f3)',
    activeBorder: '#ec4899',
    activeColor: '#831843',
    activeShadow: '0 6px 28px rgba(236,72,153,0.28)',
    accentColor: '#9d174d',
    accentLight: '#fdf2f8',
    accentBorder: 'rgba(236,72,153,0.22)',
    accentGlow: 'rgba(236,72,153,0.13)',
    ringFrom: '#f9a8d4', ringTo: '#ec4899',
    badgeBg: '#fce7f3', badgeColor: '#831843', badgeBorder: 'rgba(131,24,67,0.22)',
    stripFrom: '#ec4899', stripTo: '#f9a8d4',
    cardGradTop: 'linear-gradient(160deg,#fce7f3 0%,#fdf2f8 60%,#fff 100%)',
  },
  {
    key: 'corporate',
    label: 'Corporate Members',
    emoji: '🏢',
    desc: 'Corporate bodies and organizations registered as institutional members.',
    tagLabel: 'Corporate Member',
    activeBg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)',
    activeBorder: '#10b981',
    activeColor: '#064e3b',
    activeShadow: '0 6px 28px rgba(16,185,129,0.25)',
    accentColor: '#065f46',
    accentLight: '#ecfdf5',
    accentBorder: 'rgba(16,185,129,0.22)',
    accentGlow: 'rgba(16,185,129,0.12)',
    ringFrom: '#6ee7b7', ringTo: '#10b981',
    badgeBg: '#d1fae5', badgeColor: '#064e3b', badgeBorder: 'rgba(6,78,59,0.2)',
    stripFrom: '#10b981', stripTo: '#6ee7b7',
    cardGradTop: 'linear-gradient(160deg,#d1fae5 0%,#ecfdf5 60%,#fff 100%)',
  },
]

const TAB_ROUTES = {
  diamond:     '/members/special-members/diamond',
  gold:        '/members/special-members/gold',
  silver:      '/members/special-members/silver',
  dignitaries: '/members/special-members/dignitaries',
  celebrity:   '/members/special-members/celebrity',
  corporate:   '/members/special-members/corporate',
}
const VALID_KEYS = Object.keys(TAB_ROUTES)
const EMPTY_SPECIAL_BY_TAB = Object.fromEntries(VALID_KEYS.map((k) => [k, []]))
const PAGE_SIZE = 6

// Backend SpecialMember.membershipCategory values → Members page tab slug
const BACKEND_CATEGORY_TO_TAB = {
  diamond: 'diamond',
  gold: 'gold',
  silver: 'silver',
  dignitaries: 'dignitaries',
  dignitary: 'dignitaries',
  celebrity: 'celebrity',
  'body corporate': 'corporate',
  corporate: 'corporate',
}
// Loose substring fallbacks (legacy / free text)
const CATEGORY_SUBSTRING_TO_TAB = [
  ['body corporate', 'corporate'],
  ['dignitar', 'dignitaries'],
  ['celebrit', 'celebrity'],
  ['diamond', 'diamond'],
  ['gold', 'gold'],
  ['silver', 'silver'],
  ['corporate', 'corporate'],
]
function normalizeCategoryToTab(cat) {
  if (!cat) return 'silver'
  const key = String(cat).trim().toLowerCase()
  if (BACKEND_CATEGORY_TO_TAB[key]) return BACKEND_CATEGORY_TO_TAB[key]
  for (const [needle, tab] of CATEGORY_SUBSTRING_TO_TAB) {
    if (key.includes(needle)) return tab
  }
  return 'silver'
}

/* ═══════════════════════════════════════════
   GLOBAL KEYFRAME STYLES
═══════════════════════════════════════════ */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  * { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes shimmer {
    0%   { background-position: -500px 0; }
    100% { background-position: 500px 0; }
  }
  @keyframes gradShift {
    0%,100% { background-position: 0% 50%; }
    50%     { background-position: 100% 50%; }
  }
  @keyframes cardShine {
    0%   { transform: translateX(-150%) skewX(-15deg); }
    100% { transform: translateX(350%)  skewX(-15deg); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes floatAvatar {
    0%,100% { transform:translateY(0); }
    50%     { transform:translateY(-5px); }
  }
  @keyframes stripGrad {
    0%,100% { background-position:0% 50%; }
    50%     { background-position:100% 50%; }
  }
  @keyframes tabIn {
    from { opacity:0; transform:translateY(10px) scale(.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .shimmer-bg {
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 37%, #f0f0f0 63%);
    background-size: 1000px 100%;
    animation: shimmer 1.4s infinite linear;
  }
  .card-shine-overlay {
    position:absolute; inset:0; pointer-events:none; z-index:20;
    background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);
    transform:translateX(-150%) skewX(-15deg);
  }
  .pmcard:hover .card-shine-overlay { animation:cardShine .8s ease forwards; }
  .pmcard:hover .avatar-wrap         { animation:floatAvatar 3s ease-in-out infinite; }
  .pmcard:hover .bottom-bar          { transform:scaleX(1) !important; }

  .strip-anim {
    background-size:200% 100%;
    animation:stripGrad 3s ease infinite;
  }
  .ring-anim {
    background-size:200% 200%;
    animation:gradShift 4s ease infinite;
  }

  .tab-content { animation:tabIn .3s ease both; }

  .tabs-scroll::-webkit-scrollbar { display:none; }
  .tabs-scroll { scrollbar-width:none; }

  .gm-row:hover { background:#FFF6F0 !important; }
  .gm-row:hover .gm-sr { color:#F05A1A !important; }

  .gen-tab-btn::after {
    content:''; position:absolute; bottom:-2px; left:0; right:0;
    height:3px; border-radius:3px 3px 0 0;
    background:linear-gradient(90deg,#F05A1A,#FF7D42);
    transform:scaleX(0); transition:transform .25s ease;
  }
  .gen-tab-btn.active::after { transform:scaleX(1); }

  .dot-bg {
    background-image:radial-gradient(circle,rgba(11,30,75,.06) 1px,transparent 1px);
    background-size:28px 28px;
  }
  .spinner {
    width:28px; height:28px; border-radius:50%;
    border:3px solid #e2e8f0;
    border-top-color:#F05A1A;
    animation:spin .7s linear infinite;
  }
`

/* ═══════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════ */
const SkeletonCard = () => (
  <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">
    <div className="h-1 shimmer-bg" />
    <div className="flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6 gap-3 sm:gap-4">
      <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shimmer-bg" style={{ paddingTop: '100%' }} />
      <div className="shimmer-bg h-4 rounded-full w-3/4" />
      <div className="shimmer-bg h-3 rounded-full w-1/2" />
      <div className="flex-1 w-full" style={{ minHeight: 12 }} />
      <div className="shimmer-bg h-7 rounded-full w-28 mt-2" />
    </div>
  </div>
)

/* ═══════════════════════════════════════════
   SKELETON ROW
═══════════════════════════════════════════ */
const SkeletonRow = ({ i }) => (
  <div
    className="grid gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4"
    style={{ gridTemplateColumns: '40px 1fr 1fr', background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f1f5f9' }}
  >
    <div className="shimmer-bg h-3 rounded-full w-6" />
    <div className="shimmer-bg h-4 rounded-full w-4/5" />
    <div className="shimmer-bg h-3 rounded-full w-3/5" />
  </div>
)

/* ═══════════════════════════════════════════
   PREMIUM MEMBER CARD
═══════════════════════════════════════════ */
const PremiumMemberCard = ({ member, theme, idx }) => (
  <div
    className="pmcard relative flex flex-col items-center text-center bg-white rounded-2xl sm:rounded-3xl overflow-hidden"
    style={{
      border: `1.5px solid ${theme.accentBorder}`,
      boxShadow: `0 8px 32px ${theme.accentGlow}, 0 2px 10px rgba(11,30,75,.07)`,
      animation: `fadeUp .45s ease both`,
      animationDelay: `${idx * 0.06}s`,
      minHeight: 340,
      transition: 'transform .4s cubic-bezier(.34,1.18,.64,1), box-shadow .4s ease',
    }}
  >
    <div className="card-shine-overlay" />
    <div className="absolute top-0 left-0 right-0 z-0" style={{ height: 200, background: theme.cardGradTop }} />
    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none z-0"
      style={{ background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)` }} />
    <div className="absolute top-4 -left-5 w-20 h-20 rounded-full pointer-events-none z-0"
      style={{ background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)` }} />
    <div className="absolute top-0 left-0 right-0 strip-anim z-10" style={{
      height: 4,
      background: `linear-gradient(90deg, ${theme.stripFrom}, ${theme.stripTo}, ${theme.stripFrom})`,
    }} />

    {/* Celebrity sparkle dots */}
    {theme.key === 'celebrity' && (
      <>
        <div className="absolute top-3 right-6 text-[10px] pointer-events-none z-10 opacity-60">⭐</div>
        <div className="absolute top-8 right-3 text-[8px] pointer-events-none z-10 opacity-40">✨</div>
        <div className="absolute top-5 left-5 text-[8px] pointer-events-none z-10 opacity-40">⭐</div>
      </>
    )}

    <div className="relative z-10 flex flex-col items-center w-full flex-1 px-3 sm:px-4 pt-4 sm:pt-5 pb-4 sm:pb-5">
      <div className="avatar-wrap relative mb-3 sm:mb-4 w-full">
        <div className="ring-anim rounded-2xl sm:rounded-3xl p-[3px]" style={{
          background: `linear-gradient(135deg, ${theme.ringFrom}, ${theme.ringTo}, ${theme.ringFrom})`,
          boxShadow: `0 10px 36px ${theme.accentGlow}`,
        }}>
          <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white" style={{
            paddingTop: '100%', background: theme.accentLight,
          }}>
            <img
              src={member.img || member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || '')}&background=F05A1A&color=fff&size=400&bold=true&length=2`}
              alt={member.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-top block"
              onError={e => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || '')}&background=${(theme.ringTo || '#F05A1A').replace('#', '')}&color=fff&size=400&bold=true&length=2`
              }}
            />
          </div>
        </div>
        <div
          className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl border-2 border-white flex items-center justify-center z-10"
          style={{
            background: `linear-gradient(135deg, ${theme.ringFrom}, ${theme.ringTo})`,
            fontSize: theme.key === 'celebrity' ? 13 : 14,
            boxShadow: `0 4px 12px ${theme.accentGlow}`,
          }}
        >
          {theme.key === 'celebrity' ? '⭐' : theme.emoji}
        </div>
      </div>

      <h3 className="m-0 mb-1 text-sm sm:text-base font-black text-[#0B1E4B] leading-tight tracking-tight line-clamp-2">
        {member.name}
      </h3>
      {(member.company || member.organization) && (
        <p className="m-0 mb-3 sm:mb-4 text-[10px] sm:text-xs font-medium text-slate-400 flex items-center justify-center gap-1 overflow-hidden max-w-full">
          <FaBuilding className="shrink-0 text-slate-300" style={{ fontSize: 8 }} />
          <span className="truncate">{member.company || member.organization}</span>
        </p>
      )}
      <div className="flex-1" />
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-auto text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest"
        style={{
          background: theme.badgeBg,
          border: `1.5px solid ${theme.badgeBorder}`,
          color: theme.badgeColor,
          letterSpacing: '1.6px',
        }}
      >
        {theme.key === 'celebrity'
          ? <span style={{ fontSize: 11 }}>🌟</span>
          : <MdVerified style={{ fontSize: 11 }} />
        }
        {theme.tagLabel}
      </span>
    </div>

    <div className="bottom-bar absolute bottom-0 left-0 right-0 z-10" style={{
      height: 4,
      background: `linear-gradient(90deg, ${theme.stripFrom}, ${theme.stripTo})`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform .35s ease',
    }} />
  </div>
)

/* ═══════════════════════════════════════════
   SPECIAL TAB BUTTON
═══════════════════════════════════════════ */
const SpecialTabBtn = ({ tab, isActive, onClick, count }) => (
  <button
    className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-[12.5px] font-extrabold cursor-pointer whitespace-nowrap shrink-0 overflow-hidden border transition-all duration-300"
    onClick={onClick}
    style={{
      background: isActive ? tab.activeBg : '#fff',
      borderColor: isActive ? tab.activeBorder : '#e2e8f0',
      color: isActive ? tab.activeColor : '#64748b',
      boxShadow: isActive ? tab.activeShadow : '0 2px 10px rgba(11,30,75,.06)',
    }}
  >
    {isActive && (
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%)',
          animation: 'cardShine 2.8s ease-in-out infinite',
          zIndex: 0,
        }} />
    )}
    <span className="relative z-10 text-base sm:text-lg">{tab.emoji}</span>
    <span className="relative z-10 font-extrabold">{tab.label}</span>
   
  </button>
)

/* ═══════════════════════════════════════════
   SIMULATE ASYNC LOAD
═══════════════════════════════════════════ */
const simulateLoad = (data, page, pageSize) =>
  new Promise(res => setTimeout(() => {
    const slice = data.slice(0, page * pageSize)
    res({ items: slice, hasMore: slice.length < data.length })
  }, 800))

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const MembersData = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isSpecialPage = location.pathname.includes('/special-members')
  const isGeneralPage = location.pathname.includes('/general-members')

  const specialSub = (() => {
    const seg = location.pathname.split('/').pop()
    return VALID_KEYS.includes(seg) ? seg : 'diamond'
  })()

  const [specialMembersByTab, setSpecialMembersByTab] = useState(null)
  const [generalSub, setGeneralSub] = useState('individual')
  const [generalMembersData, setGeneralMembersData] = useState(null)

  const [visibleCards, setVisibleCards]     = useState([])
  const [cardPage, setCardPage]             = useState(1)
  const [hasMoreCards, setHasMoreCards]     = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore]       = useState(false)

  const [visibleRows, setVisibleRows]         = useState([])
  const [rowPage, setRowPage]                 = useState(1)
  const [hasMoreRows, setHasMoreRows]         = useState(true)
  const [tableLoading, setTableLoading]       = useState(true)
  const [loadingMoreRows, setLoadingMoreRows] = useState(false)

  // ── Fetch special members (always from API; no demo static list) ──
  useEffect(() => {
    if (!isSpecialPage) return
    let cancelled = false
    setSpecialMembersByTab(null)
    getPublicSpecialMembers()
      .then((list) => {
        if (cancelled) return
        const arr = Array.isArray(list) ? list : []
        const byTab = { diamond: [], gold: [], silver: [], dignitaries: [], celebrity: [], corporate: [] }
        arr.forEach((m) => {
          const tab = normalizeCategoryToTab(m.membershipCategory || m.membershipType)
          if (byTab[tab]) {
            byTab[tab].push({
              id:      m.id,
              name:    m.name,
              company: m.companyName || m.company || '',
              img:     m.img || m.photo || null,
            })
          }
        })
        setSpecialMembersByTab(byTab)
      })
      .catch(() => {
        if (!cancelled) setSpecialMembersByTab({ ...EMPTY_SPECIAL_BY_TAB })
      })
    return () => { cancelled = true }
  }, [isSpecialPage])

  const specialDataSource = specialMembersByTab != null
    ? Object.fromEntries(VALID_KEYS.map(k => [k, specialMembersByTab[k] || []]))
    : EMPTY_SPECIAL_BY_TAB

  // ── Load cards on tab / source change ──
  useEffect(() => {
    if (!isSpecialPage) return
    if (specialMembersByTab === null) {
      setInitialLoading(true)
      setVisibleCards([])
      return
    }
    setInitialLoading(true)
    setVisibleCards([])
    setCardPage(1)
    setHasMoreCards(true)
    const allData = specialDataSource[specialSub] || []
    simulateLoad(allData, 1, PAGE_SIZE).then(({ items, hasMore }) => {
      setVisibleCards(items)
      setHasMoreCards(hasMore)
      setInitialLoading(false)
    })
  }, [specialSub, isSpecialPage, specialMembersByTab])

  const loadMoreCards = useCallback(() => {
    if (loadingMore || !hasMoreCards || specialMembersByTab === null) return
    setLoadingMore(true)
    const allData = specialMembersByTab[specialSub] || []
    const nextPage = cardPage + 1
    simulateLoad(allData, nextPage, PAGE_SIZE).then(({ items, hasMore }) => {
      setVisibleCards(items)
      setHasMoreCards(hasMore)
      setCardPage(nextPage)
      setLoadingMore(false)
    })
  }, [loadingMore, hasMoreCards, specialSub, cardPage, specialMembersByTab])

  // ── Fetch general members ──
  useEffect(() => {
    if (!isGeneralPage) return
    setTableLoading(true)
    Promise.all([
      getPublicGeneralMembers('individual'),
      getPublicGeneralMembers('players'),
    ])
      .then(([individual, players]) => {
        setGeneralMembersData({
          individual: Array.isArray(individual) ? individual : [],
          players:    Array.isArray(players)    ? players    : [],
        })
      })
      .catch(() => {
        setGeneralMembersData({
          individual: GENERAL_STATIC_DATA.individual,
          players:    GENERAL_STATIC_DATA.players,
        })
      })
      .finally(() => setTableLoading(false))
  }, [isGeneralPage])

  useEffect(() => {
    if (!isGeneralPage || generalMembersData === null) return
    const allData = generalMembersData[generalSub] || []
    const slice = allData.slice(0, PAGE_SIZE)
    setVisibleRows(slice)
    setRowPage(1)
    setHasMoreRows(slice.length < allData.length)
  }, [isGeneralPage, generalSub, generalMembersData])

  const loadMoreRows = useCallback(() => {
    if (loadingMoreRows || !hasMoreRows || generalMembersData === null) return
    setLoadingMoreRows(true)
    const allData = generalMembersData[generalSub] || []
    const nextPage = rowPage + 1
    simulateLoad(allData, nextPage, PAGE_SIZE).then(({ items, hasMore }) => {
      setVisibleRows(items)
      setHasMoreRows(hasMore)
      setRowPage(nextPage)
      setLoadingMoreRows(false)
    })
  }, [loadingMoreRows, hasMoreRows, generalSub, rowPage, generalMembersData])

  // ── Redirect if invalid sub-route ──
  useEffect(() => {
    if (isSpecialPage && !VALID_KEYS.includes(location.pathname.split('/').pop())) {
      navigate(TAB_ROUTES.diamond, { replace: true })
    }
  }, [])

  const switchSpecialTab = (key) => navigate(TAB_ROUTES[key])
  const currentTheme = SPECIAL_TABS.find(t => t.key === specialSub)

  return (
    <div className="min-h-screen bg-[#F4F6FB] relative">
      <style>{GLOBAL_STYLES}</style>

      <div className="dot-bg fixed inset-0 pointer-events-none opacity-60 z-0" />

      <div className="max-w-screen-xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-6 relative z-10">

        {/* ════════════════════
            SPECIAL MEMBERS PAGE
        ════════════════════ */}
        {isSpecialPage && (
          <div className="tab-content">

            {/* Sub-tabs */}
            <div className="tabs-scroll flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 mb-5 sm:mb-7">
              {SPECIAL_TABS.map(tab => (
                <SpecialTabBtn
                  key={tab.key}
                  tab={tab}
                  isActive={specialSub === tab.key}
                  onClick={() => switchSpecialTab(tab.key)}
                  count={(specialDataSource[tab.key] || []).length}
                />
              ))}
            </div>

            {/* Banner */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl mb-5 sm:mb-7 border transition-all duration-300"
              style={{
                background: `linear-gradient(90deg, ${currentTheme.accentLight}, rgba(255,255,255,0))`,
                borderColor: currentTheme.accentBorder,
              }}
            >
              <span className="text-lg sm:text-xl shrink-0">{currentTheme.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-extrabold mb-0.5" style={{ color: currentTheme.accentColor }}>
                  {currentTheme.label} Members
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-snug">
                  {currentTheme.desc}
                </div>
              </div>
             
            </div>

            {/* Cards grid */}
            {specialMembersByTab === null || initialLoading ? (
              <div className="grid gap-3 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : visibleCards.length === 0 ? (
              <div className="py-16 sm:py-20 text-center">
                <div className="text-4xl mb-3">{currentTheme.emoji}</div>
                <div className="text-slate-400 text-sm font-semibold">No {currentTheme.label} members found.</div>
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {visibleCards.map((m, i) => (
                    <PremiumMemberCard key={m.id} member={m} theme={currentTheme} idx={i} />
                  ))}
                </div>

                {loadingMore && (
                  <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-3 sm:mt-5">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                  </div>
                )}

                {hasMoreCards && !loadingMore && (
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <button
                      onClick={loadMoreCards}
                      className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.stripFrom}, ${currentTheme.stripTo})`,
                        boxShadow: `0 6px 20px ${currentTheme.accentGlow}`,
                      }}
                    >
                      <span>Load More Members</span>
                      <span className="opacity-75">↓</span>
                    </button>
                  </div>
                )}

                {!hasMoreCards && visibleCards.length > 0 && (
                  <div className="flex items-center gap-3 justify-center mt-6 sm:mt-8">
                    <div className="flex-1 h-px bg-slate-200 max-w-24" />
                    <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">All members loaded</span>
                    <div className="flex-1 h-px bg-slate-200 max-w-24" />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ════════════════════
            GENERAL MEMBERS PAGE
        ════════════════════ */}
        {isGeneralPage && (
          <div className="tab-content">

            <div className="flex items-center border-b-2 border-slate-200 mb-4 sm:mb-5">
              {[
                { key: 'individual', label: 'General Members',    count: generalMembersData?.individual?.length ?? 0 },
                { key: 'players',    label: 'Sports Participants', count: generalMembersData?.players?.length    ?? 0 },
              ].map(st => (
                <button
                  key={st.key}
                  className={`gen-tab-btn relative flex items-center gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 pt-2 px-3 sm:px-5 text-xs sm:text-sm font-semibold cursor-pointer bg-transparent border-none transition-colors duration-200 -mb-0.5 ${generalSub === st.key ? 'text-[#0B1E4B] font-extrabold active' : 'text-slate-500'}`}
                  style={{ borderBottom: generalSub === st.key ? '3px solid #F05A1A' : '3px solid transparent' }}
                  onClick={() => setGeneralSub(st.key)}
                >
                  {st.label}
                  <span className={`inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[9px] sm:text-[10px] font-extrabold ${generalSub === st.key ? 'bg-[#F05A1A] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {st.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <div className="grid gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3"
                style={{
                  gridTemplateColumns: '40px 1fr 1fr',
                  background: 'linear-gradient(90deg,#0B1E4B,#1e3a8a)',
                }}>
                {['SR.', 'NAME', 'COMPANY / ORGANIZATION'].map(h => (
                  <div key={h} className="text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase text-white/60">
                    {h}
                  </div>
                ))}
              </div>

              {tableLoading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} i={i} />)
              ) : visibleRows.length === 0 ? (
                <div className="py-7 text-center text-slate-400 text-sm bg-white">No members available.</div>
              ) : (
                <>
                  {visibleRows.map((m, i) => (
                    <div
                      key={m.id}
                      className="gm-row grid gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3.5 transition-colors duration-150"
                      style={{
                        gridTemplateColumns: '40px 1fr 1fr',
                        background: i % 2 === 0 ? '#fff' : '#f9fafb',
                        borderBottom: i < visibleRows.length - 1 ? '1px solid #f1f5f9' : 'none',
                      }}
                    >
                      <div className="gm-sr text-[11px] sm:text-xs font-bold text-slate-300 transition-colors duration-150">{i + 1}</div>
                      <div className="text-xs sm:text-sm font-bold text-[#0B1E4B] truncate">{m.name}</div>
                      <div className="text-[11px] sm:text-xs text-slate-500 truncate">{m.company || m.organization || '-'}</div>
                    </div>
                  ))}
                  {loadingMoreRows && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} i={visibleRows.length + i} />)}
                </>
              )}
            </div>

            {!tableLoading && hasMoreRows && !loadingMoreRows && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <button
                  onClick={loadMoreRows}
                  className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-[#0B1E4B] hover:bg-[#1e3a8a] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  <span>Load More</span>
                  <span className="opacity-75">↓</span>
                </button>
              </div>
            )}

            {!tableLoading && !hasMoreRows && visibleRows.length > 0 && (
              <div className="flex items-center gap-3 justify-center mt-4 sm:mt-6">
                <div className="flex-1 h-px bg-slate-200 max-w-24" />
                <span className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wider uppercase">All members loaded</span>
                <div className="flex-1 h-px bg-slate-200 max-w-24" />
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default MembersData