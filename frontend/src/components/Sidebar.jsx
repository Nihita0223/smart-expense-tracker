import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Receipt,
  Target,
  BarChart3,
  LogOut,
  Wallet,
  User,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/budgets', icon: Target, label: 'Budgets' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-100 border-r border-white/5 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow-sm">
            <Wallet size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">Smart Expense</h1>
            <p className="text-xs text-slate-500">Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-3">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout */}
      <div className="p-4 border-t border-white/5">
        <NavLink to="/profile" className={({ isActive }) => `nav-link mb-1 ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </NavLink>
        <button onClick={handleLogout} className="nav-link w-full text-danger-400 hover:text-danger-400 hover:bg-danger-500/10">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
