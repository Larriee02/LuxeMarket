import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { formatPrice, getStockStatus, cn } from '../../utils/helpers'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import Badge from '../ui/Badge'
import StarRating from '../ui/StarRating'
import QuickPreviewModal from './QuickPreviewModal'

export default function ProductCard({ product, index = 0 }) {
  const { toggle, has } = useWishlist()
  const { addItem } = useCart()
  const [preview, setPreview] = useState(false)
  const stock = getStockStatus(product)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (stock === 'out') return
    addItem(product, {
      size: product.sizes[0],
      color: product.colors[0],
    })
  }

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4 }}
        className="group relative"
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-luxe-100">
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute left-3 top-3 flex flex-col gap-2">
              {product.isNew && <Badge variant="new">New</Badge>}
              {stock === 'low' && <Badge variant="warning">Low stock</Badge>}
              {stock === 'out' && <Badge variant="danger">Sold out</Badge>}
            </div>
            <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all group-hover:opacity-100">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  toggle(product.id)
                }}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-luxe backdrop-blur',
                  has(product.id) && 'text-red-500'
                )}
              >
                <Heart size={16} fill={has(product.id) ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault()
                  setPreview(true)
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-luxe backdrop-blur"
              >
                <Eye size={16} />
              </motion.button>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              disabled={stock === 'out'}
              className="absolute bottom-3 right-3 left-3 flex items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-medium text-ink opacity-0 shadow-luxe-lg transition-all group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={16} />
              Quick add
            </motion.button>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-xs uppercase tracking-wider text-ink-faint">{product.brand}</p>
            <h3 className="font-medium text-ink line-clamp-1">{product.name}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatPrice(product.price)}</span>
                {product.compareAt && (
                  <span className="text-sm text-ink-faint line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                )}
              </div>
              <StarRating rating={product.rating} size={12} />
            </div>
          </div>
        </Link>
      </motion.article>
      <AnimatePresence>
        {preview && (
          <QuickPreviewModal product={product} onClose={() => setPreview(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
