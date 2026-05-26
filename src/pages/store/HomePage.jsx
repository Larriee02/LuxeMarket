import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'
import { CATEGORIES } from '../../data/mockData'
import { getRecommendations } from '../../utils/helpers'
import Recommendations from '../../components/product/Recommendations'

export default function HomePage() {
  const { products } = useProducts()
  const trending = getRecommendations(products, null, 4)
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-luxe-50">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988354-763728e36855?w=1600&h=900&fit=crop"
            alt=""
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-luxe-600/30 px-3 py-1 text-sm backdrop-blur">
              <Sparkles size={14} />
              Premium Fashion Marketplace
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl">
              Curated luxury for the modern wardrobe
            </h1>
            <p className="mt-4 text-lg text-luxe-200">
              Discover clothing brands, sustainable fabrics, and artisan accessories from verified vendors worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-luxe-50 px-6 py-3 font-medium text-ink transition hover:bg-white"
              >
                Explore collection
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/vendors"
                className="inline-flex items-center gap-2 rounded-full border border-luxe-400 px-6 py-3 font-medium transition hover:bg-white/10"
              >
                Meet our vendors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold">Shop by category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/shop?category=${cat.id}`}
                className="group block overflow-hidden rounded-2xl bg-luxe-100 p-8 transition hover:shadow-luxe-lg"
              >
                <h3 className="font-display text-2xl font-semibold group-hover:text-luxe-700">
                  {cat.label}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">Browse curated {cat.label.toLowerCase()}</p>
                <ArrowRight className="mt-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-luxe-100/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl font-semibold">New arrivals</h2>
            <Link to="/shop?sort=new" className="text-sm font-medium text-luxe-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold">Trending now</h2>
          <Link to="/shop?sort=popular" className="text-sm font-medium text-luxe-700 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Recommendations title="Trending in accessories" category="accessories" />
      </section>
    </div>
  )
}
