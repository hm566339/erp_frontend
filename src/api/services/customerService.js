import api from '../axiosInstance'

export const customerService = {
  listCustomers: (params) => api.get('/api/v1/customers', { params }),
  getCustomer: (id) => api.get(`/api/v1/customers/${id}`),
  createCustomer: (data) => api.post('/api/v1/customers', data),
  updateCustomer: (id, data) => api.put(`/api/v1/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/api/v1/customers/${id}`),
  deactivateCustomer: (id) => api.put(`/api/v1/customers/${id}/deactivate`),
  activateCustomer: (id) => api.put(`/api/v1/customers/${id}/activate`),
}
