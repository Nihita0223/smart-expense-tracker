import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ExpenseProvider } from './context/ExpenseContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ExpensesPage from './pages/ExpensesPage'
import BudgetsPage from './pages/BudgetsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="expenses" element={<ExpensesPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ExpenseProvider>
    </AuthProvider>
  )
}
