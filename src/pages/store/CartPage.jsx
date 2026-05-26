import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useProducts } from '../../context/ProductContext'
import Button from '../../components/ui/Button'
import { formatPrice, groupCartByVendor } from '../../utils/helpers'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const { vendors } = useProducts()
  const groups = groupCartByVendor(items, vendors)

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-ink-muted">Discover our curated collection</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Shopping cart</h1>
      <p className="mt-1 text-ink-muted">Items from {groups.length} vendor{groups.length > 1 ? 's' : ''}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {groups.map((group) => (
            <motion.section
              key={group.vendor.id}
              layout
              className="rounded-2xl border border-luxe-200 bg-white p-6"
            >
              <Link
                to={`/vendor/${group.vendor.slug}`}
                className="mb-4 flex items-center gap-3 border-b border-luxe-100 pb-4"
              >
                <img src={group.vendor.avatar} alt="" className="h-8 w-8 rounded-full" />
                <span className="font-medium">{group.vendor.name}</span>
              </Link>
              {group.items.map((item) => (
                <motion.div
                  key={item.cartKey}
                  layout
                  className="flex gap-4 border-b border-luxe-50 py-4 last:border-0"
                >
                  <img src={item.image} alt="" className="h-24 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col">
                    <p className="text-xs text-ink-faint">{item.brand}</p>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-ink-muted">
                      {item.size}{item.color ? ` · ${item.color}` : ''}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-luxe-200">
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="p-2"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="p-2"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.cartKey)}
                    className="text-ink-faint hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </motion.section>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-luxe-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Shipping</span>
              <span className="text-ink-muted">Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-luxe-200 pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link to="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">Proceed to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
