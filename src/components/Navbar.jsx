import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useSearch } from '../context/useSearch'
import { shop } from '../data/site'
import LanguageSelector from './LanguageSelector'
import {
  HomeIcon,
  PackageIcon,
  MapPinIcon,
  SearchIcon,
  CartIcon,
  MenuIcon,
  CloseIcon,
  InfoIcon,
  TagIcon,
} from './Icons'

/**
 * Site header. Desktop vs phone layout is decided by CSS breakpoints (lg = 1024px), not by
 * reading the window size in JavaScript, so the pre-rendered HTML and the browser's first
 * render are identical (required for hydration) and there is no layout jump on load.
 */
export default function Navbar() {
  const { totalCount, toggleCart } = useCart()
  const { openSearch } = useSearch()
  const { t, href } = useLanguage()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  // Platform-specific shortcut label is filled in after mount (the server can't know it).
  const [searchShortcut, setSearchShortcut] = useState('Ctrl+K')

  const navContainerRef = useRef(null)
  const headerRef = useRef(null)
  const linkRefs = useRef({})
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (/Mac|iPhone|iPad|iPod/i.test(navigator.platform)) setSearchShortcut('⌘K')
  }, [])

  // Scroll-aware navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [menuOpen])

  const navRoutes = useMemo(() => [
    { to: href('/'), label: t('navHome'), end: true, Icon: HomeIcon },
    { to: href('/catalog'), label: t('navCatalog'), end: false, Icon: PackageIcon },
    { to: href('/guide'), label: t('navGuide'), end: false, Icon: TagIcon },
    { to: href('/faq'), label: t('navFaq'), end: false, Icon: InfoIcon },
    { to: href('/contact'), label: t('navContact'), end: false, Icon: MapPinIcon },
  ], [t, href])

  // Sliding pill behind the active desktop link (hidden while the desktop nav is not displayed).
  useEffect(() => {
    const updateIndicator = () => {
      const activeRoute =
        navRoutes.find((r) =>
          r.end ? location.pathname === r.to : location.pathname.startsWith(r.to)
        ) || (location.pathname.startsWith(href('/catalog')) ? navRoutes[1] : null)
      const activeEl = activeRoute ? linkRefs.current[activeRoute.to] : null
      const elRect = activeEl?.getBoundingClientRect()

      if (elRect && elRect.width > 0 && navContainerRef.current) {
        const containerRect = navContainerRef.current.getBoundingClientRect()
        setIndicatorStyle({ left: elRect.left - containerRect.left, width: elRect.width, opacity: 1 })
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
  }, [location.pathname, navRoutes, href])

  const cartBadge = (className) =>
    totalCount > 0 && (
      <span className={className} aria-hidden="true">
        {totalCount}
      </span>
    )

  return (
    <header ref={headerRef} className={`sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo / Shop Identity */}
        <Link
          to={href('/')}
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-2.5 font-bold text-stone-900 tracking-tight transition duration-150 hover:opacity-95"
        >
          <span className="shimmer-on-hover flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white text-xs font-black tracking-wider shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:shadow-md">
            JBE
          </span>
          <span className="font-heading font-bold text-stone-900 group-hover:text-amber-700 transition-colors leading-tight text-xs sm:text-base">
            {shop.name}
          </span>
        </Link>

        {/* Desktop nav (≥ 1024px) */}
        <div className="relative hidden lg:block" role="navigation" aria-label={t('mainNavigation')}>
          <ul
            ref={navContainerRef}
            className="relative flex items-center gap-1 rounded-full border border-stone-200/80 bg-stone-100/70 p-1 backdrop-blur-xs"
          >
            {/* Animated sliding pill */}
            <span
              className="absolute top-1 bottom-1 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-amber-200/60 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
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
                        ? 'text-amber-900 font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right-side controls */}
        <div className="flex items-center gap-1.5">
          {/* Search — always visible */}
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-600 transition duration-150 hover:border-amber-400 hover:bg-white hover:text-stone-900 cursor-pointer"
            aria-label={t('searchButtonLabel', { shortcut: searchShortcut })}
          >
            <SearchIcon className="h-3.5 w-3.5 text-stone-600" />
            <span className="hidden text-stone-600 font-normal lg:inline">{t('searchShort')}</span>
            <kbd className="hidden rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-500 shadow-2xs lg:inline" aria-hidden="true">
              {searchShortcut}
            </kbd>
          </button>

          {/* Desktop: language + enquiry list */}
          <div className="hidden items-center gap-1.5 lg:flex">
            <LanguageSelector />
            <button
              type="button"
              onClick={toggleCart}
              className="relative inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 transition duration-150 hover:border-amber-400 hover:bg-white hover:text-amber-900 cursor-pointer"
              aria-label={t('enquiryListCount', { count: totalCount })}
            >
              <CartIcon className="h-3.5 w-3.5 text-stone-600" />
              <span>{t('navCart')}</span>
              {cartBadge('flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1.5 text-[10px] font-bold text-white shadow-xs')}
            </button>
          </div>

          {/* Phone: enquiry list icon */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition duration-150 hover:border-amber-400 hover:bg-white cursor-pointer lg:hidden"
            aria-label={t('enquiryListCount', { count: totalCount })}
          >
            <CartIcon className="h-4 w-4" />
            {cartBadge('absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[9px] font-bold text-white shadow-xs')}
          </button>

          {/* Phone: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition duration-150 hover:border-amber-400 hover:bg-white cursor-pointer lg:hidden"
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Phone drawer menu */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`grid overflow-hidden border-t border-stone-200 bg-white px-4 transition-[grid-template-rows,opacity,padding] duration-200 lg:hidden ${menuOpen ? 'grid-rows-[1fr] py-4 opacity-100' : 'grid-rows-[0fr] py-0 opacity-0'}`}
      >
        <div className="min-h-0">
          {/* Nav links */}
          <nav className="flex flex-col gap-1" aria-label={t('mainNavigation')}>
            {navRoutes.map(({ to, label, end, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                <Icon className="h-4 w-4 text-stone-600" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="my-4 border-t border-stone-100" />

          {/* Language */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              {t('language')}
            </span>
            <div className="flex items-center gap-2">
              <LanguageSelector />
            </div>
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={() => { setMenuOpen(false); toggleCart() }}
            aria-label={t('enquiryListCount', { count: totalCount })}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-3.5 text-sm font-bold text-amber-900 transition hover:bg-amber-100 cursor-pointer"
          >
            <CartIcon className="h-4 w-4 text-amber-800" />
            <span>{t('navCart')}</span>
            {cartBadge('flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1.5 text-[10px] font-bold text-white')}
          </button>
        </div>
      </div>
    </header>
  )
}
