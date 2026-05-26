import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initialOrders } from '../data/mockData'
import { generateId } from '../utils/helpers'

const OrderContext = createContext(null)
const ORDERS_KEY = 'luxe_orders'

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem(ORDERS_KEY)
    return stored ? JSON.parse(stored) : initialOrders
  })

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  const createOrdersFromCheckout = useCallback(
    ({ customerId, vendorGroups, shippingAddress, shippingMethod, shippingCost }) => {
      const newOrders = vendorGroups.map((group) => {
        const subtotal = group.items.reduce((s, i) => s + i.price * i.quantity, 0)
        const share = shippingCost / vendorGroups.length
        return {
          id: generateId('ord'),
          customerId,
          vendorId: group.vendor.id,
          items: group.items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            color: i.color,
          })),
          subtotal,
          shipping: share,
          total: subtotal + share,
          status: 'pending',
          shippingAddress,
          shippingMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [{ status: 'pending', date: new Date().toISOString() }],
        }
      })
      setOrders((prev) => [...newOrders, ...prev])
      return newOrders
    },
    []
  )

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const timeline = [...(o.timeline || []), { status, date: new Date().toISOString() }]
        return { ...o, status, timeline, updatedAt: new Date().toISOString() }
      })
    )
  }, [])

  const getCustomerOrders = useCallback(
    (customerId) => orders.filter((o) => o.customerId === customerId),
    [orders]
  )

  const getVendorOrders = useCallback(
    (vendorId) => orders.filter((o) => o.vendorId === vendorId),
    [orders]
  )

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrdersFromCheckout,
        updateOrderStatus,
        getCustomerOrders,
        getVendorOrders,
        setOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrders = () => {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}
