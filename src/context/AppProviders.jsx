import { CartProvider } from './CartProvider'
import { CompareProvider } from './CompareProvider'
import { LanguageProvider } from './LanguageProvider'
import { SearchProvider } from './SearchProvider'
import { ToastProvider } from './ToastProvider'

/**
 * Composes all app-level React context providers into a single wrapper.
 * Keeps App.jsx clean and makes provider order explicit in one place.
 * Order (outermost → innermost): Language → Toast → Cart → Compare → Search
 */
export function AppProviders({ children }) {
  return (
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <CompareProvider>
              <SearchProvider>
                {children}
              </SearchProvider>
            </CompareProvider>
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
  )
}
