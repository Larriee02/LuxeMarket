import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { generateId } from '../utils/helpers'

const CartContext = createContext(null)
const CART_KEY = 'luxe_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [flyAnimation, setFlyAnimation] = useState(null)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product, options = {}) => {
    const { size, color, quantity = 1 } = options
    setItems((prev) => {
      const key = `${product.id}-${size}-${color?.name || ''}`
      const existing = prev.find(
        (i) => i.cartKey === key
      )
      if (existing) {
        return prev.map((i) =>
          i.cartKey === key ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          cartKey: key,
          productId: product.id,
          vendorId: product.vendorId,
          name: product.name,
          price: product.price,
          image: product.images[0],
          brand: product.brand,
          size,
          color: color?.name,
          quantity,
          stock: product.stock,
        },
      ]
    })
    setFlyAnimation({ id: generateId('fly'), productId: product.id })
    setTimeout(() => setFlyAnimation(null), 600)
  }, [])

  const removeItem = useCallback((cartKey) => {
    setItems((prev) => prev.filter((i) => i.cartKey !== cartKey))
  }, [])

  const updateQuantity = useCallback((cartKey, quantity) => {
    if (quantity < 1) return
    setItems((prev) =>
      prev.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i))
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        count,
        subtotal,
        flyAnimation,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
