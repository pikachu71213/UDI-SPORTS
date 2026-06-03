import GeneralMember from '../models/GeneralMember.js'
import SpecialMember from '../models/SpecialMember.js'
import CommitteeMember from '../models/CommitteeMember.js'
import CommitteeGroup from '../models/CommitteeGroup.js'
import Blog from '../models/Blog.js'
import Player from '../models/Player.js'
import IncomingMember from '../models/IncomingMember.js'
import IncomingContact from '../models/IncomingContact.js'
import { uploadImageFromFile } from '../utils/cloudinary.js'
import { toPublicMediaUrl } from '../utils/mediaUrl.js'

const withImage = (doc, req) => {
  const out = doc.toObject ? doc.toObject() : doc
  out.photo = toPublicMediaUrl(req, out.photo)
  return out
}

const normalizeCommitteeMember = (member = {}) => ({
  name: String(member.name || '').trim(),
  role: String(member.role || '').trim(),
  company: String(member.company || '').trim(),
  image: member.image || null,
})

const normalizeSpecialMembershipCategory = (raw) => {
  const value = String(raw || '').trim().toLowerCase()
  if (value === 'diamond') return 'Diamond'
  if (value === 'gold') return 'Gold'
  if (value === 'silver') return 'Silver'
  if (value === 'dignitaries' || value === 'dignitary') return 'Dignitaries'
  if (value === 'celebrity' || value === 'celebrities') return 'Celebrity'
  if (value === 'body corporate' || value === 'body-corporate' || value === 'corporate') return 'Body Corporate'
  return 'Silver'
}

const ALLOWED_GENERAL_TYPES = new Set(['individual', 'players', 'body-corporate'])
const normalizeGeneralType = (raw) => {
  const value = String(raw || '').trim().toLowerCase()
  if (value === 'corporate') return 'body-corporate'
  if (value === 'sports-participants' || value === 'sports participants' || value === 'participant') return 'players'
  return ALLOWED_GENERAL_TYPES.has(value) ? value : 'individual'
}

// ─── General Members ─────────────────────────────
export const getGeneralMembers = async (req, res) => {
  try {
    const { search, type } = req.query
    const filter = {}
    if (type) filter.type = normalizeGeneralType(type)
    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
        { contactPerson: new RegExp(search, 'i') },
      ]
    }
    const list = await GeneralMember.find(filter).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch members' })
  }
}

export const addGeneralMember = async (req, res) => {
  try {
    const { type, name, email, phone, companyName, contactPerson } = req.body
    const doc = await GeneralMember.create({
      type: normalizeGeneralType(type),
      name: name || '',
      email: email || '',
      phone: phone || '',
      companyName: companyName || '',
      contactPerson: contactPerson || '',
    })
    return res.status(201).json(doc)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to add member' })
  }
}

export const updateGeneralMember = async (req, res) => {
  try {
    const payload = { ...req.body }
    if (payload.type !== undefined) payload.type = normalizeGeneralType(payload.type)
    const doc = await GeneralMember.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    )
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json(doc)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to update' })
  }
}

export const deleteGeneralMember = async (req, res) => {
  try {
    const doc = await GeneralMember.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete' })
  }
}

// ─── Special Members ─────────────────────────────
export const getSpecialMembers = async (req, res) => {
  try {
    const { search } = req.query
    const filter = {}
    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
      ]
    }
    const list = await SpecialMember.find(filter).sort({ createdAt: -1 }).lean()
    list.forEach((m) => { m.photo = toPublicMediaUrl(req, m.photo) })
    return res.json(list)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch' })
  }
}

export const addSpecialMember = async (req, res) => {
  try {
    const { name, companyName, membershipCategory } = req.body
    const photo = req.file
      ? (await uploadImageFromFile(req.file, 'udiisa/special-members')) || `/uploads/image/${req.file.filename}`
      : null
    const doc = await SpecialMember.create({
      name: name || '',
      companyName: companyName || '',
      membershipCategory: normalizeSpecialMembershipCategory(membershipCategory),
      photo,
    })
    return res.status(201).json(withImage(doc, req))
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to add' })
  }
}

export const updateSpecialMember = async (req, res) => {
  try {
    const doc = await SpecialMember.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (req.body.name !== undefined) doc.name = req.body.name
    if (req.body.companyName !== undefined) doc.companyName = req.body.companyName
    if (req.body.membershipCategory !== undefined) {
      doc.membershipCategory = normalizeSpecialMembershipCategory(req.body.membershipCategory)
    }
    if (req.file) {
      doc.photo =
        (await uploadImageFromFile(req.file, 'udiisa/special-members')) || `/uploads/image/${req.file.filename}`
    }
    await doc.save()
    return res.json(withImage(doc, req))
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to update' })
  }
}

export const deleteSpecialMember = async (req, res) => {
  try {
    const doc = await SpecialMember.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete' })
  }
}

// ─── Committee ───────────────────────────────────
export const getCommittee = async (req, res) => {
  try {
    const { search } = req.query
    const filter = {}
    if (search && search.trim()) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { position: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
      ]
    }
    const list = await CommitteeMember.find(filter).sort({ createdAt: -1 }).lean()
    list.forEach((m) => { m.photo = toPublicMediaUrl(req, m.photo) })
    return res.json(list)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch' })
  }
}

export const addCommittee = async (req, res) => {
  try {
    const { name, position, companyName } = req.body
    const photo = req.file
      ? (await uploadImageFromFile(req.file, 'udiisa/committee')) || `/uploads/image/${req.file.filename}`
      : null
    const doc = await CommitteeMember.create({
      name: name || '',
      position: position || '',
      companyName: companyName || '',
      photo,
    })
    return res.status(201).json(withImage(doc, req))
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to add' })
  }
}

export const updateCommittee = async (req, res) => {
  try {
    const doc = await CommitteeMember.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    if (req.body.name !== undefined) doc.name = req.body.name
    if (req.body.position !== undefined) doc.position = req.body.position
    if (req.body.companyName !== undefined) doc.companyName = req.body.companyName
    if (req.file) {
      doc.photo =
        (await uploadImageFromFile(req.file, 'udiisa/committee')) || `/uploads/image/${req.file.filename}`
    }
    await doc.save()
    return res.json(withImage(doc, req))
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to update' })
  }
}

export const deleteCommittee = async (req, res) => {
  try {
    const doc = await CommitteeMember.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete' })
  }
}

// ─── Committee Groups (new admin page) ─────────────────────
export const getCommitteeGroups = async (req, res) => {
  try {
    const list = await CommitteeGroup.find({}).sort({ createdAt: -1 }).lean()
    list.forEach((group) => {
      if (!Array.isArray(group.members)) return
      group.members = group.members.map((member) => ({
        ...member,
        image: toPublicMediaUrl(req, member.image),
      }))
    })
    return res.json(list)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to fetch committees' })
  }
}

export const addCommitteeGroup = async (req, res) => {
  try {
    const payload = req.body || {}
    const doc = await CommitteeGroup.create({
      slug: String(payload.slug || '').trim(),
      label: String(payload.label || '').trim(),
      shortLabel: String(payload.shortLabel || '').trim(),
      icon: String(payload.icon || '🏛️').trim(),
      role: String(payload.role || '').trim(),
      description: String(payload.description || '').trim(),
      cardVariant: String(payload.cardVariant || 'orange').trim(),
      members: [],
    })
    return res.status(201).json(doc)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to add committee' })
  }
}

export const updateCommitteeGroup = async (req, res) => {
  try {
    const payload = req.body || {}
    const doc = await CommitteeGroup.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })

    if (payload.slug !== undefined) doc.slug = String(payload.slug || '').trim()
    if (payload.label !== undefined) doc.label = String(payload.label || '').trim()
    if (payload.shortLabel !== undefined) doc.shortLabel = String(payload.shortLabel || '').trim()
    if (payload.icon !== undefined) doc.icon = String(payload.icon || '🏛️').trim()
    if (payload.role !== undefined) doc.role = String(payload.role || '').trim()
    if (payload.description !== undefined) doc.description = String(payload.description || '').trim()
    if (payload.cardVariant !== undefined) doc.cardVariant = String(payload.cardVariant || 'orange').trim()

    await doc.save()
    return res.json(doc)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to update committee' })
  }
}

export const deleteCommitteeGroup = async (req, res) => {
  try {
    const doc = await CommitteeGroup.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete committee' })
  }
}

export const addCommitteeGroupMember = async (req, res) => {
  try {
    const doc = await CommitteeGroup.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Committee not found' })

    const member = normalizeCommitteeMember(req.body)
    if (!member.name || !member.role) {
      return res.status(400).json({ message: 'Member name and role are required' })
    }

    doc.members.push(member)
    await doc.save()
    return res.status(201).json(doc.members[doc.members.length - 1])
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to add member' })
  }
}

export const updateCommitteeGroupMember = async (req, res) => {
  try {
    const { id, memberId } = req.params
    const doc = await CommitteeGroup.findById(id)
    if (!doc) return res.status(404).json({ message: 'Committee not found' })

    const member = doc.members.id(memberId)
    if (!member) return res.status(404).json({ message: 'Member not found' })

    const payload = req.body || {}
    if (payload.name !== undefined) member.name = String(payload.name || '').trim()
    if (payload.role !== undefined) member.role = String(payload.role || '').trim()
    if (payload.company !== undefined) member.company = String(payload.company || '').trim()
    if (payload.image !== undefined) member.image = payload.image || null

    if (!member.name || !member.role) {
      return res.status(400).json({ message: 'Member name and role are required' })
    }

    await doc.save()
    return res.json(member)
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to update member' })
  }
}

export const deleteCommitteeGroupMember = async (req, res) => {
  try {
    const { id, memberId } = req.params
    const doc = await CommitteeGroup.findById(id)
    if (!doc) return res.status(404).json({ message: 'Committee not found' })

    const member = doc.members.id(memberId)
    if (!member) return res.status(404).json({ message: 'Member not found' })
    member.deleteOne()
    await doc.save()
    return res.json({ message: 'Deleted' })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete member' })
  }
}

export const getSummary = async (req, res) => {
  try {
    const [general, special, committee, players, blogs, incomingMembers, incomingContacts, committeeGroups] = await Promise.all([
      GeneralMember.countDocuments(),
      SpecialMember.countDocuments(),
      CommitteeMember.countDocuments(),
      Player.countDocuments(),
      Blog.countDocuments(),
      IncomingMember.countDocuments(),
      IncomingContact.countDocuments(),
      CommitteeGroup.find({}, { members: 1 }).lean(),
    ])
    const committeeGroupMembers = committeeGroups.reduce((acc, c) => acc + (Array.isArray(c.members) ? c.members.length : 0), 0)
    const committeeTotal = committee + committeeGroupMembers

    return res.json({
      // Legacy fields
      general,
      special,
      committee: committeeTotal,
      // Dashboard fields
      totalMembers: general + special + committeeTotal,
      totalSpecial: special,
      totalPlayers: players,
      totalBlogs: blogs,
      incomingMembers,
      incomingContacts,
    })
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed' })
  }
}
