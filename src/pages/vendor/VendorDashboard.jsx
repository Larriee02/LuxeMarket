import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { useOrders } from '../../context/OrderContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { formatPrice, getStockStatus } from '../../utils/helpers'
import { CATEGORIES } from '../../data/mockData'

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const emptyProduct = {
  name: '',
  brand: '',
  category: 'clothing',
  price: 0,
  compareAt: null,
  description: '',
  images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c462?w=800&h=1000&fit=crop'],
  sizes: ['S', 'M', 'L'],
  colors: [{ name: 'Black', hex: '#1a1a1a' }],
  stock: 10,
  lowStockThreshold: 5,
}

export default function VendorDashboard() {
  const { user, logout } = useAuth()
  const { products, addProduct, updateProduct, deleteProduct, getVendorProducts } = useProducts()
  const { getVendorOrders, updateOrderStatus } = useOrders()
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyProduct)

  const vendorId = user?.vendorId || 'v1'
  const myProducts = getVendorProducts(vendorId)
  const myOrders = getVendorOrders(vendorId)

  const revenue = myOrders.reduce((s, o) => s + (o.status !== 'rejected' ? o.subtotal : 0), 0)
  const lowStock = myProducts.filter((p) => getStockStatus(p) === 'low')
  const outOfStock = myProducts.filter((p) => getStockStatus(p) === 'out')

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    return months.map((m, i) => ({
      month: m,
      revenue: Math.round(revenue * (0.15 + i * 0.18)),
      orders: Math.round(myOrders.length * (0.2 + i * 0.15)),
    }))
  }, [revenue, myOrders.length])

  const bestSellers = [...myProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)

  const openForm = (product = null) => {
    if (product) {
      setEditing(product.id)
      setForm({ ...product })
    } else {
      setEditing('new')
      setForm({ ...emptyProduct, brand: user?.name || 'My Brand', vendorId })
    }
  }

  const saveProduct = () => {
    if (editing === 'new') {
      addProduct({ ...form, vendorId })
    } else {
      updateProduct(editing, form)
    }
    setEditing(null)
    setForm(emptyProduct)
  }

  return (
    <div className="flex min-h-screen bg-luxe-50">
      <aside className="hidden w-64 shrink-0 border-r border-luxe-200 bg-white p-6 lg:block">
        <Link to="/" className="font-display text-xl font-semibold">LuxeMarket</Link>
        <p className="mt-1 text-xs text-ink-faint">Vendor Dashboard</p>
        <nav className="mt-8 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                tab === id ? 'bg-ink text-white' : 'text-ink-muted hover:bg-luxe-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 text-sm text-ink-muted hover:text-ink">
          Sign out
        </button>
      </aside>

      <main className="flex-1 overflow-auto p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 lg:hidden">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            className="rounded-xl border border-luxe-200 px-3 py-2"
          >
            {NAV.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Overview</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Revenue', value: formatPrice(revenue) },
                { label: 'Orders', value: myOrders.length },
                { label: 'Products', value: myProducts.length },
                { label: 'Low stock', value: lowStock.length, warn: true },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-luxe-200 bg-white p-5">
                  <p className="text-sm text-ink-muted">{s.label}</p>
                  <p className={`mt-1 text-2xl font-semibold ${s.warn ? 'text-amber-600' : ''}`}>{s.value}</p>
                </div>
              ))}
            </div>
            {(lowStock.length > 0 || outOfStock.length > 0) && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle size={18} />
                  <span className="font-medium">Inventory alerts</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-amber-900">
                  {lowStock.map((p) => (
                    <li key={p.id}>{p.name} — only {p.stock} left</li>
                  ))}
                  {outOfStock.map((p) => (
                    <li key={p.id}>{p.name} — out of stock</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between">
              <h1 className="font-display text-3xl font-semibold">Products</h1>
              <Button onClick={() => openForm()}>
                <Plus size={16} /> Add product
              </Button>
            </div>
            {editing && (
              <div className="mt-6 rounded-2xl border border-luxe-200 bg-white p-6">
                <h2 className="font-medium">{editing === 'new' ? 'New product' : 'Edit product'}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-luxe-200 px-3 py-2"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                  <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                  <Input label="Image URL" value={form.images?.[0] || ''} onChange={(e) => setForm({ ...form, images: [e.target.value] })} />
                  <div className="sm:col-span-2">
                    <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={saveProduct}>Save</Button>
                  <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                </div>
              </div>
            )}
            <div className="mt-6 overflow-x-auto rounded-2xl border border-luxe-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-luxe-100 text-left text-ink-muted">
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myProducts.map((p) => {
                    const st = getStockStatus(p)
                    return (
                      <tr key={p.id} className="border-b border-luxe-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            {p.name}
                          </div>
                        </td>
                        <td className="p-4">{formatPrice(p.price)}</td>
                        <td className="p-4">{p.stock}</td>
                        <td className="p-4">
                          <Badge variant={st === 'out' ? 'danger' : st === 'low' ? 'warning' : 'success'}>
                            {st === 'out' ? 'Out' : st === 'low' ? 'Low' : 'In stock'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => openForm(p)} className="text-ink-muted hover:text-ink"><Pencil size={16} /></button>
                            <button onClick={() => deleteProduct(p.id)} className="text-red-500"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Orders</h1>
            <div className="mt-6 space-y-4">
              {myOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-luxe-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm">{order.id}</p>
                      <p className="text-sm text-ink-muted">{order.items.map((i) => i.name).join(', ')}</p>
                    </div>
                    <Badge>{order.status}</Badge>
                  </div>
                  <p className="mt-2 font-semibold">{formatPrice(order.total)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateOrderStatus(order.id, 'accepted')}>Accept</Button>
                        <Button size="sm" variant="danger" onClick={() => updateOrderStatus(order.id, 'rejected')}>Reject</Button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped')}>Mark shipped</Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark delivered</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="font-display text-3xl font-semibold">Sales analytics</h1>
            <div className="mt-6 rounded-2xl border border-luxe-200 bg-white p-6">
              <h2 className="font-medium">Revenue overview</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatPrice(v)} />
                    <Area type="monotone" dataKey="revenue" stroke="#7d6249" fill="#e6ddd2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-luxe-200 bg-white p-6">
                <h2 className="font-medium">Order trends</h2>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Bar dataKey="orders" fill="#9a7b5c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-luxe-200 bg-white p-6">
                <h2 className="font-medium">Best-selling products</h2>
                <ul className="mt-4 space-y-3">
                  {bestSellers.map((p, i) => (
                    <li key={p.id} className="flex items-center justify-between text-sm">
                      <span>{i + 1}. {p.name}</span>
                      <span className="text-ink-muted">{p.reviewCount} sales</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
