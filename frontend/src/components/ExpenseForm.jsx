import { useState } from 'react'
import toast from 'react-hot-toast'
import { useExpenses } from '../context/ExpenseContext'
import {
  CATEGORIES,
  PAYMENT_METHODS,
  formatDateInput,
} from '../utils/helpers'

const defaultForm = {
  title: '',
  amount: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  paymentMethod: 'Other',
  isRecurring: false,
  tags: '',
}

export default function ExpenseForm({ expense, onSuccess }) {
  const { addExpense, editExpense } = useExpenses()
  const [form, setForm] = useState(
    expense
      ? {
          ...expense,
          date: formatDateInput(expense.date),
          tags: expense.tags?.join(', ') || '',
        }
      : defaultForm
  )
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.amount || !form.category || !form.date) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      }

      if (expense) {
        await editExpense(expense._id, payload)
        toast.success('Expense updated!')
      } else {
        await addExpense(payload)
        toast.success('Expense added!')
      }
      onSuccess?.()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="label">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Grocery shopping"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Amount *</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Date *</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="label">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="select-field" required>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Payment Method</label>
          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="select-field">
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional notes..."
            rows={2}
            className="input-field resize-none"
          />
        </div>

        <div className="col-span-2">
          <label className="label">Tags (comma separated)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. groceries, weekly"
            className="input-field"
          />
        </div>

        <div className="col-span-2 flex items-center gap-3">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={form.isRecurring}
            onChange={handleChange}
            className="w-4 h-4 rounded accent-primary-500"
          />
          <label htmlFor="isRecurring" className="text-sm text-slate-300 cursor-pointer">
            Recurring expense
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? 'Saving...' : expense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  )
}
