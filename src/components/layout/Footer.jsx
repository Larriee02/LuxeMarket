import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-luxe-200 bg-luxe-100/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-semibold">LuxeMarket</p>
            <p className="mt-2 text-sm text-ink-muted">
              Premium marketplace for fashion brands, fabric suppliers, and accessories.
            </p>
          </div>
          <div>
            <h4 className="font-medium">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><Link to="/shop?category=clothing" className="hover:text-ink">Clothing</Link></li>
              <li><Link to="/shop?category=materials" className="hover:text-ink">Materials</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-ink">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><Link to="/auth/login" className="hover:text-ink">Sign in</Link></li>
              <li><Link to="/auth/register" className="hover:text-ink">Register</Link></li>
              <li><Link to="/orders" className="hover:text-ink">Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium">Sell</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li><Link to="/auth/register?role=vendor" className="hover:text-ink">Become a vendor</Link></li>
              <li><Link to="/vendor" className="hover:text-ink">Vendor dashboard</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-luxe-200 pt-6 text-center text-xs text-ink-faint">
          © {new Date().getFullYear()} LuxeMarket. Portfolio demo project.
        </p>
      </div>
    </footer>
  )
}
