export const formatPrice = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const generateId = (prefix = 'id') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const getStockStatus = (product) => {
  if (product.stock === 0) return 'out'
  if (product.stock <= product.lowStockThreshold) return 'low'
  return 'in'
}

export const groupCartByVendor = (items, vendors) => {
  const groups = {}
  items.forEach((item) => {
    const vendor = vendors.find((v) => v.id === item.vendorId)
    if (!groups[item.vendorId]) {
      groups[item.vendorId] = { vendor, items: [] }
    }
    groups[item.vendorId].items.push(item)
  })
  return Object.values(groups)
}

export const filterProducts = (products, filters) => {
  let result = [...products]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category)
  }

  if (filters.brand) {
    result = result.filter((p) => p.brand === filters.brand)
  }

  if (filters.minPrice != null) {
    result = result.filter((p) => p.price >= filters.minPrice)
  }

  if (filters.maxPrice != null) {
    result = result.filter((p) => p.price <= filters.maxPrice)
  }

  if (filters.minRating) {
    result = result.filter((p) => p.rating >= filters.minRating)
  }

  if (filters.inStockOnly) {
    result = result.filter((p) => p.stock > 0)
  }

  if (filters.availability === 'new') {
    result = result.filter((p) => p.isNew)
  }

  if (filters.availability === 'popular') {
    result = result.filter((p) => p.isPopular)
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'new':
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'popular':
      result.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    default:
      break
  }

  return result
}

export const getRelatedProducts = (product, allProducts, limit = 4) =>
  allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.vendorId === product.vendorId))
    .slice(0, limit)

export const getRecommendations = (products, category, limit = 4) => {
  const popular = products.filter((p) => p.isPopular && p.stock > 0)
  if (category) {
    const cat = popular.filter((p) => p.category === category)
    if (cat.length >= limit) return cat.slice(0, limit)
  }
  return popular.slice(0, limit)
}
