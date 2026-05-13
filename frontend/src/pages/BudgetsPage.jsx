import { useEffect, useState } from 'react'
import { budgetAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import BudgetCard from '../components/BudgetCard'
import Modal from '../components/Modal'
import { CATEGORIES, MONTH_NAMES, formatCurrency } from '../utils/helpers'
import { Plus, Target } from 'lucide-react'
import toast from 'react-hot-toast'

const now = new Date()

export default function BudgetsPage() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    category: '',
    amount: '',
    month: now.getMonth(),
    year: now.getFullYear(),
  })
  const [saving, setSaving] = useState(false)

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const { data } = await budgetAPI.getAll({ month: form.month, year: form.year })
      setBudgets(data.data)
    } catch {
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [form.month, form.year])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.category || !form.amount) return toast.error('Fill all fields')
    setSaving(true)
    try {
      await budgetAPI.upsert({ ...form, amount: parseFloat(form.amount) })
      toast.success('Budget saved!')
      setShowModal(false)
      fetchBudgets()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await budgetAPI.delete(id)
      toast.success('Budget removed')
      fetchBudgets()
    } catch {
      toast.error('Failed to delete budget')
    }
  }

  const totalBudget = budgets.reduce((a, b) => a + b.amount, 0)
  const totalSpent = budgets.reduce((a, b) => a + (b.spent || 0), 0)
  const currency = user?.currency || 'USD'

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white">Budgets</h1>
          <p className="text-slate-400 mt-1">Set and track your spending limits</p>
        </div>
        <button id="add-budget-btn" onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} />
          Set Budget
        </button>
      </div>

      {/* Month Selector */}
      <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Month:</label>
          <select
            value={form.month}
            onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
            className="select-field w-36"
          >
            {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Year:</label>
          <select
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="select-field w-28"
          >
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {budgets.length > 0 && (
          <div className="ml-auto flex gap-6 text-sm">
            <div>
              <span className="text-slate-400">Total Budget: </span>
              <span className="font-bold text-white">{formatCurrency(totalBudget, currency)}</span>
            </div>
            <div>
              <span className="text-slate-400">Total Spent: </span>
              <span className={`font-bold ${totalSpent > totalBudget ? 'text-danger-400' : 'text-success-400'}`}>
                {formatCurrency(totalSpent, currency)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Budget Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-surface-300 rounded w-32 mb-4" />
              <div className="h-2 bg-surface-300 rounded w-full" />
            </div>
          ))}
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div key={budget._id} className="relative group">
              <BudgetCard budget={budget} currency={currency} />
              <button
                onClick={() => handleDelete(budget._id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity
                           text-xs text-danger-400 hover:text-danger-300 bg-surface-400 px-2 py-1 rounded-lg"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <Target size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No budgets set for this month</p>
          <p className="text-slate-500 text-sm mt-1">Click "Set Budget" to create your first budget</p>
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Set Budget" size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="select-field"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Budget Amount ({currency})</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="e.g. 500"
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center" disabled={saving}>
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
