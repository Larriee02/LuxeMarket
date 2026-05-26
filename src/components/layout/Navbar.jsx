import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, Heart, User, Menu, X, Store } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/helpers'

export default function Navbar({ onSearch }) {
  const { count } = useCart()
  const { ids } = useWishlist()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch?.(query)
    navigate(`/shop?q=${encodeURIComponent(query)}`)
    setSearchOpen(false)
    setMobileOpen(false)
  }

  const dashLink =
    user?.role === 'vendor'
      ? '/vendor'
      : user?.role === 'admin'
        ? '/admin'
        : null

  return (
    <header className="sticky top-0 z-40 border-b border-luxe-200/80 bg-luxe-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-ink">
          Luxe<span className="text-luxe-600">Market</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {['shop', 'vendors', 'about'].map((item) => (
            <NavLink
              key={item}
              to={item === 'shop' ? '/shop' : `/${item}`}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium capitalize transition-colors hover:text-luxe-600',
                  isActive ? 'text-luxe-700' : 'text-ink-muted'
                )
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-luxe-100"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <Link
            to="/wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-luxe-100"
          >
            <Heart size={20} />
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-white">
                {ids.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-luxe-100"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-luxe-600 text-[10px] text-white"
              >
                {count}
              </motion.span>
            )}
          </Link>
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              {dashLink && (
                <Link
                  to={dashLink}
                  className="flex items-center gap-1 rounded-full bg-luxe-200 px-3 py-1.5 text-sm font-medium"
                >
                  <Store size={14} />
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="text-sm text-ink-muted hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-luxe-100 sm:flex"
            >
              <User size={20} />
            </Link>
          )}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-luxe-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSearch}
            className="overflow-hidden border-t border-luxe-200 bg-white px-4 py-3"
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              className="w-full rounded-xl border border-luxe-200 px-4 py-2.5 focus:border-luxe-500 focus:outline-none focus:ring-2 focus:ring-luxe-200"
            />
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-luxe-200 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-luxe-50">
                Shop
              </Link>
              <Link to="/vendors" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-luxe-50">
                Vendors
              </Link>
              {user ? (
                <>
                  {dashLink && (
                    <Link to={dashLink} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-luxe-50">
                      Dashboard
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="rounded-lg px-3 py-2 text-left hover:bg-luxe-50">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 hover:bg-luxe-50">
                  Sign in
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
