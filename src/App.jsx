import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import WhatsAppButton from './components/WhatsAppButton'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import Catalog from './pages/Catalog'
import CategoryPage from './pages/CategoryPage'
import Contact from './pages/Contact'
import Home from './pages/Home'

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/catalog/:category" element={<CategoryPage />} />
                <Route path="/catalog/:category/:model" element={<CategoryPage />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <CartDrawer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </LanguageProvider>
  )
}
