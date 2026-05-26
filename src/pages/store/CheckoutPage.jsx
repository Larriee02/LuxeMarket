import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CreditCard, MapPin, Package } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useProducts } from '../../context/ProductContext'
import { useOrders } from '../../context/OrderContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { formatPrice, groupCartByVendor } from '../../utils/helpers'
import { SHIPPING_OPTIONS } from '../../data/mockData'

const STEPS = ['Address', 'Shipping', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { vendors } = useProducts()
  const { createOrdersFromCheckout } = useOrders()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderIds, setOrderIds] = useState([])
  const [address, setAddress] = useState({
    street: '42 Fashion Ave',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
  })
  const [shipping, setShipping] = useState('standard')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  const groups = groupCartByVendor(items, vendors)
  const shippingOpt = SHIPPING_OPTIONS.find((s) => s.id === shipping)
  const shippingCost = shippingOpt?.price || 8
  const total = subtotal + shippingCost

  if (items.length === 0 && orderIds.length === 0) {
    navigate('/cart')
    return null
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const orders = createOrdersFromCheckout({
      customerId: user?.id || 'guest',
      vendorGroups: groups,
      shippingAddress: address,
      shippingMethod: shipping,
      shippingCost,
    })
    setOrderIds(orders.map((o) => o.id))
    clearCart()
    setStep(3)
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>

      <div className="mt-8 flex justify-between">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                i <= step ? 'bg-ink text-white' : 'bg-luxe-200 text-ink-muted'
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="mt-1 hidden text-xs sm:block">{s}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-10 space-y-4"
          >
            <div className="flex items-center gap-2 text-luxe-700">
              <MapPin size={20} />
              <h2 className="font-display text-xl font-semibold">Shipping address</h2>
            </div>
            <Input label="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              <Input label="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="ZIP" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
              <Input label="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
            </div>
            <Button onClick={() => setStep(1)}>Continue to shipping</Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-10 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Package size={20} />
              <h2 className="font-display text-xl font-semibold">Shipping method</h2>
            </div>
            {SHIPPING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${
                  shipping === opt.id ? 'border-ink bg-luxe-50' : 'border-luxe-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" name="shipping" checked={shipping === opt.id} onChange={() => setShipping(opt.id)} />
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-ink-muted">{opt.days}</p>
                  </div>
                </div>
                <span className="font-medium">{formatPrice(opt.price)}</span>
              </label>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Continue to payment</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-10 space-y-4"
          >
            <div className="flex items-center gap-2">
              <CreditCard size={20} />
              <h2 className="font-display text-xl font-semibold">Payment (mock)</h2>
            </div>
            <p className="text-sm text-ink-muted">Demo mode — no real charges. Use any card details.</p>
            <Input label="Cardholder name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="Alex Morgan" />
            <Input label="Card number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Expiry" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="12/28" />
              <Input label="CVC" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" />
            </div>
            <div className="rounded-xl bg-luxe-100 p-4">
              <p className="text-sm font-medium">Order total</p>
              <p className="text-2xl font-semibold">{formatPrice(total)}</p>
              <p className="text-xs text-ink-muted mt-1">{groups.length} separate order(s) — one per vendor</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button loading={loading} onClick={handlePlaceOrder}>Place order</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
            >
              <Check size={32} />
            </motion.div>
            <h2 className="mt-6 font-display text-3xl font-semibold">Order confirmed!</h2>
            <p className="mt-2 text-ink-muted">Thank you for your purchase.</p>
            <div className="mt-6 rounded-xl border border-luxe-200 bg-white p-6 text-left">
              <p className="text-sm font-medium">Invoice summary</p>
              <p className="mt-2 text-2xl font-semibold">{formatPrice(total)}</p>
              <p className="mt-2 text-sm text-ink-muted">Order IDs:</p>
              <ul className="mt-1 space-y-1 text-sm font-mono">
                {orderIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/orders')}>Track orders</Button>
              <Button onClick={() => navigate('/shop')}>Continue shopping</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
