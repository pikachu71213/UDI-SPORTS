/**
 * Public API controller — no auth required.
 * Returns data in shapes expected by the website frontend.
 */

import Blog from '../models/Blog.js'
import CommitteeMember from '../models/CommitteeMember.js'
import CommitteeGroup from '../models/CommitteeGroup.js'
import SpecialMember from '../models/SpecialMember.js'
import GeneralMember from '../models/GeneralMember.js'
import Player from '../models/Player.js'
import Event from '../models/Event.js'
import mongoose from 'mongoose'
import { toPublicMediaUrl } from '../utils/mediaUrl.js'

const CATEGORY_TO_PAGE = {
  'success story': 'success-stories',
  event: 'events',
  initiative: 'initiatives',
  partnership: 'partnerships',
  mentorship: 'mentorship',
}

const PAGE_TO_CATEGORY = {
  home: 'General',
  general: 'General',
  events: 'Event',
  'success-stories': 'Success Story',
  initiatives: 'Initiative',
  partnerships: 'Partnership',
  mentorship: 'Mentorship',
}

function normalizeCategory(value = '') {
  return String(value).trim().toLowerCase()
}

// ─── Format date for frontend ─────────────────────────────
function formatDate(d) {
  if (!d) return { display: '', iso: '' }
  const date = new Date(d)
  const display = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const iso = date.toISOString().slice(0, 10)
  return { display, iso }
}

/** Event `date` field is often YYYY-MM-DD from admin — parse as local calendar date */
function formatEventListDate(dateStr) {
  if (!dateStr || !String(dateStr).trim()) return ''
  const s = String(dateStr).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const date = new Date(s)
  if (Number.isNaN(date.getTime())) return s
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function mapEventToPublicList(req, doc) {
  const teamA = doc.teamA || {}
  const teamB = doc.teamB || {}
  const loc = String(doc.location || '').trim()
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    date: formatEventListDate(doc.date),
    location: loc,
    venue: loc,
    sport: doc.sport,
    status: 'Upcoming',
    teamA: {
      name: teamA.name,
      members: Array.isArray(teamA.members) ? teamA.members.length : 0,
      img: toPublicMediaUrl(req, teamA.img),
    },
    teamB: {
      name: teamB.name,
      members: Array.isArray(teamB.members) ? teamB.members.length : 0,
      img: toPublicMediaUrl(req, teamB.img),
    },
  }
}

function defaultEventDescription(doc) {
  const loc = String(doc.location || '').trim()
  const sport = String(doc.sport || 'sports').trim()
  const place = loc ? ` in ${loc}` : ''
  return `${doc.title} is a ${sport} event${place}, organised under UDIISA. Follow full squad lineups and updates here.`
}

// ─── PUBLIC EVENTS (matches / admin Events) ───────────────────
export const getPublicEvents = async (req, res) => {
  try {
    const limitRaw = parseInt(req.query.limit, 10)
    const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, limitRaw)) : null
    let q = Event.find({}).sort({ createdAt: -1 }).lean()
    if (limit) q = q.limit(limit)
    const list = await q
    return res.json(list.map((row) => mapEventToPublicList(req, row)))
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch events' })
  }
}

export const getPublicEventBySlug = async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim()
    if (!slug) return res.status(404).json({ message: 'Event not found' })
    const doc = await Event.findOne({ slug }).lean()
    if (!doc) return res.status(404).json({ message: 'Event not found' })

    const teamA = doc.teamA || {}
    const teamB = doc.teamB || {}
    const loc = String(doc.location || '').trim()
    const membersA = Array.isArray(teamA.members) ? teamA.members : []
    const membersB = Array.isArray(teamB.members) ? teamB.members : []

    const out = {
      id: doc._id.toString(),
      slug: doc.slug,
      title: doc.title,
      date: formatEventListDate(doc.date),
      sport: doc.sport,
      venue: loc || 'TBA',
      status: 'Upcoming',
      description: defaultEventDescription(doc),
      teamA: {
        name: teamA.name,
        captain: String(teamA.captain || '').trim(),
        members: membersA.map((m) => ({ name: m.name })),
      },
      teamB: {
        name: teamB.name,
        captain: String(teamB.captain || '').trim(),
        members: membersB.map((m) => ({ name: m.name })),
      },
    }
    return res.json(out)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch event' })
  }
}

// ─── PUBLIC BLOGS ──────────────────────────────────────────
export const getPublicBlogs = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query
    const filter = {}
    const textConditions = []

    if (search && search.trim()) {
      textConditions.push(
        { heading: new RegExp(search, 'i') },
        { pageName: new RegExp(search, 'i') },
        { shortContent: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
      )
    }

    if (category && category.trim() && category !== 'All') {
      const normalized = normalizeCategory(category)
      const mappedPageName = CATEGORY_TO_PAGE[normalized]
      const categoryConditions = [
        { category: category.trim() },
        { category: new RegExp(`^${category.trim()}$`, 'i') },
        ...(mappedPageName ? [{ pageName: mappedPageName }] : []),
      ]

      if (textConditions.length) {
        filter.$and = [{ $or: textConditions }, { $or: categoryConditions }]
      } else {
        filter.$or = categoryConditions
      }
    } else if (textConditions.length) {
      filter.$or = textConditions
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, Math.max(1, parseInt(limit, 10)))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)))
    const [list, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Blog.countDocuments(filter),
    ])
    const blogs = list.map((b) => {
      const { display, iso } = formatDate(b.createdAt)
      return {
        id: b._id.toString(),
        // Use unique id as slug so blog detail always opens the clicked post.
        slug: b._id.toString(),
        title: b.heading,
        category: b.category || PAGE_TO_CATEGORY[b.pageName] || 'General',
        excerpt: b.shortContent,
        image: toPublicMediaUrl(req, b.image),
        author: b.author || 'UDI Sports',
        authorImg: b.authorImg || null,
        date: display,
        dateISO: iso,
        readTime: b.readTime || '2 min read',
        tags: Array.isArray(b.tags) ? b.tags : [],
      }
    })
    return res.json({ blogs, total })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch blogs' })
  }
}

export const getPublicBlogBySlug = async (req, res) => {
  try {
    const slug = req.params.slug
    let blog = null

    // Primary: unique id-based routing (recommended by frontend).
    if (mongoose.Types.ObjectId.isValid(slug)) {
      blog = await Blog.findById(slug).lean()
    }

    // Backward compatibility for older links that used pageName.
    if (!blog) {
      blog = await Blog.findOne({ pageName: slug }).sort({ createdAt: -1 }).lean()
    }

    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    const { display, iso } = formatDate(blog.createdAt)
    const out = {
      id: blog._id.toString(),
      slug: blog._id.toString(),
      title: blog.heading,
      category: blog.category || PAGE_TO_CATEGORY[blog.pageName] || 'General',
      excerpt: blog.shortContent,
      image: toPublicMediaUrl(req, blog.image),
      author: blog.author || 'UDI Sports',
      authorImg: blog.authorImg || null,
      date: display,
      dateISO: iso,
      readTime: blog.readTime || '2 min read',
      tags: Array.isArray(blog.tags) ? blog.tags : [],
      content: blog.content || '',
    }
    return res.json(out)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch blog' })
  }
}

// ─── PUBLIC MEMBERS ───────────────────────────────────────
export const getPublicCommittee = async (req, res) => {
  try {
    const list = await CommitteeMember.find({}).sort({ createdAt: -1 }).lean()
    const members = list.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      role: m.position,
      company: m.companyName || '',
      img: toPublicMediaUrl(req, m.photo) || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=F05A1A&color=fff&size=200`,
    }))
    return res.json(members)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch committee' })
  }
}

export const getPublicCommittees = async (req, res) => {
  try {
    const list = await CommitteeGroup.find({}).sort({ createdAt: -1 }).lean()
    const committees = list.map((c) => ({
      _id: c._id.toString(),
      slug: c.slug,
      label: c.label,
      shortLabel: c.shortLabel,
      icon: c.icon,
      role: c.role,
      description: c.description,
      cardVariant: c.cardVariant,
      members: Array.isArray(c.members)
        ? c.members.map((m) => ({
            _id: m._id?.toString?.() || null,
            name: m.name,
            role: m.role,
            company: m.company || '',
            image: toPublicMediaUrl(req, m.image),
          }))
        : [],
    }))
    return res.json(committees)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch committees' })
  }
}

export const getPublicSpecialMembers = async (req, res) => {
  try {
    const list = await SpecialMember.find({}).sort({ createdAt: -1 }).lean()
    const members = list.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      companyName: m.companyName || '',
      designation: m.companyName || 'Special Member',
      membershipType: m.membershipCategory || 'Silver',
      membershipCategory: m.membershipCategory || 'Silver',
      img: toPublicMediaUrl(req, m.photo) || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=F05A1A&color=fff&size=200`,
    }))
    return res.json(members)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch special members' })
  }
}

export const getPublicGeneralMembers = async (req, res) => {
  try {
    const { type } = req.query
    const normalizedType = String(type || '').trim().toLowerCase()
    const typeMap = {
      corporate: 'body-corporate',
      'body-corporate': 'body-corporate',
      individual: 'individual',
      players: 'players',
      'sports-participants': 'players',
      'sports participants': 'players',
    }
    const filter = normalizedType ? { type: typeMap[normalizedType] || 'individual' } : {}
    const list = await GeneralMember.find(filter).sort({ createdAt: -1 }).lean()
    const members = list.map((m) => {
      const companyVal = m.companyName || '-'
      if (m.type === 'body-corporate') {
        return {
          id: m._id.toString(),
          name: m.contactPerson || m.name,
          company: companyVal,
          organization: companyVal,
          sector: '-',
        }
      }
      if (m.type === 'players') {
        return {
          id: m._id.toString(),
          name: m.name,
          company: companyVal,
          organization: companyVal,
          category: m.companyName || '-',
          sport: m.companyName || '-',
        }
      }
      return {
        id: m._id.toString(),
        name: m.name,
        company: companyVal,
        organization: companyVal,
        city: m.email || '-',
        sport: m.phone || '-',
      }
    })
    return res.json(members)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch general members' })
  }
}

// ─── PUBLIC PLAYERS ───────────────────────────────────────
export const getPublicPlayers = async (req, res) => {
  try {
    const list = await Player.find({}).sort({ createdAt: -1 }).lean()
    const players = list.map((p) => ({
      id: p._id.toString(),
      name: p.playerName,
      sport: p.sportsName,
      role: `${p.sportsName} Player`,
      achievement: p.achievement || '-',
      gender: p.gender || '-',
      photo: toPublicMediaUrl(req, p.photo),
    }))
    return res.json(players)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch players' })
  }
}
