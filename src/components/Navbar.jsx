import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { shop } from '../data/site'
import LanguageSelector from './LanguageSelector'

const navLinkClass = ({ isActive }) =>
  isActive
    ? 'text-amber-700 font-semibold'
    : 'text-stone-600 hover:text-stone-900 transition'

export default function Navbar() {
  const { totalCount, toggleCart } = useCart()
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm shadow-xs">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2 text-base font-extrabold text-stone-900 md:text-lg tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white text-xs font-black shadow-xs">⚡</span>
          <span>{shop.name}</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <ul className="flex items-center gap-3 text-sm sm:gap-5">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                {t('navHome')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/catalog" className={navLinkClass}>
                {t('navCatalog')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass}>
                {t('navContact')}
              </NavLink>
            </li>
          </ul>

          <LanguageSelector />

          {/* Enquiry List Trigger Button */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 transition hover:border-amber-400 hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
            aria-label={`Enquiry List with ${totalCount} items`}
          >
            <span>📋 {t('navCart')}</span>
            {totalCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
