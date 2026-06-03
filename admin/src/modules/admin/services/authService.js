// admin/services/authService.js
import api from './api'

const authService = {
  login:           (data)  => api.post('/auth/login', data),
  logout:          ()      => api.post('/auth/logout'),
  changePassword:  (data)  => api.put('/auth/change-password', data),
  sendOtp:         (email) => api.post('/auth/send-otp', { email }),
  verifyOtp:       (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword:   (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword }),
  forgotPassword:  (email) => api.post('/auth/forgot-password', { email }),
  getProfile:      ()      => api.get('/auth/profile'),
}

export default authService