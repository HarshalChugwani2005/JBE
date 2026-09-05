import { Link } from 'react-router-dom'
import { getCategoryVisual, getModelCount } from '../data/categoryVisuals'
import CategoryIcon from './CategoryIcon'
import { PackageIcon } from './Icons'

export default function CategoryCard({ category, categoryLabel, comingSoon, brands = [], search = '' }) {
  const visual = getCategoryVisual(category)
  const modelCount = getModelCount({ brands })

  return (
    <Link
      to={{ pathname: `/catalog/${category}`, search }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/80 hover:shadow-[0_16px_32px_-6px_rgba(217,119,6,0.14)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      <div
        className={`relative flex aspect-square sm:aspect-[4/3] items-center justify-center bg-gradient-to-br ${visual.gradient} text-white overflow-hidden`}
      >
        {/* Subtle radial sheen */}
        <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/10 pointer-events-none" />
        <CategoryIcon slug={category} className="h-16 w-16 sm:h-14 sm:w-14 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-2 drop-shadow-md" />

        {/* Model count badge — top-left corner */}
        {!comingSoon && modelCount > 0 && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-stone-900/80 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-white border border-white/20 shadow-sm">
            <PackageIcon className="h-3 w-3 text-white/80" />
            {modelCount} model{modelCount === 1 ? '' : 's'}
          </span>
        )}

        {comingSoon && (
          <span className="absolute right-2.5 top-2.5 rounded-full border border-white/40 bg-white/95 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-900 shadow-sm">
            Coming Soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <h3 className="font-heading text-base sm:text-lg font-bold text-stone-900 dark:text-white transition-colors duration-200 group-hover:text-amber-800 leading-tight">
          {categoryLabel}
        </h3>

        {/* Model count chip in the card body */}
        <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
          {!comingSoon && modelCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-amber-800">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {modelCount} model{modelCount === 1 ? '' : 's'} available
            </span>
          ) : comingSoon ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 border border-stone-200/80 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-stone-500">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
              Coming soon
            </span>
          ) : (
            <span className="text-xs text-stone-500">Browse models</span>
          )}
        </div>

        {!comingSoon && brands.length > 0 && (
          <div className="mt-auto pt-2">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700/90 truncate">
              {brands.map((b) => b.brand).join(' · ')}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}
