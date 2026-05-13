import { format, parseISO, isValid } from 'date-fns'

export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Healthcare',
  'Housing',
  'Education',
  'Travel',
  'Utilities',
  'Other',
]

export const PAYMENT_METHODS = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Bank Transfer', 'Other']

export const CATEGORY_COLORS = {
  'Food & Dining':    '#f97316',
  'Transportation':   '#6366f1',
  'Shopping':         '#ec4899',
  'Entertainment':    '#a855f7',
  'Healthcare':       '#22c55e',
  'Housing':          '#3b82f6',
  'Education':        '#eab308',
  'Travel':           '#14b8a6',
  'Utilities':        '#f43f5e',
  'Other':            '#94a3b8',
}

export const CATEGORY_ICONS = {
  'Food & Dining':    '🍔',
  'Transportation':   '🚗',
  'Shopping':         '🛍️',
  'Entertainment':    '🎬',
  'Healthcare':       '🏥',
  'Housing':          '🏠',
  'Education':        '📚',
  'Travel':           '✈️',
  'Utilities':        '⚡',
  'Other':            '📌',
}

export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, 'MMM d, yyyy') : '—'
}

export const formatDateInput = (date) => {
  if (!date) return ''
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, 'yyyy-MM-dd') : ''
}

export const getMonthLabel = (monthNum) => MONTH_NAMES[monthNum - 1] || ''

export const classNames = (...classes) => classes.filter(Boolean).join(' ')
