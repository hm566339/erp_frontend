import api from '../axiosInstance'

export const vendorService = {
  // Vendor management endpoints from api.json spec
  listVendors: (params) => api.get('/api/v1/vendors', { params }),
  getVendor: (id) => api.get(`/api/v1/vendors/${id}`),
  createVendor: (data) => api.post('/api/v1/vendors', data),
  updateVendor: (id, data) => api.put(`/api/v1/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/api/v1/vendors/${id}`),
  deactivateVendor: (id) => api.put(`/api/v1/vendors/${id}/deactivate`),
  activateVendor: (id) => api.put(`/api/v1/vendors/${id}/activate`),
}
