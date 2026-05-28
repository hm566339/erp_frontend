import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth()
  
  // Still checking auth status
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Authenticated, render children
  return children
}
