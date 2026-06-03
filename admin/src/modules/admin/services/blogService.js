// admin/services/blogService.js
import api from './api'

const blogService = {
  getBlogs:   (params)    => api.get('/blogs', { params }),
  getBlog:    (id)        => api.get(`/blogs/${id}`),
  addBlog:    (data)      => api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBlog: (id, data)  => api.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBlog: (id)        => api.delete(`/blogs/${id}`),
}

export default blogService