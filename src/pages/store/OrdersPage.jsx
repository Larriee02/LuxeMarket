import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrderContext'
import { useProducts } from '../../context/ProductContext'
import { formatPrice, formatDate } from '../../utils/helpers'
import Badge from '../../components/ui/Badge'

const statusConfig = {
  pending: { icon: Clock, variant: 'warning', label: 'Pending' },
  accepted: { icon: Package, variant: 'default', label: 'Accepted' },
  shipped: { icon: Truck, variant: 'default', label: 'Shipped' },
  delivered: { icon: CheckCircle, variant: 'success', label: 'Delivered' },
  rejected: { icon: Clock, variant: 'danger', label: 'Rejected' },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { getCustomerOrders } = useOrders()
  const { getVendor } = useProducts()
  const orders = getCustomerOrders(user?.id || 'u1')

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Your orders</h1>
      <p className="mt-1 text-ink-muted">Track pending, shipped, and delivered orders</p>
      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="py-12 text-center text-ink-muted">No orders yet.</p>
        ) : (
          orders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.pending
            const vendor = getVendor(order.vendorId)
            return (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-luxe-200 bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-ink-faint">{order.id}</p>
                    <p className="mt-1 font-medium">{vendor?.name}</p>
                    <p className="text-sm text-ink-muted">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </div>
                <ul className="mt-4 space-y-2 border-t border-luxe-100 pt-4">
                  {order.items.map((item, j) => (
                    <li key={j} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-luxe-100 pt-4 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                {order.timeline && (
                  <div className="mt-6 flex gap-2 overflow-x-auto">
                    {['pending', 'accepted', 'shipped', 'delivered'].map((s) => {
                      const done = order.timeline.some((t) => t.status === s)
                      const StepIcon = statusConfig[s]?.icon || Clock
                      return (
                        <div
                          key={s}
                          className={`flex shrink-0 flex-col items-center rounded-lg px-3 py-2 text-xs ${
                            done ? 'bg-luxe-100 text-luxe-800' : 'bg-luxe-50 text-ink-faint'
                          }`}
                        >
                          <StepIcon size={16} className={done ? '' : 'opacity-40'} />
                          <span className="mt-1 capitalize">{s}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.article>
            )
          })
        )}
      </div>
    </div>
  )
}
