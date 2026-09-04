import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useSearch } from '../context/useSearch'
import { useTheme } from '../context/useTheme'
import { shop } from '../data/site'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { totalCount, toggleCart } = useCart()
  const { openSearch } = useSearch()
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navRoutes = [
    { to: '/', label: t('navHome'), end: true },
    { to: '/catalog', label: t('navCatalog'), end: false },
    { to: '/contact', label: t('navContact'), end: false },
  ]

  const isActive = (to, end) => {
    if (end) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md transition-all duration-300 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] dark:bg-stone-950/90 dark:border-stone-800/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-2 text-base font-extrabold text-stone-900 dark:text-white tracking-tight transition duration-200 hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white text-sm font-black shadow-md shadow-amber-500/20 transition duration-300 group-hover:scale-105">
            ⚡
          </span>
          <span className="font-heading font-bold text-stone-900 dark:text-white group-hover:text-amber-800 transition-colors leading-tight">
            <span className="block sm:hidden text-[13px]">Jai Baba</span>
            <span className="hidden sm:block">{shop.name}</span>
          </span>
        </Link>

        {/* Desktop Nav Links (hidden on mobile) */}
        <ul className="relative hidden md:flex items-center gap-1" role="navigation">
          {navRoutes.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive: active }) =>
                  `px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-amber-100 text-amber-900 font-semibold dark:bg-amber-900/30 dark:text-amber-300'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-300 dark:hover:text-white dark:hover:bg-stone-800'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search button — always visible */}
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-50/80 px-2.5 py-2 md:py-1.5 text-xs font-semibold text-stone-600 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            aria-label="Search catalog (Ctrl+K or ⌘K)"
          >
            <span className="text-sm">🔍</span>
            <span className="hidden lg:inline text-stone-500 font-normal dark:text-stone-400">Search...</span>
            <kbd className="hidden lg:inline-block rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-400 shadow-2xs dark:border-stone-600 dark:bg-stone-700 dark:text-stone-400">
              ⌘K
            </kbd>
          </button>

          {/* Language + Dark mode — desktop only */}
          <div className="hidden md:flex items-center gap-1.5">
            <LanguageSelector />
            <ThemeToggle />
          </div>

          {/* Enquiry Cart button — desktop only */}
          <button
            type="button"
            onClick={toggleCart}
            className="hidden md:inline-flex relative items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-50/80 px-3 py-1.5 text-xs font-semibold text-stone-800 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            aria-label={`Enquiry List with ${totalCount} items`}
          >
            <span>📋</span>
            <span>{t('navCart')}</span>
            {totalCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-1.5 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
                {totalCount}
              </span>
            )}
          </button>

          {/* Mobile: Hamburger menu */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-stone-200/90 bg-stone-50/80 text-stone-700 transition duration-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="text-base leading-none">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile slide-down drawer menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Nav links */}
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navRoutes.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive: active }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                    active
                      ? 'bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-300'
                      : 'text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800'
                  }`
                }
              >
                {to === '/' ? '🏠' : to === '/catalog' ? '📦' : '📍'} {label}
                {isActive(to, end) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-amber-500" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-4 border-t border-stone-100 dark:border-stone-800" />

          {/* Settings row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Language & Theme
            </span>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Cart button */}
          <button
            type="button"
            onClick={() => { setMenuOpen(false); toggleCart() }}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-3 text-sm font-bold text-amber-900 transition hover:bg-amber-100 cursor-pointer dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
          >
            <span>📋</span>
            <span>{t('navCart')}</span>
            {totalCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-1.5 text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  )
}
