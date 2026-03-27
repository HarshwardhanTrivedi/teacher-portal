import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ──────────────────────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)
export const profile  = ()     => api.get('/profile')

// ─── Teachers ──────────────────────────────────────────────────────────
export const getTeachers    = ()       => api.get('/teachers')
export const getTeacher     = (id)     => api.get(`/teachers/${id}`)
export const createTeacher  = (data)   => api.post('/teachers', data)
export const updateTeacher  = (id, d)  => api.put(`/teachers/${id}`, d)
export const deleteTeacher  = (id)     => api.delete(`/teachers/${id}`)

// ─── Users ─────────────────────────────────────────────────────────────
export const getUsers = () => api.get('/users')

export default api
