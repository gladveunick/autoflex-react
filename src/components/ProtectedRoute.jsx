import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
} 