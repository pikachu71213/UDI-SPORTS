import { Router } from 'express'
import * as ctrl from '../controllers/authController.js'
import { authMiddleware } from '../middleware/auth.js'

const r = Router()

r.post('/login', ctrl.login)
r.post('/logout', ctrl.logout)
r.post('/send-otp', ctrl.sendPasswordOtp)
r.post('/verify-otp', ctrl.verifyPasswordOtp)
r.post('/forgot-password', ctrl.forgotPassword)
r.post('/reset-password', ctrl.resetPassword)
r.get('/profile', authMiddleware, ctrl.getProfile)
r.put('/change-password', authMiddleware, ctrl.changePassword)

export default r
