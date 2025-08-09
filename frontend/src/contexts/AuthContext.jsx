import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/authApi'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('github_token')
    const storedUser = localStorage.getItem('github_user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    
    setLoading(false)
  }, [])

  const login = async (code) => {
    try {
      setLoading(true)
      const response = await authApi.exchangeCode(code)
      
      setToken(response.accessToken)
      setUser(response.user)
      
      localStorage.setItem('github_token', response.accessToken)
      localStorage.setItem('github_user', JSON.stringify(response.user))
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('github_token')
    localStorage.removeItem('github_user')
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}