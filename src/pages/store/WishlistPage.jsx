import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useProducts } from '../../context/ProductContext'
import ProductCard from '../../components/product/ProductCard'
import Button from '../../components/ui/Button'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const { products } = useProducts()
  const wishlistProducts = products.filter((p) => ids.includes(p.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold">Wishlist</h1>
      <p className="mt-1 text-ink-muted">{wishlistProducts.length} saved items</p>
      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-ink-muted">No items saved yet.</p>
          <Link to="/shop" className="mt-4 inline-block"><Button>Browse shop</Button></Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {wishlistProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
