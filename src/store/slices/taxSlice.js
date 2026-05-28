import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { taxService } from '../../api/services'

export const fetchTaxData = createAsyncThunk(
  'tax/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      const response = await taxService.listTaxReturns(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tax data')
    }
  }
)

export const generateTaxReturn = createAsyncThunk(
  'tax/generateReturn',
  async (params, { rejectWithValue }) => {
    try {
      const response = await taxService.generateReturn(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate tax return')
    }
  }
)

const initialState = {
  returns: [],
  loading: false,
  error: null,
  summary: {
    totalTaxable: 0,
    totalTax: 0,
    taxPaid: 0,
    taxDue: 0,
  },
}

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTaxData.fulfilled, (state, action) => {
        state.loading = false
        state.returns = action.payload.returns || action.payload || []
        if (action.payload.summary) {
          state.summary = action.payload.summary
        }
      })
      .addCase(fetchTaxData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch tax data'
      })
      .addCase(generateTaxReturn.pending, (state) => {
        state.loading = true
      })
      .addCase(generateTaxReturn.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(generateTaxReturn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to generate tax return'
      })
  },
})

export const { clearError } = taxSlice.actions
export default taxSlice.reducer
