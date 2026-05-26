import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Package, DollarSign, ShoppingBag, Check, Ban, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { useOrders } from '../../context/OrderContext'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatPrice } from '../../utils/helpers'
import { CATEGORIES } from '../../data/mockData'

const COLORS = ['#7d6249', '#9a7b5c', '#b89d7e', '#d4c4b0']

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { products, vendors, deleteProduct, approveVendor, suspendVendor } = useProducts()
  const { orders } = useOrders()
  const [tab, setTab] = useState('analytics')

  const totalSales = orders.reduce((s, o) => s + (o.status !== 'rejected' ? o.total : 0), 0)
  const activeVendors = vendors.filter((v) => v.status === 'approved').length
  const pendingVendors = vendors.filter((v) => v.status === 'pending')

  const categoryData = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        name: c.label,
        value: products.filter((p) => p.category === c.id).length,
      })),
    [products]
  )

  return (
    <div className="flex min-h-screen bg-luxe-50">
      <aside className="w-64 shrink-0 border-r border-luxe-200 bg-ink p-6 text-luxe-50">
        <Link to="/" className="font-display text-xl font-semibold">LuxeMarket</Link>
        <p className="mt-1 text-xs text-luxe-300">Admin Panel</p>
        <nav className="mt-8 space-y-1">
          {['analytics', 'vendors', 'products', 'categories'].map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm capitalize transition ${
                tab === id ? 'bg-luxe-600' : 'hover:bg-white/10'
              }`}
            >
              {id}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 text-sm text-luxe-300 hover:text-white">
          Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {tab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Platform analytics</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Total sales', value: formatPrice(totalSales), icon: DollarSign },
                { label: 'Active vendors', value: activeVendors, icon: Users },
                { label: 'Total orders', value: orders.length, icon: ShoppingBag },
                { label: 'Products', value: products.length, icon: Package },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-luxe-200 bg-white p-5">
                  <Icon className="text-luxe-600" size={20} />
                  <p className="mt-2 text-sm text-ink-muted">{label}</p>
                  <p className="text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-luxe-200 bg-white p-6">
              <h2 className="font-medium">Products by category</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'vendors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Vendor management</h1>
            {pendingVendors.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-medium text-ink-muted">Pending approval</h2>
                <div className="mt-3 space-y-3">
                  {pendingVendors.map((v) => (
                    <div key={v.id} className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-sm text-ink-muted">{v.location}</p>
                      </div>
                      <Button size="sm" onClick={() => approveVendor(v.id)}>
                        <Check size={14} /> Approve
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-8 space-y-3">
              {vendors.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-xl border border-luxe-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <img src={v.avatar} alt="" className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <Badge variant={v.status === 'approved' ? 'success' : v.status === 'suspended' ? 'danger' : 'warning'}>
                        {v.status}
                      </Badge>
                    </div>
                  </div>
                  {v.status === 'approved' && (
                    <Button size="sm" variant="danger" onClick={() => suspendVendor(v.id)}>
                      <Ban size={14} /> Suspend
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Product moderation</h1>
            <div className="mt-6 space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-luxe-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-ink-muted">{p.brand}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'categories' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Category management</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <div key={c.id} className="rounded-2xl border border-luxe-200 bg-white p-6">
                  <h2 className="font-display text-xl font-semibold">{c.label}</h2>
                  <p className="mt-2 text-3xl font-semibold text-luxe-700">
                    {products.filter((p) => p.category === c.id).length}
                  </p>
                  <p className="text-sm text-ink-muted">products listed</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
