import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reportService } from '../../api/services'

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (params, { rejectWithValue }) => {
    try {
      const response = await reportService.listReports(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports')
    }
  }
)

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async ({ reportType, format, params }, { rejectWithValue }) => {
    try {
      const response = await reportService.generateReport(reportType, format, params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report')
    }
  }
)

const initialState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  generatedAt: null,
}

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false
        state.reports = action.payload.reports || action.payload || []
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch reports'
      })
      .addCase(generateReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false
        state.currentReport = action.payload
        state.generatedAt = new Date().toISOString()
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to generate report'
      })
  },
})

export const { clearError, setCurrentReport } = reportsSlice.actions
export default reportsSlice.reducer
