import { Router } from 'express'
import * as ctrl from '../controllers/incomingController.js'
import { authMiddleware } from '../middleware/auth.js'
import { uploadSingle } from '../middleware/upload.js'

const r = Router()

// Public (no auth) — website forms
r.post('/public/contact', ctrl.submitContact)
r.post('/public/member', uploadSingle('photo'), ctrl.submitMemberForm)
r.post('/public/send-otp', ctrl.sendOtp)
r.post('/public/verify-otp', ctrl.verifyOtp)

// Admin
r.get('/contacts', authMiddleware, ctrl.getContactForms)
r.delete('/contacts/:id', authMiddleware, ctrl.deleteContactForm)
r.get('/members', authMiddleware, ctrl.getMemberForms)
r.delete('/members/:id', authMiddleware, ctrl.deleteMemberForm)

export default r
