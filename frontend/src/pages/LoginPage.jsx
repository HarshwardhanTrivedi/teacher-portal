import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, GraduationCap, Sparkles, Users, TrendingUp, Shield } from 'lucide-react'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'
import useCursor from '../hooks/useCursor'

// Premium glassmorphism stat card
const STAT_COLORS = {
  indigo: {
    iconBg:   'rgba(99,102,241,0.22)',
    iconBdr:  'rgba(99,102,241,0.35)',
    iconClr:  '#a5b4fc',
    glow:     'rgba(99,102,241,0.45)',
    bar:      'linear-gradient(90deg,#818cf8,#c4b5fd)',
  },
  violet: {
    iconBg:   'rgba(139,92,246,0.22)',
    iconBdr:  'rgba(139,92,246,0.35)',
    iconClr:  '#c4b5fd',
    glow:     'rgba(139,92,246,0.45)',
    bar:      'linear-gradient(90deg,#a78bfa,#e879f9)',
  },
  emerald: {
    iconBg:   'rgba(16,185,129,0.22)',
    iconBdr:  'rgba(16,185,129,0.35)',
    iconClr:  '#6ee7b7',
    glow:     'rgba(16,185,129,0.45)',
    bar:      'linear-gradient(90deg,#34d399,#6ee7b7)',
  },
}

function StatCard({ icon: Icon, label, value, color = 'indigo', delay = 0, barWidth = '80%' }) {
  const c = STAT_COLORS[color]
  return (
    <div
      className="animate-float flex-1"
      style={{ animationDelay: `${delay}s`, animationDuration: `${4.5 + delay * 0.8}s` }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderRadius: '18px',
        padding: '14px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.09)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle inner highlight */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:'1px',
          background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)',
        }}/>

        {/* Top row: icon + live dot */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <div style={{
            width:'32px', height:'32px',
            background: c.iconBg,
            border: `1px solid ${c.iconBdr}`,
            borderRadius:'10px',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: `0 0 14px ${c.glow}`,
          }}>
            <Icon style={{ width:'15px', height:'15px', color: c.iconClr }} />
          </div>
          {/* Live pulse */}
          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            <div style={{
              width:'6px', height:'6px', borderRadius:'50%',
              background:'#34d399',
              boxShadow:'0 0 8px rgba(52,211,153,0.9)',
              animation:'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
            }}/>
          </div>
        </div>

        {/* Value */}
        <div style={{
          fontSize:'22px', fontWeight:800, color:'#fff',
          lineHeight:1, letterSpacing:'-0.5px', marginBottom:'3px', fontVariantNumeric:'tabular-nums',
        }}>{value}</div>

        {/* Label */}
        <div style={{
          fontSize:'10px', color:'rgba(255,255,255,0.5)',
          fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'10px',
        }}>{label}</div>

        {/* Progress bar */}
        <div style={{ height:'3px', borderRadius:'99px', background:'rgba(255,255,255,0.1)', overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:'99px',
            background: c.bar,
            width: barWidth,
            boxShadow: `0 0 8px ${c.glow}`,
          }}/>
        </div>
      </div>
    </div>
  )
}

// Animated input with floating label — premium hover/focus design
function FloatingInput({ label, name, type = 'text', value, onChange, icon: Icon, rightEl }) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const filled = value.length > 0

  return (
    <div className="relative group" style={{ perspective: '600px' }}>
      {/* Outer glow halo — visible on hover & focus */}
      <div
        className="absolute -inset-[3px] rounded-[14px] pointer-events-none transition-all duration-500"
        style={{
          background: focused
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)'
            : hovered
            ? 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.4))'
            : 'transparent',
          opacity: focused ? 1 : hovered ? 0.7 : 0,
          filter: focused ? 'blur(6px)' : 'blur(8px)',
          borderRadius: '14px',
        }}
      />

      {/* Gradient border ring */}
      <div
        className="absolute -inset-[1.5px] rounded-[13px] pointer-events-none transition-all duration-300"
        style={{
          background: focused
            ? 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)'
            : hovered
            ? 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.5))'
            : 'linear-gradient(135deg, #e2e8f0, #e2e8f0)',
          borderRadius: '13px',
          opacity: focused || hovered ? 1 : 0.6,
        }}
      />

      {/* Inner field */}
      <div
        className="relative rounded-xl bg-white transition-all duration-300"
        style={{
          transform: focused ? 'translateY(-1px)' : hovered ? 'translateY(-0.5px)' : 'translateY(0)',
          boxShadow: focused
            ? '0 4px 24px rgba(99,102,241,0.18), 0 1px 4px rgba(0,0,0,0.06)'
            : hovered
            ? '0 2px 12px rgba(99,102,241,0.10)'
            : '0 1px 3px rgba(0,0,0,0.04)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {Icon && (
          <div
            className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              color: focused ? '#6366f1' : hovered ? '#8b5cf6' : '#94a3b8',
              transform: `translateY(-50%) scale(${focused ? 1.1 : 1})`,
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          className="w-full bg-transparent px-4 py-4 pl-10 pr-10 text-sm text-ink-900
                     placeholder-transparent focus:outline-none peer"
          required
        />

        <label
          className="absolute left-10 pointer-events-none origin-left transition-all duration-200"
          style={{
            ...(focused || filled
              ? { top: '6px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', color: focused ? '#6366f1' : '#64748b' }
              : { top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#94a3b8' }),
          }}
        >
          {label}
        </label>

        {rightEl && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  useCursor()
  const navigate = useNavigate()
  const { saveAuth } = useAuth()
  const [form, setForm]           = useState({ email: '', password: '' })
  const [loading, setLoading]     = useState(false)
  const [showPass, setShowPass]   = useState(false)
  const [mounted, setMounted]     = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    setTimeout(() => setMounted(true), 50)
  }, [])

  // Subtle particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dots.forEach((d) => {
        d.x += d.dx; d.y += d.dy
        if (d.x < 0 || d.x > canvas.width)  d.dx *= -1
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99,102,241,${d.alpha})`
        ctx.fill()
      })
      // Draw connecting lines
      dots.forEach((a, i) => {
        dots.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      saveAuth(res.data.data.user, res.data.data.token)
      toast.success('Welcome back! 👋')
      navigate('/teachers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Custom cursor */}
      <div id="cursor-dot" />
      <div id="cursor-ring" />

      <div className="min-h-screen flex bg-surface-50 overflow-hidden">

        {/* ── Left: Visual panel ── */}
        <div className="hidden lg:flex lg:w-[52%] relative bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 flex-col justify-between p-14 overflow-hidden">
          {/* Particle canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

          {/* Blob shapes */}
          <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white/5 animate-blob rounded-full blur-xl" />
          <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 bg-brand-400/20 animate-blob rounded-full blur-xl" style={{ animationDelay: '4s' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage:'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize:'40px 40px' }}
          />

          {/* Logo */}
          <div className={`relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-white text-xl font-bold tracking-tight">TeachPortal</span>
            </div>
          </div>

          {/* Hero text */}
          <div className={`relative z-10 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-brand-200" />
              <span className="text-brand-200 text-xs font-semibold tracking-widest uppercase">Faculty Management</span>
            </div>
            <h1 className="font-display text-5xl font-bold text-white leading-[1.1] mb-5">
              Where great<br />
              <span className="text-brand-200">teachers</span><br />
              are managed.
            </h1>
            <p className="text-brand-200/80 text-sm leading-relaxed max-w-xs">
              A unified portal to manage university faculty, track records, and streamline onboarding.
            </p>
          </div>

          {/* Glassmorphism stat cards */}
          <div className={`relative z-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div style={{ display:'flex', gap:'10px' }}>
              <StatCard icon={TrendingUp} label="Uptime"    value="99.9%" color="indigo"  delay={0}   barWidth="99%" />
              <StatCard icon={Users}      label="Faculty"   value="500+"  color="violet"  delay={0.5} barWidth="85%" />
              <StatCard icon={Shield}     label="Secured"   value="100%" color="emerald" delay={1.0} barWidth="100%" />
            </div>
          </div>

          {/* Bottom row */}
          <div className={`relative z-10 transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 bg-white/10 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">{['JD','AM','SR'][i]}</span>
                </div>
              ))}
              <span className="text-brand-200/70 text-xs">Trusted by 500+ educators</span>
            </div>
          </div>
        </div>

        {/* ── Right: Form panel ── */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[400px]">

            {/* Mobile logo */}
            <div className={`flex lg:hidden items-center gap-2.5 mb-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">TeachPortal</span>
            </div>

            {/* Heading */}
            <div className={`mb-8 transition-all duration-500 delay-[50ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="font-display text-3xl font-bold text-ink-900 mb-1.5">Welcome back</h2>
              <p className="text-ink-500 text-sm">Sign in to your faculty dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-4">
              <div className={`transition-all duration-500 delay-[100ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FloatingInput
                  label="Email address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  icon={Mail}
                />
              </div>

              <div className={`transition-all duration-500 delay-[150ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <FloatingInput
                  label="Password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  icon={Lock}
                  rightEl={
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="text-ink-400 hover:text-brand-500 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <div className={`pt-1 transition-all duration-500 delay-[200ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className={`flex items-center gap-3 my-6 transition-all duration-500 delay-[250ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex-1 h-px bg-surface-200" />
              <span className="text-xs text-ink-400">or</span>
              <div className="flex-1 h-px bg-surface-200" />
            </div>

            <div className={`transition-all duration-500 delay-[300ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-center text-sm text-ink-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors underline underline-offset-2">
                  Create account
                </Link>
              </p>
            </div>

            {/* Trust badges */}
            <div className={`mt-10 flex items-center justify-center gap-6 transition-all duration-500 delay-[350ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              {['JWT Secured', 'MySQL Backend', 'CodeIgniter 4'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-ink-400 font-mono">{t}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
