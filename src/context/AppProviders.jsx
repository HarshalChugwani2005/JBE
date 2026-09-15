import { CartProvider } from './CartProvider'
import { LanguageProvider } from './LanguageProvider'
import { SearchProvider } from './SearchProvider'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'

/**
 * Composes all app-level React context providers into a single wrapper.
 * Keeps App.jsx clean and makes provider order explicit in one place.
 * Order (outermost → innermost): Theme → Language → Toast → Cart → Search
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
