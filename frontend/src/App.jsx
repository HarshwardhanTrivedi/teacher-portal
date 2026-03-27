import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './components/DashboardLayout'
import TeachersPage from './pages/TeachersPage'
import UsersPage    from './pages/UsersPage'
import AddTeacherPage from './pages/AddTeacherPage'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/teachers" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={
          <PublicRoute><LoginPage /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><RegisterPage /></PublicRoute>
        } />

        <Route path="/" element={
          <PrivateRoute><DashboardLayout /></PrivateRoute>
        }>
          <Route path="teachers"     element={<TeachersPage />} />
          <Route path="teachers/add" element={<AddTeacherPage />} />
          <Route path="users"        element={<UsersPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
