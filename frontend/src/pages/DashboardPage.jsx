import { useEffect } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import Modal from '../components/Modal'
import ExpenseForm from '../components/ExpenseForm'
import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Target,
  Plus,
  ArrowRight,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import {
  formatCurrency,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  formatDate,
  MONTH_NAMES,
} from '../utils/helpers'
import { Link } from 'react-router-dom'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm">
        <p className="text-white font-medium">{payload[0].name}</p>
        <p className="text-primary-400">{formatCurrency(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { stats, statsLoading, fetchStats } = useExpenses()
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const pieData = stats?.byCategory?.map((c) => ({
    name: c._id,
    value: c.total,
  })) || []

  const trendData = (stats?.monthlyTrend || []).map((m) => ({
    month: MONTH_NAMES[m._id - 1],
    total: m.total,
  }))

  const currency = user?.currency || 'USD'

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hello, <span className="gradient-text">{user?.name?.split(' ')[0]} 👋</span>
          </h1>
          <p className="text-slate-400 mt-1">Here's your financial overview</p>
        </div>
        <button id="dashboard-add-expense" onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Stat Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-surface-300 mb-4" />
              <div className="h-4 bg-surface-300 rounded w-24 mb-2" />
              <div className="h-7 bg-surface-300 rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="This Month"
            value={formatCurrency(stats?.monthTotal || 0, currency)}
            icon={DollarSign}
            color="primary"
            subtitle="Total spending"
          />
          <StatCard
            title="Transactions"
            value={stats?.byCategory?.reduce((a, c) => a + c.count, 0) || 0}
            icon={Receipt}
            color="accent"
            subtitle="This month"
          />
          <StatCard
            title="Top Category"
            value={stats?.byCategory?.[0]?._id || '—'}
            icon={TrendingUp}
            color="purple"
            subtitle={stats?.byCategory?.[0] ? formatCurrency(stats.byCategory[0].total, currency) : 'No data'}
          />
          <StatCard
            title="Categories"
            value={stats?.byCategory?.length || 0}
            icon={Target}
            color="success"
            subtitle="Active this month"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend */}
        <div className="card p-6">
          <h2 className="section-title mb-6">Monthly Spending Trend</h2>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                  name="Spending"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              No spending data yet
            </div>
          )}
        </div>

        {/* Category Pie */}
        <div className="card p-6">
          <h2 className="section-title mb-6">Spending by Category</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
              No category data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Recent Expenses</h2>
          <Link to="/expenses" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {stats?.recent?.length ? (
          <div className="space-y-3">
            {stats.recent.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-300/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}15` }}
                  >
                    {CATEGORY_ICONS[expense.category] || '📌'}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{expense.title}</p>
                    <p className="text-xs text-slate-500">{expense.category} · {formatDate(expense.date)}</p>
                  </div>
                </div>
                <p className="font-bold text-white">{formatCurrency(expense.amount, currency)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm text-center py-8">No recent expenses</p>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Expense">
        <ExpenseForm
          onSuccess={() => {
            setShowAddModal(false)
            fetchStats()
          }}
        />
      </Modal>
    </div>
  )
}
