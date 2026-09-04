import { useEffect, useState } from 'react'
import { useLanguage } from '../context/useLanguage'

export default function OfflineBanner() {
  const { t } = useLanguage()
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
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
      const dismissed = sessionStorage.getItem('jbe_pwa_dismissed')
      if (!dismissed) {
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
    sessionStorage.setItem('jbe_pwa_dismissed', 'true')
  }

  return (
    <>
      {/* Offline Status Bar */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Offline Mode Notification"
          className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full bg-stone-900/95 text-white px-4 py-2 text-xs md:text-sm font-medium shadow-2xl border border-amber-500/30 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300"
        >
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>⚡ {t('offlineNotice')}</span>
        </aside>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && !installed && (
        <aside
          role="region"
          aria-label="App Installation Prompt"
          className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm rounded-2xl bg-white dark:bg-stone-900 border border-amber-200 dark:border-stone-700 p-3.5 shadow-xl shadow-stone-900/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-white text-lg shadow-md shadow-amber-500/20">
              ⚡
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                {t('installApp')}
              </h4>
              <p className="mt-0.5 text-[11px] leading-tight text-stone-600 dark:text-stone-300">
                {t('installAppDesc')}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-xs hover:from-amber-700 hover:to-orange-600 transition cursor-pointer"
                >
                  {t('installApp')}
                </button>
                <button
                  type="button"
                  onClick={handleDismissInstall}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition cursor-pointer"
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
