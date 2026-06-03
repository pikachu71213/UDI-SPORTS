import mongoose from 'mongoose'
import Event from '../models/Event.js'
import { uploadImageFromDataUrl } from '../utils/cloudinary.js'
import { toPublicMediaUrl, isDataUrl } from '../utils/mediaUrl.js'

const toSlug = (str) =>
  String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .concat('-', new Date().getFullYear())

const ensureMemberId = (m) => ({
  id: String(m?.id || `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`),
  name: String(m?.name || '').trim(),
})

const normalizeTeam = (t) => {
  const raw = t || {}
  const members = Array.isArray(raw.members) ? raw.members.map(ensureMemberId).filter((m) => m.name) : []
  return {
    name: String(raw.name || '').trim(),
    captain: String(raw.captain || '').trim(),
    img: raw.img == null || raw.img === '' ? null : String(raw.img),
    members,
  }
}

async function resolveTeamImages(team) {
  if (!team) return team
  let img = team.img
  if (img && isDataUrl(img)) {
    const uploaded = await uploadImageFromDataUrl(img, 'udiisa/events/teams')
    img = uploaded || img
  }
  return { ...team, img }
}

function serializeEvent(req, doc) {
  const o = doc.toObject ? doc.toObject() : { ...doc }
  const teamA = {
    ...o.teamA,
    img: toPublicMediaUrl(req, o.teamA?.img),
  }
  const teamB = {
    ...o.teamB,
    img: toPublicMediaUrl(req, o.teamB?.img),
  }
  return {
    id: String(o._id),
    title: o.title,
    sport: o.sport,
    date: o.date || '',
    location: o.location || '',
    slug: o.slug,
    createdAt: o.createdAt?.toISOString?.() || o.createdAt,
    teamA,
    teamB,
  }
}

export const getEvents = async (req, res) => {
  try {
    const { search } = req.query
    const filter = {}
    if (search && String(search).trim()) {
      const q = String(search).trim()
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      filter.$or = [
        { title: rx },
        { sport: rx },
        { location: rx },
        { slug: rx },
        { 'teamA.name': rx },
        { 'teamB.name': rx },
      ]
    }
    const list = await Event.find(filter).sort({ createdAt: -1 }).lean()
    return res.json(list.map((row) => serializeEvent(req, row)))
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch events' })
  }
}

export const addEvent = async (req, res) => {
  try {
    const body = req.body || {}
    const title = String(body.title || '').trim()
    if (!title) return res.status(400).json({ message: 'Title is required' })

    let teamA = normalizeTeam(body.teamA)
    let teamB = normalizeTeam(body.teamB)
    if (!teamA.name) return res.status(400).json({ message: 'Team A name is required' })
    if (!teamB.name) return res.status(400).json({ message: 'Team B name is required' })

    teamA = await resolveTeamImages(teamA)
    teamB = await resolveTeamImages(teamB)

    const slug = String(body.slug || '').trim() || toSlug(title)

    const doc = await Event.create({
      title,
      sport: String(body.sport || 'Cricket').trim(),
      date: body.date != null ? String(body.date) : '',
      location: String(body.location || '').trim(),
      slug,
      teamA,
      teamB,
    })
    return res.status(201).json(serializeEvent(req, doc))
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'An event with this slug already exists. Change the slug.' })
    }
    return res.status(500).json({ message: e.message || 'Failed to create event' })
  }
}

export const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Event not found' })
    }
    const doc = await Event.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Event not found' })

    const body = req.body || {}

    if (body.title !== undefined) {
      const t = String(body.title || '').trim()
      if (!t) return res.status(400).json({ message: 'Title is required' })
      doc.title = t
    }
    if (body.sport !== undefined) doc.sport = String(body.sport || '').trim()
    if (body.date !== undefined) doc.date = body.date != null ? String(body.date) : ''
    if (body.location !== undefined) doc.location = String(body.location || '').trim()
    if (body.slug !== undefined) {
      const s = String(body.slug || '').trim()
      if (!s) return res.status(400).json({ message: 'Slug is required' })
      doc.slug = s
    }

    if (body.teamA !== undefined) {
      const teamA = normalizeTeam(body.teamA)
      if (!teamA.name) return res.status(400).json({ message: 'Team A name is required' })
      doc.teamA = await resolveTeamImages(teamA)
    }
    if (body.teamB !== undefined) {
      const teamB = normalizeTeam(body.teamB)
      if (!teamB.name) return res.status(400).json({ message: 'Team B name is required' })
      doc.teamB = await resolveTeamImages(teamB)
    }

    await doc.save()
    return res.json(serializeEvent(req, doc))
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).json({ message: 'An event with this slug already exists. Change the slug.' })
    }
    return res.status(500).json({ message: e.message || 'Failed to update event' })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Event not found' })
    }
    const doc = await Event.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Event not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete' })
  }
}
