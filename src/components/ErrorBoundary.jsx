import { Component } from 'react'
import { AlertTriangleIcon, HomeIcon, RefreshIcon, WhatsAppIcon } from './Icons'

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
              <AlertTriangleIcon className="h-8 w-8 text-amber-500" />
            </div>

            {/* Heading */}
            <h1 className="font-heading text-2xl font-bold tracking-tight text-stone-50 sm:text-3xl">
              Oops! Something broke.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">
              An unexpected error occurred while loading this page.
              Please try reloading — if the issue persists, contact us directly on WhatsApp.
            </p>

            {/* Action buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-95 cursor-pointer"
              >
                <RefreshIcon className="h-4 w-4" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-6 py-3 text-sm font-semibold text-stone-200 transition-all duration-200 hover:border-stone-600 hover:bg-stone-700 active:scale-95 cursor-pointer"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* WhatsApp fallback */}
            <a
              href="https://wa.me/918421009925?text=Hi%2C%20the%20JBE%20website%20is%20showing%20an%20error.%20Please%20help!"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 px-5 py-2.5 text-sm font-semibold text-[#25D366] transition-all duration-200 hover:bg-[#25D366]/20 active:scale-95 cursor-pointer w-full"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Chat on WhatsApp — +91 84210 09925</span>
            </a>

            {/* Collapsible error details */}
            {error && (
              <div className="mt-6 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex w-full items-center justify-between rounded-lg border border-stone-800 bg-stone-800/50 px-4 py-2.5 text-xs font-mono text-stone-500 transition hover:text-stone-400 cursor-pointer"
                >
                  <span>Error details</span>
                  <span className={`transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}>▼</span>
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
          <p className="relative z-10 mt-8 text-xs text-stone-600">
            Jai Baba Electronic · Malkapur, Maharashtra
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
