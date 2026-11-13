import { Fragment, lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import CartDrawer from './components/CartDrawer'
import CompareTray from './components/CompareTray'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import MobileActionBar from './components/MobileActionBar'
import Navbar from './components/Navbar'
import OfflineBanner from './components/OfflineBanner'
import ScrollToTop from './components/ScrollToTop'
import SearchPalette from './components/SearchPalette'
import SkipLink from './components/SkipLink'
import WhatsAppButton from './components/WhatsAppButton'
import { AppProviders } from './context/AppProviders'
import { ROUTE_PREFIXES } from './i18n/paths'
import { markHydrated } from './utils/hydration'
import About from './pages/About'
import Catalog from './pages/Catalog'
import CategoryPage from './pages/CategoryPage'
import Compare from './pages/Compare'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Guide from './pages/Guide'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Season from './pages/Season'

// Service-worker registration only exists in the browser; it is never part of pre-rendering.
// Optional: if its chunk can't load (offline, or a tab left open across a deploy), render nothing
// instead of letting the error reach the error boundary.
const UpdatePrompt = lazy(() => import('./components/UpdatePrompt').catch(() => ({ default: () => null })))

// Every page is imported directly (no lazy routes) so each one can be pre-rendered to HTML at
// build time and hydrated without a loading state.
const PAGES = [
  ['/', Home],
  ['/catalog', Catalog],
  ['/catalog/:category', CategoryPage],
  ['/catalog/:category/:model', CategoryPage],
  ['/contact', Contact],
  ['/guide', Guide],
  ['/faq', Faq],
  ['/season/:season', Season],
  ['/about', About],
  ['/compare', Compare],
]

function useHasMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    markHydrated()
    setMounted(true)
  }, [])
  return mounted
}

/** The site inside a router. Used by the browser (BrowserRouter) and the pre-renderer (StaticRouter). */
export function AppShell() {
  const mounted = useHasMounted()

  return (
    <AppProviders>
      <ScrollToTop />
      <SkipLink />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main" tabIndex={-1} className="mx-auto w-full outline-none max-w-6xl flex-1 px-4 py-5 pb-24 sm:py-8 md:pb-8">
          <div className="page-transition">
            <Routes>
              {/* Each page under every language prefix: /catalog, /mr/catalog, /hi/catalog … */}
              {ROUTE_PREFIXES.map((prefix) => (
                <Fragment key={prefix || 'en'}>
                  {PAGES.map(([path, Page]) => (
                    <Route key={path} path={prefix + (path === '/' && prefix ? '' : path)} element={<Page />} />
                  ))}
                </Fragment>
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileActionBar />
        <CompareTray />
        <CartDrawer />
        <SearchPalette />
        <OfflineBanner />
        <Analytics />
        {mounted && (
          <Suspense fallback={null}>
            <UpdatePrompt />
          </Suspense>
        )}
      </div>
    </AppProviders>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
