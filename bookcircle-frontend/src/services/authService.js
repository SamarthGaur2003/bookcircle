import api from '../api/axios'

export const authService = {
  async login(payload) {
    return await api.post('/auth/login', payload)
  },

  async register(payload) {
    return await api.post('/auth/register', payload)
  },

  async me() {
    return await api.get('/user/me')
  }
}