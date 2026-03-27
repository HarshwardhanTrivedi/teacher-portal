import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  GraduationCap, PlusCircle, Trash2, Search, RefreshCw,
  Building2, Users, Calendar, TrendingUp, Filter
} from 'lucide-react'
import { getTeachers, deleteTeacher } from '../services/api'
import useTilt from '../hooks/useTilt'
import { SkeletonTable, SkeletonCard } from '../components/Skeleton'

const GENDER_BADGE = {
  male:   'badge-brand',
  female: 'badge-green',
  other:  'badge-amber',
}

function StatCard({ icon: Icon, label, value, sub, color = 'brand', delay = 0 }) {
  const tilt = useTilt(6)
  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="stat-card cursor-default"
      style={{ animationDelay: `${delay}ms`, opacity: 0, animation: `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms forwards` }}
    >
      {/* Glow spot */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-${color}-100 blur-2xl opacity-60`} />
      <div className={`w-10 h-10 rounded-2xl bg-${color}-50 border border-${color}-100 flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div className="font-display text-3xl font-bold text-ink-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-ink-700">{label}</div>
      {sub && <div className="text-xs text-ink-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function Avatar({ name }) {
  const [first, last] = name.split(' ')
  const initials = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase()
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-white text-[11px] font-bold">{initials}</span>
    </div>
  )
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [mounted, setMounted]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getTeachers()
      setTeachers(res.data.data ?? [])
    } catch {
      toast.error('Failed to load teachers.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(!q ? teachers : teachers.filter(t =>
      `${t.first_name} ${t.last_name} ${t.email} ${t.university_name} ${t.department}`.toLowerCase().includes(q)
    ))
  }, [search, teachers])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteTeacher(id)
      toast.success(`${name} removed.`)
      load()
    } catch {
      toast.error('Delete failed.')
    } finally {
      setDeleting(null)
    }
  }

  const universities = [...new Set(teachers.map(t => t.university_name).filter(Boolean))].length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="page-header">
        <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 bg-brand-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <span className="text-xs font-mono font-medium text-brand-600 uppercase tracking-widest">Faculty</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Teachers</h1>
          <p className="text-ink-500 text-sm mt-0.5">{teachers.length} faculty members registered</p>
        </div>
        <div className={`flex gap-2 transition-all duration-500 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <button onClick={load} disabled={loading} className="btn-ghost px-3.5 py-2.5">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/teachers/add" className="btn-primary">
            <PlusCircle className="w-4 h-4" /> Add Teacher
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard icon={Users}       label="Total Faculty"    value={teachers.length}  sub="All time"           delay={0}   />
            <StatCard icon={Building2}   label="Universities"     value={universities}      sub="Institutions"       delay={80}  color="emerald" />
            <StatCard icon={GraduationCap} label="Departments"    value={[...new Set(teachers.map(t => t.department))].length} sub="Unique" delay={160} color="violet" />
            <StatCard icon={TrendingUp}  label="Latest Cohort"    value={teachers.length ? Math.max(...teachers.map(t => t.year_joined)) : '—'} sub="Year joined" delay={240} color="amber" />
          </>
        )}
      </div>

      {/* Table card */}
      <div className={`card overflow-hidden transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Table toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, university, department…"
              className="bg-surface-50 border border-surface-200 rounded-xl pl-8 pr-4 py-2 text-sm
                         placeholder-ink-400 focus:outline-none focus:border-brand-400 focus:shadow-glow
                         transition-all duration-200 w-72 text-ink-700"
            />
          </div>
          <div className="flex items-center gap-2">
            {search && (
              <span className="badge-brand text-xs">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
            <button className="btn-ghost px-3 py-2 text-xs gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Faculty Member</th>
                <th>Email</th>
                <th>University</th>
                <th>Department</th>
                <th>Gender</th>
                <th>Year Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            {loading ? (
              <SkeletonTable rows={5} />
            ) : filtered.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-ink-400">
                      <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center">
                        <GraduationCap className="w-7 h-7 text-ink-300" />
                      </div>
                      <div>
                        <p className="font-medium text-ink-600 mb-1">{search ? 'No matches found' : 'No teachers yet'}</p>
                        <p className="text-xs text-ink-400">{search ? 'Try a different search term' : 'Add your first faculty member to get started'}</p>
                      </div>
                      {!search && (
                        <Link to="/teachers/add" className="btn-primary text-xs px-4 py-2 mt-1">
                          <PlusCircle className="w-3.5 h-3.5" /> Add Teacher
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t.id} style={{ animation: `fade-up 0.4s ease ${i * 40}ms both` }}>
                    <td><span className="font-mono text-xs text-ink-400 bg-surface-100 px-1.5 py-0.5 rounded">{String(i+1).padStart(2,'0')}</span></td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={`${t.first_name} ${t.last_name}`} />
                        <div>
                          <div className="font-semibold text-ink-800 text-sm leading-none mb-0.5">{t.first_name} {t.last_name}</div>
                          <div className="text-[11px] text-ink-400">{t.bio?.slice(0, 40) || 'Faculty member'}…</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-ink-500">{t.email}</span></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-ink-300 flex-shrink-0" />
                        <span className="text-sm text-ink-700">{t.university_name}</span>
                      </div>
                    </td>
                    <td><span className="badge-slate">{t.department}</span></td>
                    <td><span className={GENDER_BADGE[t.gender] ?? 'badge-slate'}>{t.gender}</span></td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-ink-300" />
                        <span className="font-mono text-sm text-ink-600">{t.year_joined}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(t.id, `${t.first_name} ${t.last_name}`)}
                        disabled={deleting === t.id}
                        className="btn-danger"
                      >
                        {deleting === t.id
                          ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-surface-100 flex items-center justify-between">
            <span className="text-xs text-ink-400 font-mono">
              Showing {filtered.length} of {teachers.length} records
            </span>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(3, Math.ceil(filtered.length / 10)))].map((_, i) => (
                <button key={i} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${i === 0 ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-surface-100'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
