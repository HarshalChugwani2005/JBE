import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { getCategoryVisual } from '../data/categoryVisuals'
import { currentSeason, seasonCategories, seasonKey, seasons } from '../data/seasons'
import CategoryIcon from './CategoryIcon'
import { ArrowRightIcon } from './Icons'

/**
 * "Shop by season" cards for the Home page. All three seasons are always shown (so the
 * pre-rendered HTML never goes stale); the season that is current in India gets an
 * "In season now" badge after load.
 */
export default function SeasonCards() {
  const { t, href } = useLanguage()
  const [current, setCurrent] = useState(null)

  useEffect(() => setCurrent(currentSeason().slug), [])

  return (
    <ul className="grid gap-3 sm:grid-cols-3 sm:gap-5">
      {seasons.map((season) => {
        const key = seasonKey(season.slug)
        const lead = seasonCategories(season)[0]?.category ?? 'ceiling-fans'
        const isCurrent = current === season.slug
        return (
          <li key={season.slug}>
            <Link
              to={href(`/season/${season.slug}`)}
              className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-md ${
                isCurrent ? 'border-amber-400 ring-2 ring-amber-300/60' : 'border-stone-200'
              }`}
            >
              <div className={`relative flex h-24 items-center justify-center bg-linear-to-br ${getCategoryVisual(lead).gradient} text-white`}>
                <CategoryIcon slug={lead} className="h-10 w-10" />
                {isCurrent && (
                  <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-amber-900 shadow-sm">
                    {t('inSeasonNow')}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-amber-800">{t(`season${key}`)}</h3>
                <p className="mt-1 flex-1 text-sm text-stone-600">{t(`season${key}Text`)}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800">
                  {t('seasonViewAll')}
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
