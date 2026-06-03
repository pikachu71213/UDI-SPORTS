// admin/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import {
  MdPeople, MdStar, MdSportsCricket,
  MdArticle, MdEmail, MdTrendingUp,
} from 'react-icons/md'
import { FaArrowUp } from 'react-icons/fa'
import Spinner from '../components/Spinner'
import memberService from '../services/memberService'
import { useAdminToast } from '../hooks/ToastContext'

const DEFAULT_SUMMARY = {
  totalMembers: 0,
  totalSpecial: 0,
  totalPlayers: 0,
  totalBlogs: 0,
  incomingMembers: 0,
  incomingContacts: 0,
}

const CARDS = (d) => [
  {
    label: 'Total Members',
    value: d.totalMembers,
    icon:  <MdPeople className="text-[22px]" />,
    color: 'from-[#0B1E4B] to-[#152B6B]',
    badge: 'bg-white/15 text-white',
    trend: '+12 this month',
  },
  {
    label: 'Special Members',
    value: d.totalSpecial,
    icon:  <MdStar className="text-[22px]" />,
    color: 'from-[#F05A1A] to-[#FF7D42]',
    badge: 'bg-white/15 text-white',
    trend: '+5 this month',
  },
  {
    label: 'Talented Players',
    value: d.totalPlayers,
    icon:  <MdSportsCricket className="text-[22px]" />,
    color: 'from-[#1565C0] to-[#1976D2]',
    badge: 'bg-white/15 text-white',
    trend: '+8 this month',
  },
  {
    label: 'Total Blogs',
    value: d.totalBlogs,
    icon:  <MdArticle className="text-[22px]" />,
    color: 'from-[#1a6b3a] to-[#2e7d52]',
    badge: 'bg-white/15 text-white',
    trend: '+3 this week',
  },
  {
    label: 'Incoming Members',
    value: d.incomingMembers,
    icon:  <MdTrendingUp className="text-[22px]" />,
    color: 'from-[#6a1b9a] to-[#7b1fa2]',
    badge: 'bg-white/15 text-white',
    trend: 'Pending review',
  },
  {
    label: 'Contact Forms',
    value: d.incomingContacts,
    icon:  <MdEmail className="text-[22px]" />,
    color: 'from-[#c62828] to-[#d32f2f]',
    badge: 'bg-white/15 text-white',
    trend: 'Pending reply',
  },
]

function StatCard({ card, idx }) {
  return (
    <div className={`
      relative overflow-hidden rounded-[18px]
      bg-gradient-to-br ${card.color}
      p-[22px] flex flex-col gap-[12px]
      shadow-[0_8px_28px_rgba(0,0,0,0.12)]
      hover:-translate-y-[3px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.18)]
      transition-all duration-300
      animate-[fadeUp_0.4s_ease_both]
    `}
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Bg circle */}
      <div className="absolute -right-[20px] -top-[20px] w-[90px] h-[90px] rounded-full bg-white/10" />

      {/* Icon */}
      <div className="w-[44px] h-[44px] rounded-[12px] bg-white/20 flex items-center justify-center text-white">
        {card.icon}
      </div>

      {/* Value */}
      <div>
        <p className="text-white/60 text-[11px] font-bold uppercase tracking-[1.2px] m-0">{card.label}</p>
        <p className="text-white text-[34px] font-extrabold m-0 leading-none mt-[4px]">{card.value}</p>
      </div>

      {/* Trend */}
      <div className={`inline-flex items-center gap-[5px] ${card.badge} rounded-full px-[10px] py-[4px] self-start text-[11px] font-bold`}>
        <FaArrowUp className="text-[9px]" />
        {card.trend}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useAdminToast()

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await memberService.getSummary()
        setSummary({
          totalMembers: data?.totalMembers ?? 0,
          totalSpecial: data?.totalSpecial ?? 0,
          totalPlayers: data?.totalPlayers ?? 0,
          totalBlogs: data?.totalBlogs ?? 0,
          incomingMembers: data?.incomingMembers ?? 0,
          incomingContacts: data?.incomingContacts ?? 0,
        })
      } catch {
        toast.error('Failed to load dashboard data')
        setSummary(DEFAULT_SUMMARY)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [toast])

  if (loading) return <Spinner center size="lg" />

  const cards = CARDS(summary)

  return (
    <div>
      {/* Welcome banner */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#0B1E4B] to-[#1e3a8a] p-[24px] mb-[28px] flex items-center justify-between flex-wrap gap-[16px] overflow-hidden relative">
        <div className="absolute right-0 top-0 w-[200px] h-[200px] rounded-full bg-[rgba(240,90,26,0.12)] -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <h2 className="text-white text-[22px] font-extrabold m-0 leading-tight">
            Welcome back, Admin! 👋
          </h2>
          <p className="text-white/55 text-[13.5px] m-0 mt-[4px]">
            Here's what's happening with UDI Sports today.
          </p>
        </div>
        <div className="flex gap-[12px] relative z-10">
          <div className="bg-white/15 rounded-[12px] px-[16px] py-[10px] text-center">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[1px] m-0">Total Records</p>
            <p className="text-white text-[22px] font-extrabold m-0 leading-tight">{Object.values(summary).reduce((a, b) => a + b, 0)}</p>
          </div>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
        {cards.map((card, i) => <StatCard key={i} card={card} idx={i} />)}
      </div>
    </div>
  )
}