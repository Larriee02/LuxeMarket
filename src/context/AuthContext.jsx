import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initialUsers } from '../data/mockData'

const AuthContext = createContext(null)
const USERS_KEY = 'luxe_users'
const SESSION_KEY = 'luxe_session'

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : initialUsers
  })
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  const login = useCallback((email, password) => {
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password' }
    const { password: _, ...safe } = found
    setUser(safe)
    return { ok: true, user: safe }
  }, [users])

  const signup = useCallback((data) => {
    if (users.some((u) => u.email === data.email)) {
      return { ok: false, error: 'Email already registered' }
    }
    const newUser = {
      id: `u-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role || 'customer',
      vendorId: data.role === 'vendor' ? `v-${Date.now()}` : undefined,
      avatar: null,
    }
    setUsers((prev) => [...prev, newUser])
    const { password: _, ...safe } = newUser
    setUser(safe)
    return { ok: true, user: safe }
  }, [users])

  const logout = useCallback(() => setUser(null), [])

  const updateUser = useCallback((updates) => {
    setUsers((prev) => prev.map((u) => (u.id === user?.id ? { ...u, ...updates } : u)))
    setUser((prev) => (prev ? { ...prev, ...updates } : null))
  }, [user?.id])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, users, setUsers, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
