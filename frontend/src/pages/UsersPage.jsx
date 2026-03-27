import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { Users, Search, RefreshCw, CheckCircle2, XCircle, UserCheck, UserX, Building2 } from 'lucide-react'
import { getUsers } from '../services/api'
import { SkeletonTable, SkeletonCard } from '../components/Skeleton'
import useTilt from '../hooks/useTilt'

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const tilt = useTilt(6)
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="stat-card cursor-default"
      style={{ opacity: 0, animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-${color}-100 blur-2xl opacity-50`} />
      <div className={`w-10 h-10 rounded-2xl bg-${color}-50 border border-${color}-100 flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div className="font-display text-3xl font-bold text-ink-900 mb-1">{value}</div>
      <div className="text-sm text-ink-600 font-medium">{label}</div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers]       = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [mounted, setMounted]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsers()
      setUsers(res.data.data ?? [])
    } catch {
      toast.error('Failed to load users.')
    } finally {
      setLoading(false)
      setMounted(true)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(!q ? users : users.filter(u =>
      `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q)
    ))
  }, [search, users])

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'
  const active   = users.filter(u => u.is_active).length
  const withProf = users.filter(u => u.teacher_id).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xs font-mono font-medium text-emerald-600 uppercase tracking-widest">System</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Auth Users</h1>
          <p className="text-ink-500 text-sm mt-0.5">{users.length} registered accounts</p>
        </div>
        <button onClick={load} disabled={loading} className="btn-ghost px-3.5 py-2.5">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={Users}     label="Total Users"        value={users.length} color="brand"   delay={0}   />
            <StatCard icon={UserCheck} label="Active Accounts"    value={active}       color="emerald" delay={80}  />
            <StatCard icon={UserX}     label="Inactive Accounts"  value={users.length - active} color="red" delay={160} />
            <StatCard icon={Building2} label="With Teacher Profile" value={withProf}   color="violet"  delay={240} />
          </>
        )}
      </div>

      {/* Table */}
      <div className={`card overflow-hidden transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="bg-surface-50 border border-surface-200 rounded-xl pl-8 pr-4 py-2 text-sm
                         placeholder-ink-400 focus:outline-none focus:border-brand-400 focus:shadow-glow
                         transition-all duration-200 w-64 text-ink-700"
            />
          </div>
          {search && <span className="badge-brand text-xs">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Teacher Profile</th>
                <th>University</th>
                <th>Registered</th>
              </tr>
            </thead>
            {loading ? (
              <SkeletonTable rows={5} />
            ) : filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-ink-400">
                      <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
                        <Users className="w-7 h-7 text-ink-300" />
                      </div>
                      <p className="text-sm font-medium text-ink-600">{search ? 'No matches found' : 'No users yet'}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} style={{ animation: `fade-up 0.4s ease ${i * 40}ms both` }}>
                    <td><span className="font-mono text-xs text-ink-400 bg-surface-100 px-1.5 py-0.5 rounded">{String(i+1).padStart(2,'0')}</span></td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-[11px] font-bold">
                            {u.first_name?.[0]}{u.last_name?.[0]}
                          </span>
                        </div>
                        <span className="font-semibold text-ink-800 text-sm">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-ink-500">{u.email}</span></td>
                    <td>
                      {u.is_active
                        ? <span className="badge-green flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" />Active</span>
                        : <span className="badge-red   flex items-center gap-1 w-fit"><XCircle      className="w-3 h-3" />Inactive</span>}
                    </td>
                    <td>
                      {u.teacher_id
                        ? <span className="badge-brand w-fit">Linked</span>
                        : <span className="badge-slate w-fit">None</span>}
                    </td>
                    <td><span className="text-sm text-ink-600">{u.university_name ?? <span className="text-ink-300">—</span>}</span></td>
                    <td><span className="font-mono text-xs text-ink-400">{fmt(u.created_at)}</span></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-surface-100">
            <span className="text-xs text-ink-400 font-mono">Showing {filtered.length} of {users.length} records</span>
          </div>
        )}
      </div>
    </div>
  )
}
