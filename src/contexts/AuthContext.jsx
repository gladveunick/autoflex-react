import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

  // Initialiser le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      setToken(token)
    }
    setLoading(false)
  }, [])

  // Configurer axios pour inclure le token dans toutes les requêtes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password })
      const token = response.data.token
      if (token) {
        localStorage.setItem('token', token)
        setIsAuthenticated(true)
        setToken(token)
        return response
      }
      throw new Error('Token non reçu')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    } finally {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      setIsAuthenticated(false)
      setToken(null)
    }
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 