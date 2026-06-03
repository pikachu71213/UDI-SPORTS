/**
 * blogData.js  ← /src/blogs/blogData.js
 * ─────────────────────────────────────────────────────────
 * Shared data + custom React hooks — wired to backend /api/public/blogs
 */

import { useState, useEffect } from 'react'
import { getPublicBlogs, getPublicBlogBySlug } from '../../../../shared/services/publicApi'

/* ══════════════════════
   CATEGORIES
══════════════════════ */
export const CATEGORIES = [
  'All', 'Success Story', 'Event',
  'Initiative', 'Partnership', 'Mentorship',
]

/* ══════════════════════
   CATEGORY → Tailwind classes
══════════════════════ */
export const getCatColor = (cat) => {
  const MAP = {
    'Success Story': { bg: 'bg-[#e8f5ee]', text: 'text-[#1a6b3a]', border: 'border-[#1a6b3a]/25', dot: 'bg-[#1a6b3a]' },
    'Event':         { bg: 'bg-[#FFF3EC]', text: 'text-[#F05A1A]', border: 'border-[#F05A1A]/25', dot: 'bg-[#F05A1A]' },
    'Initiative':    { bg: 'bg-[#e8ecf8]', text: 'text-[#0B1E4B]', border: 'border-[#0B1E4B]/25', dot: 'bg-[#0B1E4B]' },
    'Partnership':   { bg: 'bg-[#e3f0fc]', text: 'text-[#1565C0]', border: 'border-[#1565C0]/25', dot: 'bg-[#1565C0]' },
    'Mentorship':    { bg: 'bg-[#f5e9ff]', text: 'text-[#6a1b9a]', border: 'border-[#6a1b9a]/25', dot: 'bg-[#6a1b9a]' },
  }
  return MAP[cat] || { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' }
}

/* ══════════════════════
   MOCK BLOG DATA
══════════════════════ */
export const MOCK_BLOGS = [
  {
    id: 1,
    slug: 'from-fields-to-glory-boxing',
    title: "From Fields to Glory: India's Next Boxing Champion",
    category: 'Success Story',
    excerpt: 'A young boxer from rural Haryana defied all odds, trained for 4 years under our mentorship program, and clinched the national gold medal.',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80&fit=crop',
    author: 'Priya Sharma',
    authorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face',
    date: 'Dec 15, 2024',
    dateISO: '2024-12-15',
    readTime: '5 min read',
    tags: ['Boxing', 'Success', 'Youth', 'Mentorship'],
    content: `
      <h2>A Journey That Began in the Dust</h2>
      <p>Arjun Kumar, 19, grew up in a small village in Haryana where boxing was his only escape from poverty. With no professional coach and minimal resources, he trained in an open field every morning before school.</p>
      <blockquote>"I never thought I'd represent my country. UDI Sports gave me a platform I never imagined possible." — Arjun Kumar</blockquote>
      <h2>The Mentorship Program</h2>
      <p>UDI Sports NGO identified Arjun in 2020 through our grassroots scouting initiative. He was enrolled in our 4-year mentorship program, which provided:</p>
      <ul><li>Professional coaching from National coaches</li><li>Nutrition and fitness support</li><li>Psychological counselling and confidence-building workshops</li><li>Financial support for tournament travel</li></ul>
      <h2>National Championship 2024</h2>
      <p>At the National Boxing Championship in Delhi, Arjun defeated the defending champion in a thrilling 5-round bout. The crowd erupted as the young fighter raised his fists — the gold medal finally around his neck.</p>
      <h2>What's Next?</h2>
      <p>Arjun will now represent India at the Asian Youth Boxing Championship in March 2025. Our entire family at UDI Sports is behind him every step of the way.</p>
    `,
  },
  {
    id: 2,
    slug: 'annual-sports-talent-hunt-2024',
    title: 'Annual Sports Talent Hunt 2024: Record 5,000 Players',
    category: 'Event',
    excerpt: 'Our biggest talent identification event saw participation from 28 states across India — scouting the next generation of champions.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80&fit=crop',
    author: 'Amit Gupta',
    authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face',
    date: 'Dec 10, 2024',
    dateISO: '2024-12-10',
    readTime: '4 min read',
    tags: ['Event', 'Talent', 'Cricket', 'Athletics'],
    content: `
      <h2>India's Biggest Sports Scouting Event</h2>
      <p>The Annual Sports Talent Hunt 2024 witnessed an unprecedented turnout. Over 5,000 Players aged 10–22 participated across 12 sports disciplines.</p>
      <h2>Key Highlights</h2>
      <ul><li>28 states participated — highest ever</li><li>12 disciplines including Cricket, Athletics, Boxing, and Badminton</li><li>250 Players shortlisted for the National Development Camp</li><li>₹50 lakh in scholarships announced</li></ul>
      <h2>Venue & Organisation</h2>
      <p>The event was held across 14 venues simultaneously, managed by 300+ volunteers and 50 certified sports evaluators. Live streaming reached over 2 lakh viewers online.</p>
    `,
  },
  {
    id: 3,
    slug: 'girl-empowerment-initiative-launch',
    title: 'Breaking Barriers: Girl Empowerment Initiative Launches',
    category: 'Initiative',
    excerpt: 'A new chapter begins as we dedicate resources to female Players facing systemic barriers in rural and semi-urban India.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&fit=crop',
    author: 'Sunita Mehta',
    authorImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80&fit=crop&crop=face',
    date: 'Dec 5, 2024',
    dateISO: '2024-12-05',
    readTime: '6 min read',
    tags: ['Initiative', 'Women', 'Empowerment', 'Grassroots'],
    content: `
      <h2>Why Girl Empowerment?</h2>
      <p>Female Players in India face disproportionate barriers — societal pressure, lack of infrastructure, limited funding, and inadequate safety measures.</p>
      <h2>Programme Components</h2>
      <ul><li><strong>Scholarship Fund:</strong> 100 full scholarships for girls aged 12–20</li><li><strong>Safe Infrastructure:</strong> Dedicated training facilities in 5 cities</li><li><strong>Mentor Network:</strong> 40 female sports mentors</li><li><strong>Community Engagement:</strong> Family programs in 50 villages</li></ul>
      <blockquote>"We don't just train Players. We challenge the systems that keep girls from becoming Players." — Sunita Mehta</blockquote>
    `,
  },
  {
    id: 4,
    slug: 'partnership-10-academies',
    title: 'Partnership with 10 Top Academies Opens New Doors',
    category: 'Partnership',
    excerpt: 'Major academies have agreed to provide subsidised training for UDI Sports Players across cricket, badminton, and athletics.',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&fit=crop',
    author: 'Vikram Singh',
    authorImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&fit=crop&crop=face',
    date: 'Nov 28, 2024',
    dateISO: '2024-11-28',
    readTime: '3 min read',
    tags: ['Partnership', 'Academy', 'Training', 'Cricket'],
    content: `
      <h2>A Landmark Agreement</h2>
      <p>UDI Sports NGO has signed MoUs with 10 of India's top sports academies, providing subsidised training access to over 500 Players.</p>
      <h2>Partner Academies</h2>
      <ul><li>Delhi Cricket Academy</li><li>Mumbai Athletic Centre</li><li>Bangalore Badminton School</li><li>Hyderabad Football Institute</li><li>Pune Boxing Club and 5 more</li></ul>
      <blockquote>"Together we build the infrastructure India's young Players deserve." — Partnership Director, UDI Sports</blockquote>
    `,
  },
  {
    id: 5,
    slug: 'mentorship-program-2025-open',
    title: 'Mentorship Program 2025: Applications Now Open',
    category: 'Mentorship',
    excerpt: 'Over 200 slots available for young Players to be mentored by national and international sports coaches through our flagship program.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80&fit=crop',
    author: 'Rohit Joshi',
    authorImg: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80&fit=crop&crop=face',
    date: 'Nov 20, 2024',
    dateISO: '2024-11-20',
    readTime: '4 min read',
    tags: ['Mentorship', 'Coaching', 'Youth', '2025'],
    content: `
      <h2>Applications Open for 2025 Cohort</h2>
      <p>UDI Sports opens applications for the 2025 Mentorship Program — our flagship initiative pairing elite coaches with promising young Players.</p>
      <h2>Program Details</h2>
      <ul><li>200 slots across 10 sports disciplines</li><li>6-month intensive mentorship (Jan–June 2025)</li><li>Monthly workshops and 1-on-1 coaching sessions</li><li>Performance tracking and career guidance</li></ul>
      <h2>Who Can Apply?</h2>
      <p>Players aged 14–24 from any sport who are registered UDI Sports members. Selection is based on demonstrated talent and commitment.</p>
    `,
  },
  {
    id: 6,
    slug: 'state-games-2024-47-medals',
    title: 'State Games 2024: UDI Players Win 47 Medals',
    category: 'Success Story',
    excerpt: 'Players enrolled in UDI Sports programs dominated the State Games, winning 47 medals including 18 gold — a new record.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80&fit=crop',
    author: 'Priya Sharma',
    authorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face',
    date: 'Nov 15, 2024',
    dateISO: '2024-11-15',
    readTime: '3 min read',
    tags: ['Success', 'Medals', 'State Games', 'Athletics'],
    content: `
      <h2>Record-Breaking Performance</h2>
      <p>A total of 47 medals: 18 Gold, 16 Silver, 13 Bronze across 8 states.</p>
      <h2>Top Performers</h2>
      <ul><li>Anjali Devi – 3 Gold medals in Athletics</li><li>Mohit Rathore – Gold in Wrestling 65kg</li><li>Pooja Kumari – Gold & Silver in Badminton</li></ul>
      <blockquote>"These medals belong to every coach, volunteer, and donor who believed in these kids." — Chairman, UDI Sports</blockquote>
    `,
  },
  {
    id: 7,
    slug: 'rural-sports-infrastructure-drive',
    title: 'New Sports Infrastructure in 15 Rural Districts',
    category: 'Initiative',
    excerpt: 'UDI Sports launches a ₹2 crore infrastructure drive to build playgrounds and mini-stadiums in 15 underserved rural districts.',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&q=80&fit=crop',
    author: 'Amit Gupta',
    authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&fit=crop&crop=face',
    date: 'Nov 8, 2024',
    dateISO: '2024-11-08',
    readTime: '5 min read',
    tags: ['Infrastructure', 'Rural', 'Initiative', 'Construction'],
    content: `
      <h2>Building Grounds Where There Are None</h2>
      <p>UDI Sports is addressing lack of rural sports infrastructure with a ₹2 crore initiative across 15 districts.</p>
      <h2>What Will Be Built</h2>
      <ul><li>10 multi-sport playgrounds</li><li>3 mini-stadiums with seating for 500</li><li>2 indoor courts for Badminton and Table Tennis</li><li>All facilities accessible to women and differently-abled Players</li></ul>
      <h2>Timeline</h2>
      <p>Construction begins January 2025, with first 5 facilities ready by April 2025. All work done in partnership with local Panchayats.</p>
    `,
  },
]

/* ══════════════════════════════════════
   HOOK: useBlogs
══════════════════════════════════════ */
export const useBlogs = ({ search = '', category = 'All', page = 1, limit = 5 }) => {
  const [blogs,   setBlogs]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = {
      page,
      limit,
      ...(search.trim() && { search: search.trim() }),
      ...(category && category !== 'All' && { category }),
    }
    getPublicBlogs(params)
      .then((data) => {
        if (cancelled) return
        setBlogs(Array.isArray(data?.blogs) ? data.blogs : [])
        setTotal(typeof data?.total === 'number' ? data.total : 0)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load blogs.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [search, category, page, limit])

  return { blogs, total, loading, error }
}

/* ══════════════════════════════════════
   HOOK: useBlogDetail
══════════════════════════════════════ */
export const useBlogDetail = (slug) => {
  const [blog,    setBlog]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setBlog(null)
    getPublicBlogBySlug(slug)
      .then((data) => {
        if (cancelled) return
        setBlog(data)
      })
      .catch(() => {
        if (!cancelled) setError('Blog post not found.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [slug])

  return { blog, loading, error }
}

/* ══════════════════════════════════════
   useRecentBlogs — sidebar (from API)
══════════════════════════════════════ */
export const useRecentBlogs = (count = 4) => {
  const [recent, setRecent] = useState([])
  useEffect(() => {
    getPublicBlogs({ limit: count, page: 1 })
      .then((data) => setRecent(Array.isArray(data?.blogs) ? data.blogs : []))
      .catch(() => setRecent([]))
  }, [count])
  return recent
}