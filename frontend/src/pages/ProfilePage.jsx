import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api'
import { User, Save, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

const CURRENCIES = [
  { value: 'USD', label: '🇺🇸 US Dollar' },
  { value: 'EUR', label: '🇪🇺 Euro' },
  { value: 'GBP', label: '🇬🇧 British Pound' },
  { value: 'INR', label: '🇮🇳 Indian Rupee' },
  { value: 'CAD', label: '🇨🇦 Canadian Dollar' },
  { value: 'AUD', label: '🇦🇺 Australian Dollar' },
  { value: 'JPY', label: '🇯🇵 Japanese Yen' },
]

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', currency: user?.currency || 'USD' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await authAPI.updateProfile(form)
      updateUser(data.data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account settings</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-glow">
          {initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-slate-400">{user?.email}</p>
          <span className="badge bg-primary-500/15 text-primary-400 border border-primary-500/20 mt-2">
            {user?.currency}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
        <h2 className="section-title mb-5 flex items-center gap-2">
          <User size={18} className="text-primary-400" />
          Edit Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" id="profile-form">
          <div>
            <label className="label">Full Name</label>
            <input
              id="profile-name"
              name="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="label flex items-center gap-1.5">
              <Globe size={14} /> Default Currency
            </label>
            <select
              id="profile-currency"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="select-field"
            >
              {CURRENCIES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={user?.email}
              className="input-field opacity-50 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <button
            id="profile-save-btn"
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
