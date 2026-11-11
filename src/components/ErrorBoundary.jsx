import { Component } from 'react'
import { getWhatsAppUrl, shop } from '../data/site'
import { DEFAULT_LANG, SUPPORTED_LANGS, translate } from '../i18n/format'
import { buildErrorReport } from '../i18n/whatsappMessages'
import { AlertTriangleIcon, HomeIcon, RefreshIcon, WhatsAppIcon } from './Icons'

/**
 * This boundary wraps the providers, so it cannot use useLanguage().
 * LanguageProvider mirrors the active language onto <html lang>, which we read instead.
 */
function currentLang() {
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : ''
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, detailsOpen: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, detailsOpen: false })
    window.location.href = '/'
  }

  toggleDetails = () => {
    this.setState((s) => ({ detailsOpen: !s.detailsOpen }))
  }

  render() {
    if (this.state.hasError) {
      const { error, detailsOpen } = this.state
      const lang = currentLang()
      const t = (key, vars) => translate(lang, key, vars)
      const whatsappNumber = shop.whatsapp.replace(/\D/g, '').slice(-10)
      return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-stone-950 px-4 py-16">
          {/* Card */}
          <div
            role="alert"
            aria-live="assertive"
            className="relative z-10 w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900 p-8 shadow-2xl text-center"
            style={{ animation: 'errBounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            {/* Logo / Alert mark */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow-sm select-none">
              <AlertTriangleIcon className="h-8 w-8 text-amber-400" />
            </div>

            {/* Heading */}
            <h1 className="font-heading text-2xl font-bold tracking-tight text-stone-50 sm:text-3xl">
              {t('errorTitle')}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-300">
              {t('errorText')}
            </p>

            {/* Action buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary px-6 py-3"
              >
                <RefreshIcon className="h-4 w-4" />
                <span>{t('reloadPage')}</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn border border-stone-700 bg-stone-800 px-6 py-3 text-stone-100 hover:border-stone-600 hover:bg-stone-700"
              >
                <HomeIcon className="h-4 w-4" />
                <span>{t('backToHome')}</span>
              </button>
            </div>

            {/* WhatsApp fallback */}
            <a
              href={getWhatsAppUrl(buildErrorReport(lang))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp mt-5 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>{t('chatWhatsApp')} — +91 {whatsappNumber}</span>
            </a>

            {/* Collapsible error details — only in dev mode */}
            {import.meta.env.DEV && error && (
              <div className="mt-6 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  aria-expanded={detailsOpen}
                  className="flex w-full items-center justify-between rounded-lg border border-stone-800 bg-stone-800/50 px-4 py-2.5 text-xs font-mono text-stone-400 transition hover:text-stone-300 cursor-pointer"
                >
                  <span>{t('errorDetails')}</span>
                  <span aria-hidden="true" className={`transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {detailsOpen && (
                  <pre className="mt-1 max-h-36 overflow-auto rounded-b-lg border border-t-0 border-stone-800 bg-stone-950 px-4 py-3 text-[11px] leading-relaxed text-red-400 whitespace-pre-wrap break-words">
                    {error.message}
                    {'\n\n'}
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Shop branding footer */}
          <p className="relative z-10 mt-8 text-xs text-stone-400">
            {shop.name} · {t('shopCity')}
          </p>

          <style>{`
            @keyframes errBounceIn {
              from { opacity: 0; transform: scale(0.88) translateY(16px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}
