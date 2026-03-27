import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { PlusCircle, ArrowLeft, Loader2, User, Building2, BookOpen, Phone, FileText, Lock, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createTeacher } from '../services/api'

const CURRENT_YEAR = new Date().getFullYear()

const defaultForm = {
  email: '', first_name: '', last_name: '', password: '', confirm_password: '',
  university_name: '', gender: '', year_joined: '', department: '', phone: '', bio: '',
}

function FloatingInput({ label, name, type = 'text', placeholder, value, onChange, icon: Icon, rightEl, required = true, as: Tag = 'input', children }) {
  const [focused, setFocused] = useState(false)
  const filled = String(value).length > 0
  return (
    <div>
      <label className="text-xs font-semibold text-ink-600 uppercase tracking-wider block mb-1.5">{label}</label>
      <div className={`relative border rounded-xl bg-white transition-all duration-200
        ${focused ? 'border-brand-400 shadow-glow' : 'border-surface-200 hover:border-surface-300'}`}>
        {Icon && (
          <div className={`absolute left-3.5 top-3.5 transition-colors ${focused ? 'text-brand-500' : 'text-ink-400'}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        {Tag === 'input' ? (
          <input
            name={name} type={type} value={value} onChange={onChange}
            placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className={`w-full bg-transparent px-4 py-3.5 text-sm text-ink-900 focus:outline-none placeholder-ink-300 ${Icon ? 'pl-10' : ''} ${rightEl ? 'pr-10' : ''}`}
            required={required}
          />
        ) : (
          <select
            name={name} value={value} onChange={onChange}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className={`w-full bg-transparent px-4 py-3.5 text-sm text-ink-900 focus:outline-none appearance-none ${Icon ? 'pl-10' : ''}`}
            required={required}
          >
            {children}
          </select>
        )}
        {rightEl && <div className="absolute right-3.5 top-3.5">{rightEl}</div>}
      </div>
    </div>
  )
}

function Section({ number, title, icon: Icon, children, delay = 0 }) {
  return (
    <div
      className="card overflow-hidden"
      style={{ opacity: 0, animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}
    >
      <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-3 bg-surface-50/50">
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono">
          {number}
        </div>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-ink-500" />
          <span className="text-sm font-semibold text-ink-800">{title}</span>
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )
}

export default function AddTeacherPage() {
  const navigate = useNavigate()
  const [form, setForm]         = useState(defaultForm)
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
      payload.year_joined = parseInt(payload.year_joined)
      await createTeacher(payload)
      toast.success('Teacher added successfully! 🎉')
      navigate('/teachers')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) Object.values(errors).forEach((m) => toast.error(m))
      else toast.error(err.response?.data?.message || 'Failed to create teacher.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className={`flex items-center gap-3 mb-7 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <button onClick={() => navigate('/teachers')}
          className="w-9 h-9 rounded-xl border border-surface-200 flex items-center justify-center text-ink-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all duration-150">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono font-medium text-brand-600 uppercase tracking-widest">Faculty / New</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Add New Teacher</h1>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Section number="01" title="Account Information" icon={User} delay={100}>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="First Name" name="first_name" placeholder="Jane"     icon={User} value={form.first_name} onChange={handle} />
            <FloatingInput label="Last Name"  name="last_name"  placeholder="Doe"      icon={User} value={form.last_name}  onChange={handle} />
          </div>
          <FloatingInput label="Email Address" name="email" type="email" placeholder="jane@university.edu" icon={Mail} value={form.email} onChange={handle} />
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Password" name="password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
              icon={Lock} value={form.password} onChange={handle}
              rightEl={<button type="button" onClick={() => setShowPass(v=>!v)} className="text-ink-400 hover:text-brand-500 transition-colors">{showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>}
            />
            <FloatingInput
              label="Confirm Password" name="confirm_password" type={showConf ? 'text' : 'password'} placeholder="Repeat"
              icon={Lock} value={form.confirm_password} onChange={handle}
              rightEl={<button type="button" onClick={() => setShowConf(v=>!v)} className="text-ink-400 hover:text-brand-500 transition-colors">{showConf ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}</button>}
            />
          </div>
        </Section>

        <Section number="02" title="Teacher Details" icon={BookOpen} delay={180}>
          <FloatingInput label="University Name" name="university_name" placeholder="e.g. MIT" icon={Building2} value={form.university_name} onChange={handle} />
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Department" name="department" placeholder="e.g. Computer Science" icon={BookOpen} value={form.department} onChange={handle} />
            <FloatingInput label="Year Joined" name="year_joined" type="number" placeholder={String(CURRENT_YEAR)} value={form.year_joined} onChange={handle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Gender" name="gender" as="select" icon={User} value={form.gender} onChange={handle}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </FloatingInput>
            <FloatingInput label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" icon={Phone} required={false} value={form.phone} onChange={handle} />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-600 uppercase tracking-wider block mb-1.5">
              <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Bio <span className="text-ink-400 normal-case font-normal">(optional)</span></span>
            </label>
            <textarea
              name="bio" value={form.bio} onChange={handle}
              placeholder="Short faculty bio…" rows={3}
              className="w-full bg-white border border-surface-200 rounded-xl px-4 py-3 text-sm text-ink-900
                         placeholder-ink-300 focus:outline-none focus:border-brand-400 focus:shadow-glow
                         transition-all duration-200 resize-none hover:border-surface-300"
            />
          </div>
        </Section>

        {/* Actions */}
        <div
          className="flex gap-3"
          style={{ opacity: 0, animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) 260ms forwards` }}
        >
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><PlusCircle className="w-4 h-4" />Add Teacher</>}
          </button>
          <button type="button" onClick={() => navigate('/teachers')} className="btn-ghost px-6">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
