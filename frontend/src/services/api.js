import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('github_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('github_token')
      localStorage.removeItem('github_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api