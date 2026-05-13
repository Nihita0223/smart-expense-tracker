import { createContext, useContext, useReducer, useCallback } from 'react'
import { expenseAPI } from '../api'

const ExpenseContext = createContext(null)

const initialState = {
  expenses: [],
  stats: null,
  pagination: null,
  loading: false,
  statsLoading: false,
  error: null,
}

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_STATS_LOADING':
      return { ...state, statsLoading: action.payload }
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload.data, pagination: action.payload.pagination, loading: false }
    case 'SET_STATS':
      return { ...state, stats: action.payload, statsLoading: false }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((e) => (e._id === action.payload._id ? action.payload : e)),
      }
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((e) => e._id !== action.payload) }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState)

  const fetchExpenses = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { data } = await expenseAPI.getAll(params)
      dispatch({ type: 'SET_EXPENSES', payload: data })
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to load expenses' })
    }
  }, [])

  const fetchStats = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_STATS_LOADING', payload: true })
    try {
      const { data } = await expenseAPI.getStats(params)
      dispatch({ type: 'SET_STATS', payload: data.data })
    } catch (err) {
      dispatch({ type: 'SET_STATS_LOADING', payload: false })
    }
  }, [])

  const addExpense = async (expenseData) => {
    const { data } = await expenseAPI.create(expenseData)
    dispatch({ type: 'ADD_EXPENSE', payload: data.data })
    return data.data
  }

  const editExpense = async (id, expenseData) => {
    const { data } = await expenseAPI.update(id, expenseData)
    dispatch({ type: 'UPDATE_EXPENSE', payload: data.data })
    return data.data
  }

  const removeExpense = async (id) => {
    await expenseAPI.delete(id)
    dispatch({ type: 'DELETE_EXPENSE', payload: id })
  }

  return (
    <ExpenseContext.Provider
      value={{ ...state, fetchExpenses, fetchStats, addExpense, editExpense, removeExpense }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider')
  return ctx
}
