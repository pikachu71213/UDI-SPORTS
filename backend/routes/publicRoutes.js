import { Router } from 'express'
import * as ctrl from '../controllers/publicController.js'

const r = Router()

// Public events / matches (no auth)
r.get('/events/slug/:slug', ctrl.getPublicEventBySlug)
r.get('/events', ctrl.getPublicEvents)

// Public blogs (no auth)
r.get('/blogs', ctrl.getPublicBlogs)
r.get('/blogs/slug/:slug', ctrl.getPublicBlogBySlug)

// Public members (no auth)
r.get('/committees', ctrl.getPublicCommittees)
r.get('/members/committee', ctrl.getPublicCommittee)
r.get('/members/special', ctrl.getPublicSpecialMembers)
r.get('/members/general', ctrl.getPublicGeneralMembers)

// Public players (no auth)
r.get('/players', ctrl.getPublicPlayers)

export default r
