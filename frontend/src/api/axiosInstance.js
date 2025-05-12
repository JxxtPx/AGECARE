import axios from 'axios'

// Determine base URL
const hostname = window.location.hostname
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

const fallbackURL = isLocalhost
  ? 'http://localhost:5000/api'
  : `http://${hostname}:5000/api`

const baseURL = import.meta.env.VITE_API_URL || fallbackURL

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for 401 handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
