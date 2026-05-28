import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosInstance'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token, user, refreshToken } = response.data
      
      // Persist tokens
      localStorage.setItem('authToken', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      localStorage.setItem('user', JSON.stringify(user))
      
      // Update axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return { user, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint if available
      try {
        await api.post('/api/auth/logout')
      } catch (err) {
        console.log('Logout API call failed, clearing local data')
      }
      
      // Clear tokens and user data
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      
      // Clear axios header
      delete api.defaults.headers.common['Authorization']
      
      return null
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed')
    }
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        return rejectWithValue('No token found')
      }
      
      // Verify token is still valid
      const response = await api.get('/api/auth/me')
      return { user: response.data, token }
    } catch (error) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      return rejectWithValue('Token validation failed')
    }
  }
)

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('authToken') || null,
  loading: false,
  error: null,
  isInitialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
        state.isInitialized = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isInitialized = true
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.loading = false
        state.error = null
        state.isInitialized = true
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isInitialized = true
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isInitialized = true
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isInitialized = true
      })
  },
})

export const { clearError, setInitialized } = authSlice.actions
export default authSlice.reducer
