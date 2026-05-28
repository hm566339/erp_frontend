# API Implementation Gaps & To-Do List

## Quick Reference: What's Missing

### 🔴 12 API Endpoints NOT Implemented

#### Group 1: Vendor Advanced Filtering (8 endpoints) 
**Impact:** High - Affects vendor search functionality  
**Effort:** Low - Simple GET endpoints

```javascript
// TO DO: Add to vendorService.js

filterVendorByState: (state) => api.get(`/api/v1/vendors/state/${state}`),
filterVendorByCountry: (country) => api.get(`/api/v1/vendors/country/${country}`),
filterVendorByCity: (city) => api.get(`/api/v1/vendors/city/${city}`),
searchVendorByCode: (vendorCode) => api.get(`/api/v1/vendors/code/${vendorCode}`),
searchVendorByPAN: (pan) => api.get(`/api/v1/vendors/pan/${pan}`),
searchVendorByGSTIN: (gstin) => api.get(`/api/v1/vendors/gstin/${gstin}`),
advancedSearch: (params) => api.post('/api/v1/vendors/search', params),
getActiveVendors: (params) => api.get('/api/v1/vendors/active', { params }),
```

---

#### Group 2: Sales Invoice Reporting (2 endpoints)
**Impact:** Medium - Affects ReportsPage  
**Effort:** Medium - Requires data aggregation logic

```javascript
// TO DO: Add to reportService.js

getInvoiceSummary: (params) => api.get('/api/sales/invoices/reports/summary', { params }),
getCustomerInvoiceSummary: (customerId, params) => 
  api.get(`/api/sales/invoices/reports/customer/${customerId}/summary`, { params }),
```

---

#### Group 3: Status Filters & Toggles (2 endpoints)
**Impact:** Medium - Administrative features  
**Effort:** Low - Simple GET/POST endpoints

```javascript
// TO DO: Add to invoiceService.js
getInvoicesByStatus: (status, params) => 
  api.get(`/api/sales/invoices/status/${status}`, { params }),

// TO DO: Add to fiscalYearService.js
toggleFiscalYearStatus: (id) => 
  api.post(`/api/v1/fiscal-years/${id}/status`),

// TO DO: Add to accountingPeriodService.js
toggleAccountingPeriodStatus: (id) => 
  api.post(`/api/v1/accounting-periods/${id}/toggle-status`),
```

---

#### Group 4: AP Partial Payments (1 endpoint)
**Impact:** Medium - Completes AP module functionality  
**Effort:** Low - Duplicate of SI partial payment

```javascript
// TO DO: Add to accountsPayableService.js

recordPartialPayment: (invoiceId, paymentAmount) =>
  api.put(`/api/ap/invoices/${id}/partial-payment`, null, 
    { params: { paymentAmount } }),
```

---

## Implementation Priority Matrix

| # | API Group | Priority | Effort | Impact | Est. Time |
|---|-----------|----------|--------|--------|-----------|
| 1 | Vendor Filtering | 🔴 High | Low | High | 30 min |
| 2 | AP Partial Payment | 🔴 High | Low | Medium | 15 min |
| 3 | Fiscal Year Status | 🟡 Medium | Low | Medium | 10 min |
| 4 | Period Status Toggle | 🟡 Medium | Low | Medium | 10 min |
| 5 | Sales Invoice Reporting | 🟡 Medium | Medium | Medium | 60 min |
| 6 | Invoice Status Filter | 🟡 Medium | Low | Medium | 15 min |
| 7 | Account Group Restore | 🟠 Low | Low | Low | 10 min |

**Total Estimated Implementation Time:** ~140 minutes (2.3 hours)

---

## File-by-File TODO

### src/api/services/vendorService.js
```javascript
// ADD THESE METHODS:
// ✅ Line 1-7 (COMPLETE)
// ❌ ADD:
export const vendorService = {
  // Existing methods...
  listVendors: (params) => api.get('/api/v1/vendors', { params }),
  getVendor: (id) => api.get(`/api/v1/vendors/${id}`),
  createVendor: (data) => api.post('/api/v1/vendors', data),
  updateVendor: (id, data) => api.put(`/api/v1/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/api/v1/vendors/${id}`),
  deactivateVendor: (id) => api.put(`/api/v1/vendors/${id}/deactivate`),
  activateVendor: (id) => api.put(`/api/v1/vendors/${id}/activate`),
  
  // MISSING - ADD THESE:
  filterByState: (state) => api.get(`/api/v1/vendors/state/${state}`),
  filterByCountry: (country) => api.get(`/api/v1/vendors/country/${country}`),
  filterByCity: (city) => api.get(`/api/v1/vendors/city/${city}`),
  searchByCode: (vendorCode) => api.get(`/api/v1/vendors/code/${vendorCode}`),
  searchByPAN: (pan) => api.get(`/api/v1/vendors/pan/${pan}`),
  searchByGSTIN: (gstin) => api.get(`/api/v1/vendors/gstin/${gstin}`),
  advancedSearch: (params) => api.post('/api/v1/vendors/search', params),
  getActiveOnly: (params) => api.get('/api/v1/vendors/active', { params }),
}
```

---

### src/api/services/invoiceService.js
```javascript
// ADD THESE METHODS:
export const invoiceService = {
  // Existing methods...
  
  // MISSING - ADD THESE:
  filterByStatus: (status, params) => 
    api.get(`/api/sales/invoices/status/${status}`, { params }),
}
```

---

### src/api/services/accountsPayableService.js
```javascript
// ⚠️  CURRENTLY A STUB - ENHANCE IT:
import api from '../axiosInstance'

export const accountsPayableService = {
  // Existing methods...
  
  // MISSING - ADD THIS:
  recordPartialPayment: (id, paymentAmount) =>
    api.put(`/api/ap/invoices/${id}/partial-payment`, null, 
      { params: { paymentAmount } }),
}
```

---

### src/api/services/reportService.js
```javascript
// ADD THESE METHODS:
export const reportService = {
  // MISSING - ADD THESE:
  getInvoiceSummary: (params) => 
    api.get('/api/sales/invoices/reports/summary', { params }),
  
  getCustomerInvoiceSummary: (customerId, params) => 
    api.get(`/api/sales/invoices/reports/customer/${customerId}/summary`, { params }),
}
```

---

### src/api/services/fiscalYearService.js
```javascript
// ADD THESE METHODS:
export const fiscalYearService = {
  // Existing methods...
  
  // MISSING - ADD THIS:
  toggleStatus: (id) => 
    api.post(`/api/v1/fiscal-years/${id}/status`),
}
```

---

### src/api/services/accountingPeriodService.js
```javascript
// ADD THESE METHODS:
export const accountingPeriodService = {
  // Existing methods...
  
  // MISSING - ADD THIS:
  toggleStatus: (id) => 
    api.post(`/api/v1/accounting-periods/${id}/toggle-status`),
}
```

---

## Quick Copy-Paste Solutions

### Add Vendor Filtering to vendorService.js
```javascript
// Add these lines to vendorService.js after line 11

filterByState: (state) => api.get(`/api/v1/vendors/state/${state}`),
filterByCountry: (country) => api.get(`/api/v1/vendors/country/${country}`),
filterByCity: (city) => api.get(`/api/v1/vendors/city/${city}`),
searchByCode: (vendorCode) => api.get(`/api/v1/vendors/code/${vendorCode}`),
searchByPAN: (pan) => api.get(`/api/v1/vendors/pan/${pan}`),
searchByGSTIN: (gstin) => api.get(`/api/v1/vendors/gstin/${gstin}`),
advancedSearch: (params) => api.post('/api/v1/vendors/search', params),
getActiveOnly: (params) => api.get('/api/v1/vendors/active', { params }),
```

---

## Testing Checklist

After implementing each API:

- [ ] Test vendor filtering by state
- [ ] Test vendor search by PAN/GSTIN
- [ ] Test vendor advanced search
- [ ] Test AP partial payment recording
- [ ] Test fiscal year status toggle
- [ ] Test accounting period status toggle
- [ ] Test invoice status filter
- [ ] Test invoice summary reports
- [ ] Test customer invoice summary

---

## Impact Assessment

### If NOT Implemented:
- ❌ Users cannot filter vendors by state/city/country
- ❌ Advanced vendor search unavailable
- ❌ AP module missing partial payment feature
- ❌ Reports page cannot show invoice summaries
- ❌ Cannot manage fiscal year/period status through UI

### After Implementation:
- ✅ Complete vendor management features
- ✅ Complete AP workflow
- ✅ Functional reporting module
- ✅ Administrative controls for periods
- ✅ Advanced filtering capabilities

---

## Maintenance Note

The file `API_USAGE_ANALYSIS_REPORT.md` contains a detailed breakdown of:
- All 97 API endpoints from OpenAPI spec
- Which ones are implemented (85) vs missing (12)
- Where each API is used in the codebase
- Detailed recommendations per module

Refer to it for complete documentation.
