import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl px-4 py-16 sm:px-6 text-center"
    >
      <h1 className="font-display text-4xl font-semibold">About LuxeMarket</h1>
      <p className="mt-6 text-lg text-ink-muted leading-relaxed">
        LuxeMarket connects discerning customers with verified clothing brands, premium fabric suppliers,
        and artisan accessory makers. Built as a full-stack marketplace demo showcasing role-based auth,
        multi-vendor carts, and professional vendor tooling.
      </p>
    </motion.div>
  )
}
