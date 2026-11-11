import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { CloseIcon, WifiOffIcon } from './Icons'

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
  const [isOffline, setIsOffline] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setIsOffline(!navigator.onLine)
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

  const bannerVisible = showInstallBanner && engaged && !installed

  // Reserve space at the bottom of the page while the banner is docked (see index.css).
  useEffect(() => {
    document.body.classList.toggle('install-banner-open', bannerVisible)
    return () => document.body.classList.remove('install-banner-open')
  }, [bannerVisible])

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

      {/* PWA Install Banner.
          Phones: a compact strip docked directly above the bottom action bar; the footer gets
          matching extra padding (body.install-banner-open) so no content is ever covered.
          Desktop: a card in the corner, stacked above the floating WhatsApp button. */}
      {bannerVisible && (
        <aside
          role="region"
          aria-label={t('installRegionLabel')}
          className="fixed inset-x-0 bottom-18 z-40 border-t border-stone-200 bg-white px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] animate-slide-in-up md:inset-x-auto md:bottom-24 md:right-6 md:max-w-sm md:rounded-2xl md:border md:p-4 md:shadow-xl md:shadow-stone-900/10"
        >
          <div className="mx-auto flex max-w-md items-center gap-3 md:items-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-700 text-white text-[11px] font-black tracking-tight shadow-sm md:h-10 md:w-10" aria-hidden="true">
              JBE
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900">{t('installApp')}</p>
              <p className="mt-0.5 hidden text-[11px] leading-tight text-stone-600 md:block">{t('installAppDesc')}</p>
              <div className="mt-2.5 hidden items-center gap-2 md:flex">
                <button type="button" onClick={handleInstallClick} className="btn btn-primary min-h-9 px-3 py-1.5 text-xs">
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
            {/* Phone layout: actions inline on the right */}
            <div className="flex shrink-0 items-center gap-1 md:hidden">
              <button type="button" onClick={handleInstallClick} className="btn btn-primary min-h-9 px-3 py-1.5 text-xs">
                {t('installApp')}
              </button>
              <button
                type="button"
                onClick={handleDismissInstall}
                aria-label={t('dismiss')}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
