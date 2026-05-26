import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initialProducts, vendors as initialVendors } from '../data/mockData'
import { generateId } from '../utils/helpers'

const ProductContext = createContext(null)
const PRODUCTS_KEY = 'luxe_products'
const VENDORS_KEY = 'luxe_vendors'

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem(PRODUCTS_KEY)
    return stored ? JSON.parse(stored) : initialProducts
  })
  const [vendors, setVendors] = useState(() => {
    const stored = localStorage.getItem(VENDORS_KEY)
    return stored ? JSON.parse(stored) : initialVendors
  })

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors))
  }, [vendors])

  const getProduct = useCallback((id) => products.find((p) => p.id === id), [products])

  const getVendor = useCallback((id) => vendors.find((v) => v.id === id), [vendors])

  const getVendorProducts = useCallback(
    (vendorId) => products.filter((p) => p.vendorId === vendorId),
    [products]
  )

  const addProduct = useCallback((data) => {
    const product = {
      ...data,
      id: generateId('p'),
      rating: 0,
      reviewCount: 0,
      reviews: [],
      isNew: true,
      isPopular: false,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setProducts((prev) => [...prev, product])
    return product
  }, [])

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateVendor = useCallback((id, updates) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)))
  }, [])

  const approveVendor = useCallback((id) => {
    updateVendor(id, { status: 'approved' })
  }, [updateVendor])

  const suspendVendor = useCallback((id) => {
    updateVendor(id, { status: 'suspended' })
  }, [updateVendor])

  const brands = [...new Set(products.map((p) => p.brand))].sort()

  return (
    <ProductContext.Provider
      value={{
        products,
        vendors,
        brands,
        getProduct,
        getVendor,
        getVendorProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        setProducts,
        setVendors,
        approveVendor,
        suspendVendor,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
