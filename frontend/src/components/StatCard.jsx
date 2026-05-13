import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'text-primary-400 bg-primary-500/10',
    success: 'text-success-400 bg-success-500/10',
    danger: 'text-danger-400 bg-danger-500/10',
    accent: 'text-accent-400 bg-accent-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  }

  const trendColor =
    trend > 0 ? 'text-danger-400' : trend < 0 ? 'text-success-400' : 'text-slate-400'
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus

  return (
    <div className="stat-card card-hover group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={14} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1 tracking-tight">{value}</p>
        {(trendLabel || subtitle) && (
          <p className="text-xs text-slate-500 mt-1">{trendLabel || subtitle}</p>
        )}
      </div>
    </div>
  )
}
