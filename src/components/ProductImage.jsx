import { useEffect, useMemo, useState } from 'react'
import CategoryIcon from './CategoryIcon'
import { getProductImageUrls } from '../data/productImages'

export default function ProductImage({
  src: directSrc,
  category,
  product,
  alt,
  className = '',
  imgClassName = '',
  fallbackLabel = 'Photo coming soon',
  loading = 'lazy',
}) {
  const sources = useMemo(() => {
    if (directSrc) return [directSrc]
    return getProductImageUrls(category, product)
  }, [directSrc, category, product])
  const src = directSrc || sources[0] || null
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center gap-3 bg-stone-100 px-4 text-stone-500 ${className}`}
        aria-label={fallbackLabel}
      >
        <CategoryIcon slug={category} className="h-10 w-10 shrink-0" />
        <span className="text-sm font-medium">{fallbackLabel}</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {!isLoaded && <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
        } ${imgClassName}`}
      />
    </div>
  )
}
