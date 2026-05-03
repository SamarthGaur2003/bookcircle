import axios from 'axios'

let baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
if (baseUrl.includes('localhost') && window.location.hostname !== 'localhost') {
  baseUrl = baseUrl.replace('localhost', window.location.hostname)
}

const api = axios.create({
  baseURL: baseUrl,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bookcircle_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const res = response.data

    if (res.status === "success") {
      return res.data
    } else {
      return Promise.reject(res.message)
    }
  },
  (error) => {
    console.error('API Error:', error)

    if (error.response?.status === 401) {
      localStorage.removeItem('bookcircle_token')
      window.location.href = '/login'
    }

    return Promise.reject(
      error.response?.data?.message || "Something went wrong"
    )
  }
)

export default api