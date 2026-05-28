import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { loginUser, logoutUser, checkAuthStatus } from '../store/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, token, loading, error, isInitialized } = useSelector((state) => state.auth)

  const isAuthenticated = !!token && !!user

  // Check auth status on mount
  useEffect(() => {
    if (!isInitialized && token) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, isInitialized, token])

  const login = useCallback(
    (email, password) => {
      return dispatch(loginUser({ email, password }))
    },
    [dispatch]
  )

  const logout = useCallback(() => {
    return dispatch(logoutUser())
  }, [dispatch])

  const checkStatus = useCallback(() => {
    return dispatch(checkAuthStatus())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isInitialized,
    login,
    logout,
    checkStatus,
  }
}
