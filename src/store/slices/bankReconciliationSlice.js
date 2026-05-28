import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bankService } from '../../api/services'

export const fetchReconciliationData = createAsyncThunk(
  'bankReconciliation/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bankService.getReconciliation(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reconciliation')
    }
  }
)

export const saveReconciliation = createAsyncThunk(
  'bankReconciliation/save',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bankService.saveReconciliation(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save reconciliation')
    }
  }
)

const initialState = {
  reconciliation: {
    bankBalance: 0,
    bookBalance: 0,
    deposits: [],
    checks: [],
  },
  loading: false,
  error: null,
  saved: false,
}

const bankReconciliationSlice = createSlice({
  name: 'bankReconciliation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSavedStatus: (state) => {
      state.saved = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReconciliationData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReconciliationData.fulfilled, (state, action) => {
        state.loading = false
        state.reconciliation = action.payload
      })
      .addCase(fetchReconciliationData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch reconciliation'
      })
      .addCase(saveReconciliation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(saveReconciliation.fulfilled, (state, action) => {
        state.loading = false
        state.reconciliation = action.payload
        state.saved = true
      })
      .addCase(saveReconciliation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to save reconciliation'
      })
  },
})

export const { clearError, clearSavedStatus } = bankReconciliationSlice.actions
export default bankReconciliationSlice.reducer
