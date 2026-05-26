import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Truck, Shield } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import ProductCard from '../../components/product/ProductCard'
import Button from '../../components/ui/Button'
import StarRating from '../../components/ui/StarRating'
import Badge from '../../components/ui/Badge'
import { formatPrice, getStockStatus, getRelatedProducts, cn } from '../../utils/helpers'
import Recommendations from '../../components/product/Recommendations'

export default function ProductPage() {
  const { id } = useParams()
  const { getProduct, getVendor, products } = useProducts()
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const product = getProduct(id)
  const [imgIndex, setImgIndex] = useState(0)
  const [size, setSize] = useState('')
  const [color, setColor] = useState(null)
  const [adding, setAdding] = useState(false)
  const [touchStart, setTouchStart] = useState(null)

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p>Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-luxe-700 underline">Back to shop</Link>
      </div>
    )
  }

  const vendor = getVendor(product.vendorId)
  const stock = getStockStatus(product)
  const related = getRelatedProducts(product, products)
  const selectedColor = color || product.colors[0]

  const handleAdd = async () => {
    if (!size && product.sizes.length > 1) return
    setAdding(true)
    await new Promise((r) => setTimeout(r, 500))
    addItem(product, { size: size || product.sizes[0], color: selectedColor })
    setAdding(false)
  }

  const onTouchEnd = (e) => {
    if (!touchStart) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (diff > 50) setImgIndex((i) => Math.min(i + 1, product.images.length - 1))
    if (diff < -50) setImgIndex((i) => Math.max(i - 1, 0))
    setTouchStart(null)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
        <ChevronLeft size={16} /> Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-luxe-100"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIndex}
                src={product.images[imgIndex]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIndex((i) => Math.min(product.images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={cn(
                  'h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2',
                  i === imgIndex ? 'border-ink' : 'border-transparent'
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-ink-faint">{product.brand}</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} showValue />
            <span className="text-sm text-ink-muted">({product.reviewCount} reviews)</span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-ink-faint line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            {stock === 'out' && <Badge variant="danger">Out of stock</Badge>}
            {stock === 'low' && <Badge variant="warning">Only {product.stock} left</Badge>}
            {product.isNew && <Badge variant="new">New</Badge>}
          </div>

          <p className="mt-6 text-ink-muted">{product.description}</p>

          {vendor && (
            <Link
              to={`/vendor/${vendor.slug}`}
              className="mt-4 inline-flex items-center gap-3 rounded-xl border border-luxe-200 p-3 hover:bg-luxe-50"
            >
              <img src={vendor.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="font-medium">{vendor.name}</p>
                <p className="text-xs text-ink-muted">{vendor.rating} ★ · {vendor.reviewCount} reviews</p>
              </div>
            </Link>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-[3rem] rounded-lg border px-4 py-2 text-sm transition',
                      size === s ? 'border-ink bg-ink text-white' : 'border-luxe-200 hover:border-luxe-400'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Color</p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    title={c.name}
                    className={cn(
                      'h-9 w-9 rounded-full border-2',
                      selectedColor.name === c.name ? 'border-ink ring-2 ring-luxe-300' : 'border-luxe-200'
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                loading={adding}
                disabled={stock === 'out'}
                onClick={handleAdd}
              >
                <ShoppingBag size={18} />
                Add to cart
              </Button>
              <Button
                variant="outline"
                onClick={() => toggle(product.id)}
                className={has(product.id) ? 'text-red-500' : ''}
              >
                <Heart size={18} fill={has(product.id) ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl bg-luxe-100 p-4">
              <Truck className="shrink-0 text-luxe-600" />
              <div>
                <p className="font-medium text-sm">Free shipping over $200</p>
                <p className="text-xs text-ink-muted">Standard delivery 5-7 days</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-xl bg-luxe-100 p-4">
              <Shield className="shrink-0 text-luxe-600" />
              <div>
                <p className="font-medium text-sm">Authenticity guaranteed</p>
                <p className="text-xs text-ink-muted">Verified vendor products</p>
              </div>
            </div>
          </div>

          {product.reviews?.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Reviews</h2>
              <div className="mt-4 space-y-4">
                {product.reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-luxe-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{r.user}</p>
                      <StarRating rating={r.rating} size={14} />
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-luxe-200 pt-12">
          <h2 className="font-display text-2xl font-semibold">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
      <Recommendations title="Customers also bought" excludeId={product.id} />
    </div>
  )
}
