import { motion } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice, getStockStatus } from '../../utils/helpers'
import { useCart } from '../../context/CartContext'
import Button from '../ui/Button'
import StarRating from '../ui/StarRating'

export default function QuickPreviewModal({ product, onClose }) {
  const { addItem } = useCart()
  const stock = getStockStatus(product)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-luxe-lg sm:flex-row"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 28 }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90"
        >
          <X size={18} />
        </button>
        <div className="aspect-square w-full sm:w-1/2">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col justify-center p-6">
          <p className="text-xs uppercase tracking-wider text-ink-faint">{product.brand}</p>
          <h2 className="font-display text-2xl font-semibold">{product.name}</h2>
          <div className="mt-2">
            <StarRating rating={product.rating} showValue />
          </div>
          <p className="mt-2 text-xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mt-3 line-clamp-2 text-sm text-ink-muted">{product.description}</p>
          <div className="mt-6 flex gap-3">
            <Button
              disabled={stock === 'out'}
              onClick={() => {
                addItem(product, { size: product.sizes[0], color: product.colors[0] })
                onClose()
              }}
            >
              <ShoppingBag size={16} />
              Add to cart
            </Button>
            <Link to={`/product/${product.id}`} onClick={onClose}>
              <Button variant="outline">View details</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
