import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useSearch } from '../context/useSearch'
import { shop } from '../data/site'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'

// JS-based mobile detection — immune to CSS rem scaling and system font size changes
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : true
  )
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
  }, [breakpoint])
  return isMobile
}

export default function Navbar() {
  const { totalCount, toggleCart } = useCart()
  const { openSearch } = useSearch()
  const { t } = useLanguage()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile(1024) // hamburger below 1024px

  const navContainerRef = useRef(null)
  const linkRefs = useRef({})
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navRoutes = [
    { to: '/', label: t('navHome'), end: true, icon: '🏠' },
    { to: '/catalog', label: t('navCatalog'), end: false, icon: '📦' },
    { to: '/contact', label: t('navContact'), end: false, icon: '📍' },
  ]

  // Update sliding indicator position
  useEffect(() => {
    if (isMobile) return

    const updateIndicator = () => {
      const activeRoute =
        navRoutes.find((r) =>
          r.end ? location.pathname === r.to : location.pathname.startsWith(r.to)
        ) || (location.pathname.startsWith('/catalog') ? navRoutes[1] : null)
      const activeKey = activeRoute ? activeRoute.to : null
      const activeEl = activeKey ? linkRefs.current[activeKey] : null

      if (activeEl && navContainerRef.current) {
        const containerRect = navContainerRef.current.getBoundingClientRect()
        const elRect = activeEl.getBoundingClientRect()
        setIndicatorStyle({
          left: elRect.left - containerRect.left,
          width: elRect.width,
          opacity: 1,
        })
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
      }
    }

    updateIndicator()
    // Small timeout to allow font layout settlement
    const timer = setTimeout(updateIndicator, 50)
    window.addEventListener('resize', updateIndicator)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateIndicator)
    }
  }, [location.pathname, isMobile, t])

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur-md transition-all duration-300 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.05)] dark:border-stone-800 dark:bg-stone-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2 font-extrabold text-stone-900 tracking-tight transition duration-200 hover:opacity-90 dark:text-stone-100"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white text-sm font-black shadow-md shadow-amber-500/20 transition duration-300 group-hover:scale-105">
            ⚡
          </span>
          <span className="font-heading font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-tight text-sm sm:text-base dark:text-stone-100 dark:group-hover:text-amber-400">
            {isMobile ? 'Jai Baba' : shop.name}
          </span>
        </Link>

        {/* Desktop Nav — only shown when not mobile */}
        {!isMobile && (
          <div className="relative" role="navigation">
            <ul
              ref={navContainerRef}
              className="relative flex items-center gap-1 rounded-full border border-stone-200/80 bg-stone-100/70 p-1 backdrop-blur-xs dark:border-stone-800 dark:bg-stone-900/70"
            >
              {/* Animated sliding pill */}
              <span
                className="absolute top-1 bottom-1 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-amber-200/60 dark:bg-amber-950/80 dark:border-amber-700/60 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
              />

              {navRoutes.map(({ to, label, end }) => (
                <li key={to} className="relative z-10">
                  <NavLink
                    ref={(el) => {
                      if (el) linkRefs.current[to] = el
                    }}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 inline-block ${
                        isActive
                          ? 'text-amber-900 dark:text-amber-300 font-bold'
                          : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5">
          {/* Search — always visible */}
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-50/80 px-2.5 py-2 text-xs font-semibold text-stone-600 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-stone-900 cursor-pointer dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-amber-400 dark:hover:bg-stone-700"
            aria-label="Search catalog (Ctrl+K)"
          >
            <span className="text-sm">🔍</span>
            {!isMobile && <span className="text-stone-500 font-normal dark:text-stone-400">Search...</span>}
            {!isMobile && (
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-400 shadow-2xs dark:border-stone-700 dark:bg-stone-900 dark:text-stone-400">
                ⌘K
              </kbd>
            )}
          </button>

          {/* Desktop controls — language, theme, cart */}
          {!isMobile && (
            <>
              <LanguageSelector />
              <ThemeToggle />
              <button
                type="button"
                onClick={toggleCart}
                className="relative inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-50/80 px-3 py-1.5 text-xs font-semibold text-stone-800 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-amber-900 cursor-pointer dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-200 dark:hover:border-amber-400 dark:hover:bg-stone-700"
                aria-label={`Enquiry List with ${totalCount} items`}
              >
                <span>📋</span>
                <span>{t('navCart')}</span>
                {totalCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-1.5 text-[10px] font-bold text-white shadow-xs">
                    {totalCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Mobile cart icon */}
          {isMobile && (
            <button
              type="button"
              onClick={toggleCart}
              className="relative inline-flex items-center justify-center h-9 w-9 rounded-full border border-stone-200/90 bg-stone-50/80 text-stone-700 transition duration-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300"
              aria-label={`Enquiry List with ${totalCount} items`}
            >
              <span className="text-sm">📋</span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-1 text-[9px] font-bold text-white shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-stone-200/90 bg-stone-50/80 text-stone-700 transition duration-200 hover:border-amber-400 hover:bg-amber-50 cursor-pointer dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="text-base leading-none select-none">{menuOpen ? '✕' : '☰'}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {isMobile && menuOpen && (
        <div
          className="border-t border-stone-100 bg-white/98 px-4 py-4 dark:border-stone-800 dark:bg-stone-950/98"
          style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            {navRoutes.map(({ to, label, end, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-900'
                  }`
                }
              >
                <span className="text-base">{icon}</span>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="my-4 border-t border-stone-100 dark:border-stone-800" />

          {/* Language & theme */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Language &amp; Theme
            </span>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={() => { setMenuOpen(false); toggleCart() }}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-3.5 text-sm font-bold text-amber-900 transition hover:bg-amber-100 cursor-pointer dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
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
