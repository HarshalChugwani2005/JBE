/**
 * Minimal crash reporting to Sentry (free tier), without the Sentry SDK.
 *
 * Off unless VITE_SENTRY_DSN is set (Vercel → Project → Settings → Environment Variables).
 * Reports React render crashes (ErrorBoundary), uncaught errors and unhandled promise
 * rejections, at most a few per page view. No personal data is sent: only the error, the page
 * URL, the browser user agent and the site language.
 */
const DSN = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SENTRY_DSN) || ''
const MAX_REPORTS_PER_PAGE = 5

function envelopeEndpoint(dsn) {
  try {
    const url = new URL(dsn)
    const projectId = url.pathname.replace(/^\/+/, '')
    if (!url.username || !projectId) return null
    return `${url.protocol}//${url.host}/api/${projectId}/envelope/?sentry_key=${url.username}&sentry_version=7`
  } catch {
    return null
  }
}

const endpoint = DSN ? envelopeEndpoint(DSN) : null
let reportsSent = 0

export function isErrorReportingEnabled() {
  return Boolean(endpoint)
}

/** Sends one error to Sentry (no-op when not configured or after the per-page limit). */
export function reportError(error, context = {}) {
  if (!endpoint || typeof window === 'undefined' || reportsSent >= MAX_REPORTS_PER_PAGE) return
  reportsSent += 1

  const eventId = (crypto.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^a-f0-9]/gi, '').slice(0, 32).padEnd(32, '0')
  const err = error instanceof Error ? error : new Error(String(error))
  const event = {
    event_id: eventId,
    timestamp: Date.now() / 1000,
    platform: 'javascript',
    level: 'error',
    environment: import.meta.env?.MODE ?? 'production',
    request: { url: window.location.href, headers: { 'User-Agent': navigator.userAgent } },
    tags: { lang: document.documentElement.lang || 'en', source: context.source ?? 'unknown' },
    exception: { values: [{ type: err.name || 'Error', value: err.message || String(error) }] },
    extra: { stack: err.stack?.slice(0, 4000), ...context },
  }
  const body = [
    JSON.stringify({ event_id: eventId, sent_at: new Date().toISOString() }),
    JSON.stringify({ type: 'event' }),
    JSON.stringify(event),
  ].join('\n')

  fetch(endpoint, { method: 'POST', body, keepalive: true }).catch(() => {})
}

/** Global listeners for errors that happen outside React rendering. */
export function installErrorReporting() {
  if (!endpoint) return
  window.addEventListener('error', (event) => reportError(event.error ?? event.message, { source: 'window.error' }))
  window.addEventListener('unhandledrejection', (event) => reportError(event.reason, { source: 'unhandledrejection' }))
}
