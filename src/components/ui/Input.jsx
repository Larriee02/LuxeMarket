import { cn } from '../../utils/helpers'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink">{label}</label>
      )}
      <input
        className={cn(
          'w-full rounded-xl border border-luxe-200 bg-white px-4 py-2.5 text-ink placeholder:text-ink-faint',
          'focus:border-luxe-500 focus:outline-none focus:ring-2 focus:ring-luxe-200 transition-colors',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
