import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../api'

const AuthContext = createContext(null)

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null }
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload))
      return { ...state, user: action.payload, token: action.payload.token, loading: false, error: null }
    case 'LOGOUT':
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { ...state, user: null, token: null, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'UPDATE_USER':
      const updated = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(updated))
      return { ...state, user: updated }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await authAPI.login(credentials)
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.data })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: msg })
      return { success: false, message: msg }
    }
  }

  const register = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await authAPI.register(credentials)
      dispatch({ type: 'LOGIN_SUCCESS', payload: data.data })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: msg })
      return { success: false, message: msg }
    }
  }

  const logout = () => dispatch({ type: 'LOGOUT' })

  const updateUser = (userData) => dispatch({ type: 'UPDATE_USER', payload: userData })

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
