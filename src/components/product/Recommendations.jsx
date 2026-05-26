import { Link } from 'react-router-dom'
import { useProducts } from '../../context/ProductContext'
import ProductCard from './ProductCard'
import { getRecommendations } from '../../utils/helpers'

export default function Recommendations({ title, category, excludeId }) {
  const { products } = useProducts()
  let items = getRecommendations(products, category, 4)
  if (excludeId) items = items.filter((p) => p.id !== excludeId)
  if (items.length === 0) return null

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {category && (
          <Link to={`/shop?category=${category}`} className="text-sm font-medium text-luxe-700 hover:underline">
            View all
          </Link>
        )}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}
