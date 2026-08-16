import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { pushToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('bookcircle_user')
    const token = localStorage.getItem('bookcircle_token')

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = async (values) => {
    try {
      const res = await authService.login(values)

      // res = { token, user }
      localStorage.setItem('bookcircle_token', res.token)
      localStorage.setItem('bookcircle_user', JSON.stringify(res.user))

      setUser(res.user)

      pushToast('success', 'Logged in successfully')
      return res.user

    } catch (error) {
      console.error('Login error:', error)
      pushToast('error', error)
      return null
    }
  }

  const register = async (values) => {
    try {
      await authService.register(values)

      pushToast('success', 'Account created successfully')
      return true

    } catch (error) {
      console.error('Register error:', error)
      pushToast('error', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('bookcircle_token')
    localStorage.removeItem('bookcircle_user')
    sessionStorage.removeItem('has_seen_welcome')
    setUser(null)
    pushToast('success', 'Logged out')
    navigate('/login')
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    setUser,
    isAuthenticated: !!user
  }), [user, loading])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#76ffd9' }}>
        Loading BookCircle...
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)