import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProducts } from '../../context/ProductContext'
import StarRating from '../../components/ui/StarRating'
import Badge from '../../components/ui/Badge'

export default function VendorsPage() {
  const { vendors } = useProducts()
  const approved = vendors.filter((v) => v.status === 'approved')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Our vendors</h1>
      <p className="mt-2 text-ink-muted">Curated brands, fabric houses, and accessory makers</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {approved.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/vendor/${v.slug}`}
              className="group block overflow-hidden rounded-2xl border border-luxe-200 bg-white transition hover:shadow-luxe-lg"
            >
              <div className="relative h-36">
                <img src={v.cover} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <img src={v.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h2 className="font-display text-xl font-semibold">{v.name}</h2>
                    <p className="text-sm text-ink-muted">{v.tagline}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StarRating rating={v.rating} size={14} />
                  <Badge>{v.location}</Badge>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
