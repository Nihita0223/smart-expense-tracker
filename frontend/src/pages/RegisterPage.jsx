import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', currency: 'USD' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const result = await register(form)
    if (result.success) {
      toast.success('Account created! Welcome 🎉')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-glow mb-4">
            <Wallet size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">Start tracking your expenses today</p>
        </div>

        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            <div>
              <label className="label">Full Name</label>
              <input
                id="register-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="select-field">
                {[
                  ['USD', '🇺🇸 US Dollar'],
                  ['EUR', '🇪🇺 Euro'],
                  ['GBP', '🇬🇧 British Pound'],
                  ['INR', '🇮🇳 Indian Rupee'],
                  ['CAD', '🇨🇦 Canadian Dollar'],
                  ['AUD', '🇦🇺 Australian Dollar'],
                  ['JPY', '🇯🇵 Japanese Yen'],
                ].map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn-primary w-full justify-center py-3 text-base mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
