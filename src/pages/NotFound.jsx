import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import { HomeIcon, PackageIcon, WhatsAppIcon } from '../components/Icons'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { getWhatsAppUrl } from '../data/site'
import { buildGreeting } from '../i18n/whatsappMessages'
import { trackWhatsAppClick } from '../utils/analytics'

export default function NotFound() {
  const { t, lang, href } = useLanguage()

  return (
    <>
      <SEO title={t('notFoundTitle')} description={t('seoNotFoundDescription')} noindex />
      <EmptyState
        as="h1"
        visual={
          <p
            aria-hidden="true"
            className="font-heading bg-linear-to-tr from-amber-700 to-orange-600 bg-clip-text text-7xl font-extrabold text-transparent"
          >
            404
          </p>
        }
        title={t('notFoundTitle')}
        description={t('notFoundText')}
      >
        <Link to={href('/')} className="btn btn-primary px-6">
          <HomeIcon className="h-4 w-4" />
          <span>{t('goHome')}</span>
        </Link>
        <Link to={href('/catalog')} className="btn btn-secondary px-6">
          <PackageIcon className="h-4 w-4" />
          <span>{t('heroBrowseCatalog')}</span>
        </Link>
        <a
          href={getWhatsAppUrl(buildGreeting(lang))}
          onClick={() => trackWhatsAppClick('not_found')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp px-6"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span>{t('askUsOnWhatsApp')}</span>
        </a>
      </EmptyState>
    </>
  )
}
