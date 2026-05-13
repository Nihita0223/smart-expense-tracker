import { CATEGORY_COLORS, CATEGORY_ICONS, formatCurrency } from '../utils/helpers'
import { formatDate } from '../utils/helpers'
import { Pencil, Trash2, RefreshCw } from 'lucide-react'

export default function ExpenseTable({ expenses, onEdit, onDelete, currency = 'USD' }) {
  if (!expenses.length) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium text-slate-400">No expenses found</p>
        <p className="text-sm mt-1">Add your first expense to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {['Title', 'Category', 'Amount', 'Date', 'Payment', 'Actions'].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {expenses.map((expense) => (
            <tr
              key={expense._id}
              className="group hover:bg-surface-300/40 transition-colors duration-150"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[expense.category] || '📌'}</span>
                  <div>
                    <p className="font-medium text-white">{expense.title}</p>
                    {expense.isRecurring && (
                      <span className="flex items-center gap-1 text-xs text-primary-400">
                        <RefreshCw size={10} /> Recurring
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span
                  className="badge"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[expense.category]}20`,
                    color: CATEGORY_COLORS[expense.category],
                    borderColor: `${CATEGORY_COLORS[expense.category]}30`,
                    border: '1px solid',
                  }}
                >
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3.5 font-bold text-white">
                {formatCurrency(expense.amount, currency)}
              </td>
              <td className="px-4 py-3.5 text-slate-400">{formatDate(expense.date)}</td>
              <td className="px-4 py-3.5 text-slate-400">{expense.paymentMethod}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 rounded-lg hover:bg-primary-500/20 text-primary-400 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="p-1.5 rounded-lg hover:bg-danger-500/20 text-danger-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
