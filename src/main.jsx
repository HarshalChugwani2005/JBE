import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { langFromPath } from './i18n/paths'
import { loadLocale } from './i18n/registry'
import { installAnalytics } from './utils/analytics'
import { installErrorReporting } from './utils/errorReporting'

installErrorReporting()
installAnalytics()

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Load the page language's strings first, so the first render — and the hydration of the
// pre-rendered HTML — is already in that language (no flash of English).
loadLocale(langFromPath(window.location.pathname)).finally(() => {
  if (container.hasChildNodes()) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
})
