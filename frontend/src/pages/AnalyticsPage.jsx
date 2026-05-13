import { useEffect, useState } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { useAuth } from '../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts'
import {
  CATEGORY_COLORS,
  MONTH_NAMES,
  formatCurrency,
} from '../utils/helpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="card px-3 py-2 text-sm">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const { stats, statsLoading, fetchStats } = useExpenses()
  const { user } = useAuth()
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const currency = user?.currency || 'USD'

  useEffect(() => {
    fetchStats({ year: selectedYear })
  }, [selectedYear, fetchStats])

  const monthlyData = (stats?.monthlyTrend || []).map((m) => ({
    month: MONTH_NAMES[m._id - 1],
    total: m.total,
    count: m.count,
  }))

  const categoryData = (stats?.byCategory || []).map((c) => ({
    name: c._id,
    total: c.total,
    count: c.count,
  }))

  const years = [new Date().getFullYear() - 1, new Date().getFullYear()]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Deep insights into your spending patterns</p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="select-field w-32"
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6 h-72 animate-pulse">
              <div className="h-5 bg-surface-300 rounded w-40 mb-6" />
              <div className="h-48 bg-surface-300 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Monthly Trend Bar Chart */}
          <div className="card p-6">
            <h2 className="section-title mb-6">Monthly Spending — {selectedYear}</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} name="Total Spent" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">No data for {selectedYear}</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="card p-6">
              <h2 className="section-title mb-6">Category Breakdown</h2>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
              )}
            </div>

            {/* Category Bar Comparison */}
            <div className="card p-6">
              <h2 className="section-title mb-6">Top Categories</h2>
              {categoryData.length > 0 ? (
                <div className="space-y-3">
                  {categoryData.slice(0, 7).map((c) => {
                    const max = categoryData[0].total
                    const pct = (c.total / max) * 100
                    return (
                      <div key={c.name} className="flex items-center gap-3">
                        <div className="w-28 text-xs text-slate-400 truncate">{c.name}</div>
                        <div className="flex-1 h-2 bg-surface-400 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: CATEGORY_COLORS[c.name] || '#6366f1',
                            }}
                          />
                        </div>
                        <div className="w-20 text-xs text-white text-right font-medium">
                          {formatCurrency(c.total, currency)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
              )}
            </div>
          </div>

          {/* Transaction Count Line Chart */}
          <div className="card p-6">
            <h2 className="section-title mb-6">Transaction Count per Month</h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="card px-3 py-2 text-sm">
                          <p className="text-slate-400 text-xs">{label}</p>
                          <p className="text-primary-400 font-medium">{payload[0].value} transactions</p>
                        </div>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: '#f97316', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Transactions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500">No data for {selectedYear}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
