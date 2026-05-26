import { Star } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function StarRating({ rating, size = 16, showValue }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-luxe-300'
          )}
        />
      ))}
      {showValue && <span className="ml-1 text-sm text-ink-muted">{rating.toFixed(1)}</span>}
    </div>
  )
}
