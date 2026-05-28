import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Default Company ID - can be changed as needed
const DEFAULT_COMPANY_ID = import.meta.env.VITE_COMPANY_ID || '550e8400-e29b-41d4-a716-446655440000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add headers
api.interceptors.request.use(
  (config) => {
    // Add Company ID header for all requests
    config.headers['X-Company-Id'] = DEFAULT_COMPANY_ID
    
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message
    
    console.error('[API Error]', { status, message, data: error.response?.data })
    
    // Handle authentication errors
    if (status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    
    // Handle authorization errors
    if (status === 403) {
      console.warn('[API] Forbidden: User does not have permission')
    }
    
    return Promise.reject(error)
  }
)

export default api
