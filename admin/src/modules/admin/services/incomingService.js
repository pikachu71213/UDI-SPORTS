// admin/services/incomingService.js
import api from './api'

const incomingService = {
  getMemberForms:   (params) => api.get('/incoming/members', { params }),
  deleteMemberForm: (id)     => api.delete(`/incoming/members/${id}`),

  getContactForms:   (params) => api.get('/incoming/contacts', { params }),
  deleteContactForm: (id)     => api.delete(`/incoming/contacts/${id}`),
}

export default incomingService