import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { generalLedgerService } from '../../api/services'

export const fetchLedgerEntries = createAsyncThunk(
  'generalLedger/fetchEntries',
  async (params, { rejectWithValue }) => {
    try {
      const response = await generalLedgerService.listEntries(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch entries')
    }
  }
)

const initialState = {
  entries: [],
  loading: false,
  error: null,
  summary: {
    totalDebit: 0,
    totalCredit: 0,
    balance: 0,
  },
}

const generalLedgerSlice = createSlice({
  name: 'generalLedger',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLedgerEntries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLedgerEntries.fulfilled, (state, action) => {
        state.loading = false
        state.entries = action.payload.entries || action.payload || []
        if (action.payload.summary) {
          state.summary = action.payload.summary
        }
      })
      .addCase(fetchLedgerEntries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch entries'
      })
  },
})

export const { clearError } = generalLedgerSlice.actions
export default generalLedgerSlice.reducer
