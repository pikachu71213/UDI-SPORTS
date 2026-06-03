// admin/services/eventService.js
import api from '../../services/api'

const eventService = {
  getEvents:    (params)     => api.get('/events', { params }),
  addEvent:     (data)       => api.post('/events', data),
  updateEvent:  (id, data)   => api.put(`/events/${id}`, data),
  deleteEvent:  (id)         => api.delete(`/events/${id}`),
}

export default eventService