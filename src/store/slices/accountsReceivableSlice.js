import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { accountsReceivableService } from '../../api/services'

export const fetchARInvoices = createAsyncThunk(
  'accountsReceivable/fetchInvoices',
  async (params, { rejectWithValue }) => {
    try {
      const response = await accountsReceivableService.listInvoices(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch AR invoices')
    }
  }
)

export const recordPayment = createAsyncThunk(
  'accountsReceivable/recordPayment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await accountsReceivableService.recordPayment(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to record payment')
    }
  }
)

const initialState = {
  invoices: [],
  loading: false,
  error: null,
  summary: {
    totalOutstanding: 0,
    totalOverdue: 0,
    totalCollected: 0,
  },
}

const accountsReceivableSlice = createSlice({
  name: 'accountsReceivable',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchARInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchARInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload.invoices || action.payload || []
        if (action.payload.summary) {
          state.summary = action.payload.summary
        }
      })
      .addCase(fetchARInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch AR invoices'
      })
      .addCase(recordPayment.pending, (state) => {
        state.loading = true
      })
      .addCase(recordPayment.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(recordPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to record payment'
      })
  },
})

export const { clearError } = accountsReceivableSlice.actions
export default accountsReceivableSlice.reducer
