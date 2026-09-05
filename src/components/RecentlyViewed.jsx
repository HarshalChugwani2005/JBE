import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { clearRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed'
import { ClockIcon } from './Icons'
import ProductImage from './ProductImage'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function RecentlyViewed({ currentModelName, className = '' }) {
  const { t } = useLanguage()
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getRecentlyViewed())

    const handleUpdate = (e) => {
      setItems(e.detail || getRecentlyViewed())
    }

    window.addEventListener('jbe:recently-viewed-updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('jbe:recently-viewed-updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Filter out the currently active model if viewing on its own modal/page
  const displayItems = currentModelName
    ? items.filter((x) => x.modelName.toLowerCase() !== currentModelName.toLowerCase())
    : items

  if (displayItems.length === 0) return null

  return (
    <section aria-labelledby="recently-viewed-title" className={`mt-12 pt-8 border-t border-stone-200/80 ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2
            id="recently-viewed-title"
            className="font-heading text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2"
          >
            <ClockIcon className="h-5 w-5 text-amber-700" />
            <span>{t('recentlyViewed')}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('recentlyViewedSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-500 hover:border-amber-300 hover:text-amber-900 transition duration-150 cursor-pointer"
        >
          {t('clearRecentlyViewed')}
        </button>
      </div>

      {/* Horizontal scrolling strip on mobile, neat grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none sm:grid sm:grid-cols-2 md:grid-cols-4 sm:overflow-visible">
        {displayItems.map((item) => (
          <Link
            key={item.id}
            to={`/catalog/${item.categorySlug}/${slugify(item.modelName)}`}
            className="group flex-shrink-0 w-52 sm:w-auto flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-[0_12px_24px_-4px_rgba(217,119,6,0.12)]"
          >
            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
              <ProductImage
                category={item.categorySlug}
                product={item}
                alt={item.modelName}
                className="h-full w-full object-cover"
                imgClassName="group-hover:scale-105 transition-transform duration-300"
                fallbackLabel=""
              />
              <span className="absolute top-2 right-2 rounded-full bg-stone-900/80 px-2 py-0.5 text-[9px] font-bold text-white">
                {item.categoryLabel}
              </span>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                {item.brand && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {item.brand}
                  </p>
                )}
                <h3 className="font-heading text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                  {item.modelName}
                </h3>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs pt-1.5 border-t border-stone-100">
                <span className="font-medium text-[11px] text-amber-700 group-hover:underline">
                  View →
                </span>
                {item.inStock ? (
                  <span className="text-[10px] font-semibold text-emerald-700">In Stock</span>
                ) : (
                  <span className="text-[10px] font-medium text-stone-400">Ask Stock</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
