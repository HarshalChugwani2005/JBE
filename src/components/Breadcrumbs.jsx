import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { ChevronRightIcon } from './Icons'

/** items: [{ label, to? }] — the last item is the current page. */
export default function Breadcrumbs({ items, className = '' }) {
  const { t } = useLanguage()

  return (
    <nav aria-label={t('breadcrumb')} className={`text-xs sm:text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-stone-600">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={`${index}-${item.label}`} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRightIcon className="h-3.5 w-3.5 text-stone-400" />}
              {isCurrent || !item.to ? (
                <span aria-current={isCurrent ? 'page' : undefined} className="font-semibold text-stone-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="inline-flex min-h-6 items-center font-semibold text-amber-800 transition-colors hover:text-amber-950 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
