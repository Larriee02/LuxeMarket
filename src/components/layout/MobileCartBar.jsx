import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/helpers'

export default function MobileCartBar() {
  const { count, subtotal } = useCart()

  if (count === 0) return null

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-luxe-200 bg-white p-4 shadow-luxe-lg md:hidden"
    >
      <Link
        to="/cart"
        className="flex items-center justify-between rounded-full bg-ink px-5 py-3.5 text-luxe-50"
      >
        <span className="flex items-center gap-2 font-medium">
          <ShoppingBag size={18} />
          {count} {count === 1 ? 'item' : 'items'}
        </span>
        <span className="font-semibold">{formatPrice(subtotal)}</span>
      </Link>
    </motion.div>
  )
}
