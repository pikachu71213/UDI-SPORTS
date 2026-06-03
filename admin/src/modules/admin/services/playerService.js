// admin/services/playerService.js
import api from './api'

const playerService = {
  getPlayers:   (params)    => api.get('/players', { params }),
  getPlayer:    (id)        => api.get(`/players/${id}`),
  addPlayer:    (data)      => api.post('/players', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePlayer: (id, data)  => api.put(`/players/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deletePlayer: (id)        => api.delete(`/players/${id}`),
}

export default playerService