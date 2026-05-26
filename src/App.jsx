import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ProductProvider } from './context/ProductContext'
import { OrderProvider } from './context/OrderContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import StoreLayout from './components/layout/StoreLayout'
import HomePage from './pages/store/HomePage'
import ShopPage from './pages/store/ShopPage'
import ProductPage from './pages/store/ProductPage'
import CartPage from './pages/store/CartPage'
import CheckoutPage from './pages/store/CheckoutPage'
import WishlistPage from './pages/store/WishlistPage'
import OrdersPage from './pages/store/OrdersPage'
import VendorStorePage from './pages/store/VendorStorePage'
import VendorsPage from './pages/store/VendorsPage'
import AboutPage from './pages/store/AboutPage'
import AuthPage from './pages/auth/AuthPage'
import VendorDashboard from './pages/vendor/VendorDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="vendor/:slug" element={<VendorStorePage />} />
          <Route
            path="orders"
            element={
              <ProtectedRoute roles={['customer', 'vendor', 'admin']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="auth/login" element={<AuthPage mode="login" />} />
        <Route path="auth/register" element={<AuthPage mode="register" />} />

        <Route
          path="vendor/*"
          element={
            <ProtectedRoute roles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/*"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <WishlistProvider>
                <AnimatedRoutes />
              </WishlistProvider>
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
