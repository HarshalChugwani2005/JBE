import { useEffect, useMemo, useState } from 'react'
import CategoryIcon from './CategoryIcon'
import { useLanguage } from '../context/useLanguage'
import { getCategoryVisual } from '../data/categoryVisuals'
import { getImageSrcSet, getProductImageUrls } from '../data/productImages'

export default function ProductImage({
  src: directSrc,
  category,
  product,
  alt,
  className = '',
  imgClassName = '',
  fallbackLabel,
  loading = 'lazy',
  fetchPriority,
  sizes = '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
}) {
  const sources = useMemo(() => {
    if (directSrc) return [directSrc]
    return getProductImageUrls(category, product)
  }, [directSrc, category, product])
  const src = directSrc || sources[0] || null
  const srcSet = src ? getImageSrcSet(src) : undefined
  const { t, tCategory } = useLanguage()
  const visual = getCategoryVisual(category)
  const fallbackText = fallbackLabel ?? t('photoComingSoon')
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-linear-to-br ${visual.gradient} px-4 text-white ${className}`}
        role="img"
        aria-label={alt || fallbackText || tCategory(category, visual.label)}
      >
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-2 text-center">
          <CategoryIcon slug={category} className="h-10 w-10 shrink-0 opacity-90" />
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white" aria-hidden="true">
            {tCategory(category, visual.label)}
          </span>
          {fallbackText && <span className="text-[11px] font-medium text-white/90" aria-hidden="true">{fallbackText}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {!isLoaded && <div className="absolute inset-0 skeleton-shimmer" aria-hidden="true" />}
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`h-full w-full object-cover transition duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
        } ${imgClassName}`}
      />
    </div>
  )
}
