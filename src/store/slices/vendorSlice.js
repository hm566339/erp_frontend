import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { vendorService } from '../../api/services'

export const fetchVendors = createAsyncThunk(
  'vendor/fetchVendors',
  async (params, { rejectWithValue }) => {
    try {
      const response = await vendorService.listVendors(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getVendorDetail = createAsyncThunk(
  'vendor/getVendorDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vendorService.getVendor(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createVendor = createAsyncThunk(
  'vendor/createVendor',
  async (data, { rejectWithValue }) => {
    try {
      const response = await vendorService.createVendor(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateVendor = createAsyncThunk(
  'vendor/updateVendor',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await vendorService.updateVendor(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteVendor = createAsyncThunk(
  'vendor/deleteVendor',
  async (id, { rejectWithValue }) => {
    try {
      await vendorService.deleteVendor(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  vendors: [],
  detail: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false
        state.vendors = action.payload.data || action.payload || []
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch vendors'
      })
      .addCase(getVendorDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getVendorDetail.fulfilled, (state, action) => {
        state.loading = false
        state.detail = action.payload
      })
      .addCase(getVendorDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch vendor'
      })
      .addCase(createVendor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false
        state.vendors.unshift(action.payload)
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create vendor'
      })
      .addCase(updateVendor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false
        const index = state.vendors.findIndex((v) => v.id === action.payload.id)
        if (index !== -1) {
          state.vendors[index] = action.payload
        }
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update vendor'
      })
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false
        state.vendors = state.vendors.filter((v) => v.id !== action.payload)
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to delete vendor'
      })
  },
})

export const { clearError } = vendorSlice.actions
export default vendorSlice.reducer
