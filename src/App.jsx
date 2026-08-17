import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import WhatsAppButton from './components/WhatsAppButton'
import MobileActionBar from './components/MobileActionBar'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import { CartProvider } from './context/CartProvider'
import { LanguageProvider } from './context/LanguageProvider'
import { ToastProvider } from './context/ToastProvider'
import { Analytics } from '@vercel/analytics/react'
import Home from './pages/Home'

const Catalog = lazy(() => import('./pages/Catalog'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 pb-20 md:pb-8">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/catalog" element={<Catalog />} />
                      <Route path="/catalog/:category" element={<CategoryPage />} />
                      <Route path="/catalog/:category/:model" element={<CategoryPage />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <WhatsAppButton />
                <MobileActionBar />
                <CartDrawer />
                <Analytics />
              </div>
            </BrowserRouter>
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}
