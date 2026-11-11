import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { getCategoryVisual, getModelCount } from '../data/categoryVisuals'
import { getImageSrcSet, getProductImageUrls } from '../data/productImages'
import CategoryIcon from './CategoryIcon'
import { PackageIcon } from './Icons'

export default function CategoryCard({ category, categoryLabel, comingSoon, brands = [], search = '' }) {
  const { t, tCategory, href } = useLanguage()
  const label = tCategory(category, categoryLabel)
  const visual = getCategoryVisual(category)
  const modelCount = getModelCount({ brands })
  const cover = useMemo(() => {
    for (const brand of brands) {
      for (const model of brand.models ?? []) {
        const [url] = getProductImageUrls(category, model)
        if (url) return url
      }
    }
    return null
  }, [category, brands])

  return (
    <Link
      to={{ pathname: href(`/catalog/${category}`), search }}
      className="group press-effect flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-[0_16px_32px_-6px_rgba(217,119,6,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      <div
        className={`shimmer-on-hover relative flex aspect-square sm:aspect-[4/3] items-center justify-center overflow-hidden ${
          cover
            ? 'bg-linear-to-b from-stone-50 to-amber-50/60'
            : `bg-linear-to-br ${visual.gradient} text-white`
        }`}
      >
        {cover ? (
          <>
            <img
              src={cover}
              srcSet={getImageSrcSet(cover)}
              sizes="(min-width: 1024px) 300px, 50vw"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain p-5 sm:p-6 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className={`absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br ${visual.gradient} text-white shadow-md`} aria-hidden="true">
              <CategoryIcon slug={category} className="h-4 w-4" />
            </span>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/10 pointer-events-none" aria-hidden="true" />
            <CategoryIcon slug={category} className="h-16 w-16 sm:h-14 sm:w-14 transition-all duration-500 ease-out group-hover:scale-115 group-hover:rotate-6 group-hover:drop-shadow-xl drop-shadow-md" />
          </>
        )}

        {/* Model count badge — top-left corner */}
        {!comingSoon && modelCount > 0 && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-stone-900/80 px-2.5 py-0.5 text-[11px] font-bold text-white border border-white/20 shadow-sm">
            <PackageIcon className="h-3 w-3 text-white/80" />
            {t('modelCount', { count: modelCount })}
          </span>
        )}

        {comingSoon && (
          <span className="absolute right-2.5 top-2.5 rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-900 shadow-sm">
            {t('comingSoon')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <h3 className="font-heading text-base sm:text-lg font-bold text-stone-900 transition-colors duration-200 group-hover:text-amber-800 leading-tight">
          {label}
        </h3>

        {/* Model count chip in the card body */}
        <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
          {!comingSoon && modelCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
              {t('modelsAvailable', { count: modelCount })}
            </span>
          ) : comingSoon ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200/80 px-2 py-0.5 text-[11px] font-semibold text-stone-600">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" aria-hidden="true" />
              {t('comingSoon')}
            </span>
          ) : (
            <span className="text-xs text-stone-600">{t('browseModels')}</span>
          )}
        </div>

        {!comingSoon && brands.length > 0 && (
          <div className="mt-auto pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 truncate transition-all duration-300 group-hover:text-amber-900">
              {brands.map((b) => b.brand).join(' · ')}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
