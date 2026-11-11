import { useLanguage } from '../context/useLanguage'

/** First focusable element on every page; jumps keyboard users past the header to <main id="main">. */
export default function SkipLink() {
  const { t } = useLanguage()

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-xl focus:bg-amber-700 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
    >
      {t('skipToContent')}
    </a>
  )
}
