import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import WhatsAppButton from './components/WhatsAppButton'
import MobileActionBar from './components/MobileActionBar'
import ErrorBoundary from './components/ErrorBoundary'
import PageSkeleton from './components/PageSkeleton'
import SearchPalette from './components/SearchPalette'
import ScrollToTop from './components/ScrollToTop'
import OfflineBanner from './components/OfflineBanner'
import { AppProviders } from './context/AppProviders'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home'

const Catalog = lazy(() => import('./pages/Catalog'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 pb-24 sm:py-8 md:pb-8">
              <Suspense fallback={<PageSkeleton />}>
                <div className="page-transition">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/catalog/:category" element={<CategoryPage />} />
                    <Route path="/catalog/:category/:model" element={<CategoryPage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </Suspense>
            </main>
            <Footer />
            <WhatsAppButton />
            <MobileActionBar />
            <CartDrawer />
            <SearchPalette />
            <OfflineBanner />
            <Analytics />
          </div>
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  )
}
