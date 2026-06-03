// admin/services/memberService.js
import api from './api'

const memberService = {
  // General Members
  getGeneralMembers:   (params) => api.get('/members/general', { params }),
  addGeneralMember:    (data)   => api.post('/members/general', data),
  updateGeneralMember: (id, data) => api.put(`/members/general/${id}`, data),
  deleteGeneralMember: (id)     => api.delete(`/members/general/${id}`),

  // Special Members
  getSpecialMembers:   (params) => api.get('/members/special', { params }),
  addSpecialMember:    (data)   => api.post('/members/special', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateSpecialMember: (id, data) => api.put(`/members/special/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteSpecialMember: (id)     => api.delete(`/members/special/${id}`),

  // Managing Committee
  getCommittee:   (params)    => api.get('/members/committee', { params }),
  addCommittee:   (data)      => api.post('/members/committee', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCommittee:(id, data)  => api.put(`/members/committee/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCommittee:(id)        => api.delete(`/members/committee/${id}`),

  // Committee groups (new committee admin page)
  getCommitteeGroups:        ()              => api.get('/members/committees'),
  addCommitteeGroup:         (data)          => api.post('/members/committees', data),
  updateCommitteeGroup:      (id, data)      => api.put(`/members/committees/${id}`, data),
  deleteCommitteeGroup:      (id)            => api.delete(`/members/committees/${id}`),
  addCommitteeGroupMember:   (id, data)      => api.post(`/members/committees/${id}/members`, data),
  updateCommitteeGroupMember:(id, mid, data) => api.put(`/members/committees/${id}/members/${mid}`, data),
  deleteCommitteeGroupMember:(id, mid)       => api.delete(`/members/committees/${id}/members/${mid}`),

  // Dashboard summary
  getSummary: () => api.get('/members/summary'),
}

export default memberService