import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { slugify } from '../utils/slugify'
import ProductImage from './ProductImage'

const INTERVAL_MS = 5000

/**
 * Home hero product showcase that rotates through featured products.
 *
 * - Auto-advances every 5 s, only after the page has loaded (the pre-rendered HTML always
 *   shows the first product), and never for visitors who prefer reduced motion.
 * - Pauses while hovered, while focus is inside it, and while the tab is hidden.
 * - Pause / play button and dot buttons (WCAG 2.2.2: moving content must be stoppable).
 * - Inactive slides are hidden from assistive tech and keyboard (inert).
 *
 * slides: [{ category, brand, model }]
 */
export default function HeroCarousel({ slides }) {
  const { t, tCategory, href } = useLanguage()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const rootRef = useRef(null)
  const count = slides.length

  // Start playing after mount unless the visitor asked the OS for reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPlaying(!reduce.matches && count > 1)
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [count])

  const running = playing && !hovered && !focused && pageVisible
  useEffect(() => {
    if (!running) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS)
    return () => clearInterval(timer)
  }, [running, count])

  if (count === 0) return null
  const active = slides[index]
  const label = (slide) => `${slide.brand.brand} ${slide.model.modelName}`

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={t('featuredRange')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      <div className="relative">
        <div className="absolute -inset-4 rounded-4xl border border-white/15 bg-white/5" aria-hidden="true" />
        <div className="animate-float">
          {/* While playing, slide changes are not announced; when paused they are. */}
          <div className="relative aspect-4/3" aria-live={running ? 'off' : 'polite'}>
            {slides.map((slide, i) => {
              const isActive = i === index
              return (
                <Link
                  key={`${slide.category.category}-${slide.model.modelName}`}
                  to={href(`/catalog/${slide.category.category}/${slugify(slide.model.modelName)}`)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${t('carouselSlide', { index: i + 1, total: count })}: ${label(slide)}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`absolute inset-0 block rounded-3xl transition-opacity duration-700 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                    isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                >
                  <ProductImage
                    category={slide.category.category}
                    product={slide.model}
                    alt={`${label(slide)} — ${tCategory(slide.category.category, slide.category.categoryLabel)}`}
                    className="h-full w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    imgClassName="object-contain p-6"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : undefined}
                  />
                </Link>
              )
            })}
            <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl border border-white/20 bg-stone-950/65 px-3 py-2 backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">
                {tCategory(active.category.category, active.category.categoryLabel)}
              </p>
              <p className="mt-0.5 text-sm font-bold text-white">{label(active)}</p>
            </div>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="relative mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t('carouselPause') : t('carouselPlay')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition hover:bg-black/35 cursor-pointer"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <div className="flex items-center gap-1">
            {slides.map((slide, i) => (
              <button
                key={`dot-${slide.category.category}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t('carouselShow', { name: label(slide) })}
                aria-current={i === index ? 'true' : undefined}
                className="group inline-flex h-9 w-7 items-center justify-center cursor-pointer"
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === index ? 'w-6 bg-white' : 'w-2 bg-white/45 group-hover:bg-white/75'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
