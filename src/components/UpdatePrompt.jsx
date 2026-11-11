import { useRegisterSW } from 'virtual:pwa-register/react'
import { useLanguage } from '../context/useLanguage'
import { RefreshIcon } from './Icons'

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000 // look for a new deploy once an hour

/**
 * Registers the service worker and, when a new version of the site has been deployed,
 * asks the visitor to refresh instead of reloading the page under them (which would
 * lose a half-typed form or an open product).
 */
export default function UpdatePrompt() {
  const { t } = useLanguage()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      setInterval(() => {
        if (navigator.onLine) registration.update().catch(() => {})
      }, UPDATE_CHECK_INTERVAL_MS)
    },
  })

  if (!needRefresh) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 top-3 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-white shadow-2xl animate-slide-in-up"
    >
      <RefreshIcon className="h-4 w-4 shrink-0 text-amber-400" />
      <p className="flex-1 text-xs font-medium sm:text-sm">{t('updateAvailable')}</p>
      <button type="button" onClick={() => updateServiceWorker(true)} className="btn btn-primary min-h-9 px-3 py-1.5 text-xs">
        {t('refresh')}
      </button>
      <button
        type="button"
        onClick={() => setNeedRefresh(false)}
        className="min-h-9 rounded-lg px-2 text-xs font-medium text-stone-300 hover:text-white cursor-pointer"
      >
        {t('later')}
      </button>
    </div>
  )
}
