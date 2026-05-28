import api from '../axiosInstance'

export const invoiceService = {
  // Sales Invoices - from api.json spec
  listInvoices: (params) => api.get('/api/sales/invoices', { params }),
  getInvoice: (invoiceId) => api.get(`/api/sales/invoices/${invoiceId}`),
  createInvoice: (data) => api.post('/api/sales/invoices', data),
  updateInvoice: (invoiceId, data) => api.put(`/api/sales/invoices/${invoiceId}`, data),
  deleteInvoice: (invoiceId) => api.delete(`/api/sales/invoices/${invoiceId}`),
  rejectInvoice: (invoiceId) => api.put(`/api/sales/invoices/${invoiceId}/reject`),
  postInvoice: (invoiceId) => api.put(`/api/sales/invoices/${invoiceId}/post`),
  recordPartialPayment: (invoiceId, paymentAmount) => 
    api.put(`/api/sales/invoices/${invoiceId}/partial-payment`, null, { params: { paymentAmount } }),

  // Invoice Taxes
  getInvoiceTax: (invoiceId, taxId) => api.get(`/api/sales/invoices/${invoiceId}/taxes/${taxId}`),
  updateInvoiceTax: (invoiceId, taxId, data) => 
    api.put(`/api/sales/invoices/${invoiceId}/taxes/${taxId}`, data),
  deleteInvoiceTax: (invoiceId, taxId) => 
    api.delete(`/api/sales/invoices/${invoiceId}/taxes/${taxId}`),
}
