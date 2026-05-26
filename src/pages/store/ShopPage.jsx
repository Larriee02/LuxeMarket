import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'
import { ProductCardSkeleton } from '../../components/ui/Skeleton'
import { filterProducts } from '../../utils/helpers'
import { CATEGORIES } from '../../data/mockData'

export default function ShopPage() {
  const { products, brands } = useProducts()
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filters = useMemo(
    () => ({
      search: params.get('q') || '',
      category: params.get('category') || 'all',
      brand: params.get('brand') || '',
      minPrice: params.get('min') ? Number(params.get('min')) : null,
      maxPrice: params.get('max') ? Number(params.get('max')) : null,
      minRating: params.get('rating') ? Number(params.get('rating')) : null,
      inStockOnly: params.get('stock') === '1',
      availability: params.get('availability') || '',
      sort: params.get('sort') || '',
    }),
    [params]
  )

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [filters])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  const FilterPanel = () => (
    <aside className="space-y-6">
      <div>
        <h3 className="font-medium">Category</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('category', 'all')}
            className={`rounded-full px-3 py-1 text-sm ${filters.category === 'all' ? 'bg-ink text-white' : 'bg-luxe-100'}`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter('category', c.id)}
              className={`rounded-full px-3 py-1 text-sm ${filters.category === c.id ? 'bg-ink text-white' : 'bg-luxe-100'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-medium">Brand</h3>
        <select
          value={filters.brand}
          onChange={(e) => setFilter('brand', e.target.value)}
          className="mt-2 w-full rounded-xl border border-luxe-200 px-3 py-2"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="font-medium">Price range</h3>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter('min', e.target.value)}
            className="w-full rounded-xl border border-luxe-200 px-3 py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter('max', e.target.value)}
            className="w-full rounded-xl border border-luxe-200 px-3 py-2"
          />
        </div>
      </div>
      <div>
        <h3 className="font-medium">Rating</h3>
        <select
          value={filters.minRating ?? ''}
          onChange={(e) => setFilter('rating', e.target.value)}
          className="mt-2 w-full rounded-xl border border-luxe-200 px-3 py-2"
        >
          <option value="">Any</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => setFilter('stock', e.target.checked ? '1' : '')}
        />
        <span className="text-sm">In stock only</span>
      </label>
      <div>
        <h3 className="font-medium">Sort by</h3>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="mt-2 w-full rounded-xl border border-luxe-200 px-3 py-2"
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="new">New arrivals</option>
          <option value="popular">Popular</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
    </aside>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Shop</h1>
          <p className="mt-1 text-ink-muted">{filtered.length} products</p>
        </div>
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 rounded-full border border-luxe-200 px-4 py-2 lg:hidden"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      <div className="mt-8 flex gap-8">
        <div className="hidden w-64 shrink-0 lg:block">
          <FilterPanel />
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-20 text-center text-ink-muted">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <motion.div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}><X size={20} /></button>
            </div>
            <FilterPanel />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
