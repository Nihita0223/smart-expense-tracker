import api from './axios'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
}

export const expenseAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  getStats: (params) => api.get('/expenses/stats', { params }),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
}

export const budgetAPI = {
  getAll: (params) => api.get('/budgets', { params }),
  upsert: (data) => api.post('/budgets', data),
  delete: (id) => api.delete(`/budgets/${id}`),
}
