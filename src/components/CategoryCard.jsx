import { Link } from 'react-router-dom'
import { getCategoryVisual, getModelCount } from '../data/categoryVisuals'
import CategoryIcon from './CategoryIcon'

export default function CategoryCard({ category, categoryLabel, comingSoon, brands = [] }) {
  const visual = getCategoryVisual(category)
  const modelCount = getModelCount({ brands })
  const statusText = comingSoon
    ? 'Catalog coming soon'
    : modelCount > 0
      ? `${modelCount} model${modelCount === 1 ? '' : 's'} available`
      : 'Browse models'

  return (
    <Link
      to={`/catalog/${category}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      <div
        className={`relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${visual.gradient} text-white/90`}
      >
        <CategoryIcon slug={category} className="h-12 w-12 transition group-hover:scale-105" />
        {comingSoon && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-amber-800 shadow-sm">
            Coming Soon
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-800">
          {categoryLabel}
        </h3>
        <p className="mt-1 text-sm text-stone-500">{statusText}</p>
        {!comingSoon && brands.length > 0 && (
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-amber-700">
            {brands.map((b) => b.brand).join(' · ')}
          </p>
        )}
      </div>
    </Link>
  )
}
