import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useSearch } from '../context/useSearch'
import { shop } from '../data/site'
import LanguageSelector from './LanguageSelector'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { totalCount, toggleCart } = useCart()
  const { openSearch } = useSearch()
  const { t } = useLanguage()
  const location = useLocation()

  const navRef = useRef(null)
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 })
  const linkRefs = useRef({})

  // Nav routes in order
  const navRoutes = [
    { to: '/', label: t('navHome'), end: true },
    { to: '/catalog', label: t('navCatalog'), end: false },
    { to: '/contact', label: t('navContact'), end: false },
  ]

  // Determine active route
  const getActiveRoute = () => {
    if (location.pathname === '/') return '/'
    if (location.pathname.startsWith('/catalog')) return '/catalog'
    if (location.pathname.startsWith('/contact')) return '/contact'
    return null
  }

  // Update pill position/size whenever location or layout changes
  useEffect(() => {
    const activeKey = getActiveRoute()
    if (!activeKey || !navRef.current) {
      setPill((p) => ({ ...p, opacity: 0 }))
      return
    }

    const activeEl = linkRefs.current[activeKey]
    if (!activeEl) return

    const navRect = navRef.current.getBoundingClientRect()
    const elRect = activeEl.getBoundingClientRect()

    setPill({
      left: elRect.left - navRect.left,
      width: elRect.width,
      opacity: 1,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // Also reposition on resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const activeKey = getActiveRoute()
      if (!activeKey || !navRef.current) return
      const activeEl = linkRefs.current[activeKey]
      if (!activeEl) return
      const navRect = navRef.current.getBoundingClientRect()
      const elRect = activeEl.getBoundingClientRect()
      setPill({ left: elRect.left - navRect.left, width: elRect.width, opacity: 1 })
    })

    if (navRef.current) observer.observe(navRef.current)
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/80 backdrop-blur-md transition-all duration-300 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 md:py-3.5">
        <Link
          to="/"
          className="group flex items-center gap-2.5 text-base font-extrabold text-stone-900 md:text-lg tracking-tight transition duration-200 hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white text-sm font-black shadow-md shadow-amber-500/20 transition duration-300 group-hover:scale-105 group-hover:shadow-amber-500/30">
            ⚡
          </span>
          <span className="font-heading font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
            {shop.name}
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Nav Links with animated sliding pill */}
          <ul
            ref={navRef}
            className="relative flex items-center gap-1 sm:gap-1.5"
            role="navigation"
          >
            {/* Animated sliding indicator pill */}
            <span
              aria-hidden="true"
              className="nav-pill-indicator"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.opacity,
              }}
            />

            {navRoutes.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  ref={(el) => { linkRefs.current[to] = el }}
                  className={({ isActive }) =>
                    `relative z-10 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-amber-900 font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={openSearch}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-stone-200/90 bg-stone-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-stone-600 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-stone-900 hover:shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
            aria-label="Search catalog (Ctrl+K or ⌘K)"
            title="Search catalog (Ctrl+K or ⌘K)"
          >
            <span className="text-xs sm:text-sm">🔍</span>
            <span className="hidden md:inline text-stone-500 font-normal">Search...</span>
            <kbd className="hidden sm:inline-block rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          <LanguageSelector />
          <ThemeToggle />

          {/* Enquiry List Trigger Button */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative inline-flex items-center gap-1.5 rounded-full border border-stone-200/90 bg-stone-50/80 px-3.5 py-1.5 text-xs font-semibold text-stone-800 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-amber-900 hover:shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer"
            aria-label={`Enquiry List with ${totalCount} items`}
          >
            <span>📋</span>
            <span className="hidden sm:inline">{t('navCart')}</span>
            {totalCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-1.5 text-[10px] font-bold text-white shadow-xs animate-in zoom-in-50 duration-200">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
