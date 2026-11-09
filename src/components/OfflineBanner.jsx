import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { WifiOffIcon } from './Icons'

// The install prompt waits until the visitor has shown interest (a second page
// or some time on site) instead of covering the page on first load.
const INSTALL_MIN_PAGE_VIEWS = 2
const INSTALL_MIN_TIME_MS = 45_000
const INSTALL_DISMISS_KEY = 'jbe_pwa_dismissed_at'
const INSTALL_DISMISS_DAYS = 14

function wasDismissedRecently() {
  try {
    const at = Number(localStorage.getItem(INSTALL_DISMISS_KEY))
    return at > 0 && Date.now() - at < INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export default function OfflineBanner() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const pageViews = useRef(0)
  const [engaged, setEngaged] = useState(false)
  const [isOffline, setIsOffline] = useState(() => (
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  ))
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Capture PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (!wasDismissedRecently()) {
        setShowInstallBanner(true)
      }
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Count distinct page views; the second one marks the visitor as engaged.
  useEffect(() => {
    pageViews.current += 1
    if (pageViews.current >= INSTALL_MIN_PAGE_VIEWS) setEngaged(true)
  }, [pathname])

  useEffect(() => {
    const timer = setTimeout(() => setEngaged(true), INSTALL_MIN_TIME_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismissInstall = () => {
    setShowInstallBanner(false)
    try {
      localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()))
    } catch {
      // The banner is still dismissed for the current render when storage is unavailable.
    }
  }

  return (
    <>
      {/* Offline Status Bar */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          aria-label={t('offlineRegionLabel')}
          className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-stone-900 text-white px-4 py-2 text-xs md:text-sm font-medium shadow-2xl border border-stone-700 animate-slide-in-up"
        >
          <WifiOffIcon className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{t('offlineNotice')}</span>
        </aside>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && engaged && !installed && (
        <aside
          role="region"
          aria-label={t('installRegionLabel')}
          className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm rounded-2xl bg-white border border-stone-200 p-4 shadow-xl shadow-stone-900/10 animate-slide-in-up"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-700 text-white text-xs font-black tracking-tight shadow-sm" aria-hidden="true">
              JBE
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-bold text-stone-900">
                {t('installApp')}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-stone-600">
                {t('installAppDesc')}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="btn btn-primary min-h-9 px-3 py-1.5 text-xs"
                >
                  {t('installApp')}
                </button>
                <button
                  type="button"
                  onClick={handleDismissInstall}
                  className="min-h-9 rounded-lg px-2 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition cursor-pointer"
                >
                  {t('dismiss')}
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
