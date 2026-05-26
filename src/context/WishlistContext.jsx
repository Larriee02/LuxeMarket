import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WishlistContext = createContext(null)
const WISHLIST_KEY = 'luxe_wishlist'

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    const stored = localStorage.getItem(WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = useCallback((productId) => {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }, [])

  const has = useCallback((productId) => ids.includes(productId), [ids])

  return (
    <WishlistContext.Provider value={{ ids, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
