/**
 * Server entry used only at build time (scripts/prerender.js) to turn each route into HTML.
 * Built with `vite build --ssr src/entry-server.jsx`; never shipped to the browser.
 */
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { AppShell } from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
// Pre-rendering needs every language available synchronously.
import './i18n/allLocales.js'

export function render(url) {
  return renderToString(
    <ErrorBoundary>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </ErrorBoundary>,
  )
}
