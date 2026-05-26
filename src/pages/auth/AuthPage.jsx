import { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { DEMO_ACCOUNTS } from '../../data/mockData'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: params.get('role') || 'customer',
  })

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const result = isLogin
      ? login(form.email, form.password)
      : signup(form)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const role = result.user.role
    if (role === 'vendor') navigate('/vendor', { replace: true })
    else if (role === 'admin') navigate('/admin', { replace: true })
    else navigate(from, { replace: true })
  }

  const fillDemo = (type) => {
    const d = DEMO_ACCOUNTS[type]
    setForm((f) => ({ ...f, email: d.email, password: d.password, role: type === 'vendor' ? 'vendor' : type === 'admin' ? 'admin' : 'customer' }))
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-ink lg:block">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1200&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
      </div>
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2">
        <Link to="/" className="font-display text-2xl font-semibold">LuxeMarket</Link>
        <h1 className="mt-8 font-display text-3xl font-semibold">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="mt-2 text-ink-muted">
          {isLogin ? 'Sign in to your account' : 'Join as customer or vendor'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {!isLogin && (
            <>
              <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div>
                <label className="mb-2 block text-sm font-medium">Account type</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-luxe-200 px-4 py-2.5"
                >
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor (Seller)</option>
                </select>
              </div>
            </>
          )}
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <div className="mt-6 rounded-xl bg-luxe-100 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">Demo accounts</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['customer', 'vendor', 'admin'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => fillDemo(t)}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium capitalize hover:bg-luxe-50"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-luxe-700 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
