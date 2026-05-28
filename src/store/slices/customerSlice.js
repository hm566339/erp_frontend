import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { customerService } from '../../api/services'

export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerService.listCustomers(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const getCustomerDetail = createAsyncThunk(
  'customer/getCustomerDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomer(id)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const initialState = {
  customers: [],
  detail: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.customers = action.payload.data || action.payload || []
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch customers'
      })
      .addCase(getCustomerDetail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getCustomerDetail.fulfilled, (state, action) => {
        state.loading = false
        state.detail = action.payload
      })
      .addCase(getCustomerDetail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch customer'
      })
      .addCase(createCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false
        state.customers.unshift(action.payload)
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to create customer'
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false
        const index = state.customers.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.customers[index] = action.payload
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to update customer'
      })
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false
        state.customers = state.customers.filter((c) => c.id !== action.payload)
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to delete customer'
      })
  },
})

export const { clearError } = customerSlice.actions
export default customerSlice.reducer
