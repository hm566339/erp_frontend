import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { invoiceService } from '../../api/services'

export const fetchInvoices = createAsyncThunk(
  'invoice/fetchInvoices',
  async (params, { rejectWithValue }) => {
    try {
      const response = await invoiceService.listInvoices(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getInvoiceDetail = createAsyncThunk(
  'invoice/getInvoiceDetail',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoice(invoiceId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createInvoice = createAsyncThunk(
  'invoice/createInvoice',
  async (data, { rejectWithValue }) => {
    try {
      const response = await invoiceService.createInvoice(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateInvoice = createAsyncThunk(
  'invoice/updateInvoice',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.updateInvoice(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteInvoice = createAsyncThunk(
  'invoice/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const rejectInvoice = createAsyncThunk(
  'invoice/rejectInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.rejectInvoice(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const postInvoice = createAsyncThunk(
  'invoice/postInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.postInvoice(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  invoices: [],
  detail: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
}

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetDetail: (state) => {
      state.detail = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload.data || action.payload || []
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch invoices'
      })
      // Get Invoice Detail
      .addCase(getInvoiceDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getInvoiceDetail.fulfilled, (state, action) => {
        state.loading = false
        state.detail = action.payload
      })
      .addCase(getInvoiceDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch invoice'
      })
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false
        state.invoices.unshift(action.payload)
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create invoice'
      })
      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false
        const index = state.invoices.findIndex((inv) => inv.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update invoice'
      })
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = state.invoices.filter((inv) => inv.id !== action.payload)
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to delete invoice'
      })
      // Reject Invoice
      .addCase(rejectInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex((inv) => inv.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        state.detail = action.payload
      })
      // Post Invoice
      .addCase(postInvoice.fulfilled, (state, action) => {
        const index = state.invoices.findIndex((inv) => inv.id === action.payload.id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        state.detail = action.payload
      })
  },
})

export const { clearError, resetDetail } = invoiceSlice.actions
export default invoiceSlice.reducer
