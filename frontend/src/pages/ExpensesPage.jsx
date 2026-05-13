import { useEffect, useState, useCallback } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { useAuth } from '../context/AuthContext'
import ExpenseTable from '../components/ExpenseTable'
import Modal from '../components/Modal'
import ExpenseForm from '../components/ExpenseForm'
import { CATEGORIES } from '../utils/helpers'
import { Plus, Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ExpensesPage() {
  const { expenses, loading, pagination, fetchExpenses, removeExpense } = useExpenses()
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    startDate: '',
    endDate: '',
  })

  const loadExpenses = useCallback(() => {
    const params = { page, limit: 15 }
    if (filters.category) params.category = filters.category
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    fetchExpenses(params)
  }, [page, filters, fetchExpenses])

  useEffect(() => {
    loadExpenses()
  }, [loadExpenses])

  const handleDelete = async (id) => {
    try {
      await removeExpense(id)
      toast.success('Expense deleted')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete expense')
    }
  }

  const clearFilters = () => {
    setFilters({ search: '', category: '', startDate: '', endDate: '' })
    setPage(1)
  }

  const hasFilters = filters.category || filters.startDate || filters.endDate

  // Client-side search filter
  const filtered = filters.search
    ? expenses.filter(
        (e) =>
          e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.category.toLowerCase().includes(filters.search.toLowerCase())
      )
    : expenses

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white">Expenses</h1>
          <p className="text-slate-400 mt-1">
            {pagination?.total ?? '—'} total expenses
          </p>
        </div>
        <button id="add-expense-btn" onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              id="expense-search"
              type="text"
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field pl-9"
            />
          </div>

          <select
            id="expense-category-filter"
            value={filters.category}
            onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setPage(1) }}
            className="select-field"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => { setFilters({ ...filters, startDate: e.target.value }); setPage(1) }}
            className="input-field"
            placeholder="Start date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => { setFilters({ ...filters, endDate: e.target.value }); setPage(1) }}
            className="input-field"
            placeholder="End date"
          />
        </div>

        {hasFilters && (
          <button onClick={clearFilters} className="mt-3 flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
            Loading expenses...
          </div>
        ) : (
          <ExpenseTable
            expenses={filtered}
            onEdit={(e) => setEditExpense(e)}
            onDelete={(id) => setDeleteId(id)}
            currency={user?.currency}
          />
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            <p className="text-sm text-slate-400">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-3 py-2 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-secondary px-3 py-2 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Expense">
        <ExpenseForm onSuccess={() => { setShowAddModal(false); loadExpenses() }} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editExpense} onClose={() => setEditExpense(null)} title="Edit Expense">
        {editExpense && (
          <ExpenseForm
            expense={editExpense}
            onSuccess={() => { setEditExpense(null); loadExpenses() }}
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense" size="sm">
        <p className="text-slate-400 mb-6">Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1 justify-center">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
