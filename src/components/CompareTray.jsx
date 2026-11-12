import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCompare } from '../context/useCompare'
import { useLanguage } from '../context/useLanguage'
import { stripLang } from '../i18n/paths'
import { CloseIcon, CompareIcon } from './Icons'
import ProductImage from './ProductImage'

/**
 * Floating "Compare (n)" button shown while models are picked for comparison.
 * Phones: a pill above the bottom action bar (the footer gets matching padding, see index.css).
 * Desktop: bottom-left corner, clear of the WhatsApp button on the right.
 */
export default function CompareTray() {
  const { items, restored, clearCompare } = useCompare()
  const { t, href } = useLanguage()
  const { pathname } = useLocation()
  const visible = restored && items.length > 0 && stripLang(pathname) !== '/compare'

  useEffect(() => {
    document.body.classList.toggle('compare-tray-open', visible)
    return () => document.body.classList.remove('compare-tray-open')
  }, [visible])

  if (!visible) return null

  return (
    <aside
      aria-label={t('compareTrayLabel')}
      className="compare-tray fixed right-3 bottom-[calc(var(--mobile-bar-h,4.5rem)+0.75rem)] z-30 flex items-center gap-1 rounded-full border border-stone-700 bg-stone-900 p-1 pl-1.5 text-white shadow-xl shadow-stone-900/25 animate-slide-in-up md:right-auto md:bottom-6 md:left-6"
    >
      <Link
        to={href('/compare')}
        className="flex min-h-10 items-center gap-2.5 rounded-full py-1 pl-1.5 pr-3 text-sm font-bold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-amber-400"
      >
        <span className="hidden -space-x-2 sm:flex" aria-hidden="true">
          {items.map((item) => (
            <ProductImage
              key={item.modelSlug}
              category={item.categorySlug}
              product={item.model}
              alt=""
              fallbackLabel=""
              sizes="32px"
              className="h-8 w-8 overflow-hidden rounded-full border-2 border-stone-900 bg-white"
              imgClassName="object-contain p-0.5"
            />
          ))}
        </span>
        <CompareIcon className="h-4 w-4 text-amber-300 sm:hidden" />
        <span>{t('compareTrayButton', { count: items.length })}</span>
      </Link>
      <button
        type="button"
        onClick={clearCompare}
        aria-label={t('compareClear')}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-300 transition hover:bg-white/10 hover:text-white cursor-pointer"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </aside>
  )
}
