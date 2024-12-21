import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete axios.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    if (response.data.token) {
      setAuthToken(response.data.token)
    }
    return response.data
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData)
    if (response.data.token) {
      setAuthToken(response.data.token)
    }
    return response.data
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setAuthToken(null)
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      return true
    }
    return false
  }
}

export default authService 