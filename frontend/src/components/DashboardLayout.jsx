import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  GraduationCap, Users, PlusCircle, LogOut,
  ChevronRight, LayoutDashboard, Bell, Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import useCursor from '../hooks/useCursor'

const NAV = [
  { to: '/teachers',     icon: GraduationCap, label: 'Teachers',    desc: 'Faculty records' },
  { to: '/teachers/add', icon: PlusCircle,    label: 'Add Teacher', desc: 'New faculty' },
  { to: '/users',        icon: Users,         label: 'Auth Users',  desc: 'Accounts' },
]

export default function DashboardLayout() {
  useCursor()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully.')
    navigate('/login')
  }

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase()
    : '?'

  const pageTitle = NAV.find(n => location.pathname === n.to)?.label ?? 'Dashboard'

  return (
    <>
      <div id="cursor-dot" /><div id="cursor-ring" />
      <div className="flex h-screen bg-surface-50 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-surface-200 flex flex-col shadow-[1px_0_0_#e2e8f0]">

          {/* Logo */}
          <div className="px-5 h-16 flex items-center border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-btn flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-ink-900 leading-none">TeachPortal</div>
                <div className="text-[10px] text-ink-400 font-mono mt-0.5">v1.0.0</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <p className="text-[10px] font-mono text-ink-400 uppercase tracking-widest px-3 mb-3">Menu</p>
            <div className="space-y-0.5">
              {NAV.map(({ to, icon: Icon, label, desc }) => (
                <NavLink
                  key={to} to={to}
                  end={to === '/teachers'}
                  className={({ isActive }) => `nav-item group ${isActive ? 'active' : ''}`}
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150
                        ${isActive ? 'bg-brand-100' : 'bg-surface-100 group-hover:bg-surface-200'}`}>
                        <Icon className={`w-4 h-4 nav-icon transition-colors ${isActive ? 'text-brand-600' : 'text-ink-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium leading-none mb-0.5 ${isActive ? 'text-brand-700' : ''}`}>{label}</div>
                        <div className="text-[10px] text-ink-400">{desc}</div>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* User */}
          <div className="px-3 pb-4 border-t border-surface-100 pt-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50 transition-colors group">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-xs font-bold font-mono">{initials}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-ink-800 truncate leading-none mb-0.5">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-[11px] text-ink-400 truncate font-mono">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="text-ink-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-8 flex-shrink-0">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4 text-ink-400" />
              <span className="text-ink-400 text-sm">/</span>
              <span className="text-sm font-semibold text-ink-800">{pageTitle}</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Quick search…"
                  className="bg-surface-50 border border-surface-200 rounded-xl pl-8 pr-4 py-2 text-sm text-ink-700
                             placeholder-ink-400 focus:outline-none focus:border-brand-400 focus:shadow-glow
                             transition-all duration-200 w-52"
                />
              </div>
              {/* Bell */}
              <button className="relative w-9 h-9 rounded-xl bg-surface-50 border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors">
                <Bell className="w-4 h-4 text-ink-500" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
              </button>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-sm cursor-pointer">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
