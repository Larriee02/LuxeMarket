import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'
import StarRating from '../../components/ui/StarRating'

export default function VendorStorePage() {
  const { slug } = useParams()
  const { vendors, getVendorProducts } = useProducts()
  const vendor = vendors.find((v) => v.slug === slug)
  const products = vendor ? getVendorProducts(vendor.id) : []

  if (!vendor) {
    return <p className="py-20 text-center">Vendor not found.</p>
  }

  return (
    <div>
      <div className="relative h-48 sm:h-64">
        <img src={vendor.cover} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-12 relative flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <img
            src={vendor.avatar}
            alt={vendor.name}
            className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-luxe-lg"
          />
          <div className="pb-4">
            <h1 className="font-display text-3xl font-semibold text-ink sm:text-white sm:drop-shadow">
              {vendor.name}
            </h1>
            <p className="text-ink-muted sm:text-luxe-200">{vendor.tagline}</p>
            <div className="mt-2 flex items-center gap-3">
              <StarRating rating={vendor.rating} showValue />
              <span className="text-sm text-ink-muted sm:text-luxe-200">
                {vendor.reviewCount} reviews · {vendor.location}
              </span>
            </div>
          </div>
        </motion.div>

        <section className="py-12">
          <h2 className="font-display text-2xl font-semibold">All products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
