import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { GraduationCap, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'
import useCursor from '../hooks/useCursor'

function FloatingInput({ label, name, type = 'text', value, onChange, icon: Icon, rightEl, required = true }) {
  const [focused, setFocused] = useState(false)
  const filled = value.length > 0
  return (
    <div className={`
      relative border rounded-xl transition-all duration-200 bg-white
      ${focused ? 'border-brand-400 shadow-glow' : 'border-surface-200 hover:border-surface-300'}
    `}>
      {Icon && (
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-brand-500' : 'text-ink-400'}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        name={name} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder=" " className="w-full bg-transparent px-4 py-4 pl-10 pr-10 text-sm text-ink-900 placeholder-transparent focus:outline-none"
        required={required}
      />
      <label className={`absolute left-10 transition-all duration-200 pointer-events-none origin-left
        ${focused || filled ? 'top-1.5 text-[10px] font-semibold tracking-wide text-brand-500' : 'top-1/2 -translate-y-1/2 text-sm text-ink-400'}`}>
        {label}
      </label>
      {rightEl && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>}
    </div>
  )
}

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase',     ok: /[A-Z]/.test(password) },
    { label: 'Number',        ok: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="flex gap-3 mt-2">
      {checks.map(({ label, ok }) => (
        <div key={label} className={`flex items-center gap-1 text-[11px] transition-colors duration-200 ${ok ? 'text-emerald-600' : 'text-ink-400'}`}>
          <CheckCircle2 className={`w-3 h-3 ${ok ? 'text-emerald-500' : 'text-ink-300'}`} />
          {label}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  useCursor()
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '', password: '', confirm_password: '' })
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [mounted, setMounted]   = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match.'); return }
    setLoading(true)
    try {
      const { confirm_password, ...payload } = form
      const res = await register(payload)
      saveAuth(res.data.data.user, res.data.data.token)
      toast.success('Account created! 🎉')
      navigate('/teachers')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).forEach((m) => toast.error(m))
      else toast.error(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const delay = (n) => `transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`

  return (
    <>
      <div id="cursor-dot" /><div id="cursor-ring" />
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6 relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />

        <div className="relative w-full max-w-lg">
          {/* Logo */}
          <div className={`flex items-center gap-3 mb-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-btn">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-ink-900">TeachPortal</span>
          </div>

          <div className={`card p-8 transition-all duration-600 delay-75 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-ink-900 mb-1">Create your account</h2>
              <p className="text-ink-500 text-sm">Join the faculty management portal</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {/* Name row */}
              <div className={`grid grid-cols-2 gap-3 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FloatingInput label="First name" name="first_name" value={form.first_name} onChange={handle} icon={User} />
                <FloatingInput label="Last name"  name="last_name"  value={form.last_name}  onChange={handle} icon={User} />
              </div>

              <div className={`transition-all duration-500 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FloatingInput label="Email address" name="email" type="email" value={form.email} onChange={handle} icon={Mail} />
              </div>

              <div className={`transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FloatingInput
                  label="Password" name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handle} icon={Lock}
                  rightEl={
                    <button type="button" onClick={() => setShowPass(v => !v)} className="text-ink-400 hover:text-brand-500 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                <PasswordStrength password={form.password} />
              </div>

              <div className={`transition-all duration-500 delay-[250ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FloatingInput
                  label="Confirm password" name="confirm_password" type={showConf ? 'text' : 'password'}
                  value={form.confirm_password} onChange={handle} icon={Lock}
                  rightEl={
                    <button type="button" onClick={() => setShowConf(v => !v)} className="text-ink-400 hover:text-brand-500 transition-colors">
                      {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <div className={`pt-1 transition-all duration-500 delay-[300ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</> : <>Create account<ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          </div>

          <p className={`text-center text-sm text-ink-500 mt-5 transition-all duration-500 delay-[350ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors underline underline-offset-2">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  )
}
