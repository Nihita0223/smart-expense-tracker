import { CATEGORY_COLORS, CATEGORY_ICONS, formatCurrency } from '../utils/helpers'
import { AlertTriangle } from 'lucide-react'

export default function BudgetCard({ budget, currency = 'USD' }) {
  const { category, amount, spent = 0, remaining = 0, percentage = 0 } = budget

  const isOverBudget = percentage >= 100
  const isWarning = percentage >= 80 && percentage < 100

  const barColor = isOverBudget
    ? 'bg-danger-500'
    : isWarning
    ? 'bg-accent-500'
    : 'bg-primary-500'

  return (
    <div className="card-hover p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CATEGORY_ICONS[category] || '📌'}</span>
          <div>
            <p className="font-semibold text-white text-sm">{category}</p>
            <p className="text-xs text-slate-500">
              {formatCurrency(spent, currency)} of {formatCurrency(amount, currency)}
            </p>
          </div>
        </div>
        <div className="text-right">
          {isOverBudget ? (
            <div className="flex items-center gap-1 text-danger-400 text-xs font-semibold">
              <AlertTriangle size={12} />
              Over budget
            </div>
          ) : (
            <p className="text-sm font-bold text-white">{Math.round(percentage)}%</p>
          )}
          <p className={`text-xs ${remaining < 0 ? 'text-danger-400' : 'text-slate-400'}`}>
            {remaining < 0
              ? `${formatCurrency(Math.abs(remaining), currency)} over`
              : `${formatCurrency(remaining, currency)} left`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-surface-400 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
