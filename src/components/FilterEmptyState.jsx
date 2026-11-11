import { useLanguage } from '../context/useLanguage'
import { getWhatsAppUrl } from '../data/site'
import { buildGreeting } from '../i18n/whatsappMessages'
import { trackWhatsAppClick } from '../utils/analytics'
import EmptyState from './EmptyState'
import { SearchIcon, WhatsAppIcon } from './Icons'

/** Shown when catalog filters match nothing: offers to clear filters or ask the shop directly. */
export default function FilterEmptyState({ description, onClear }) {
  const { t, lang } = useLanguage()

  return (
    <EmptyState icon={SearchIcon} title={t('noResultsTitle')} description={description}>
      <button type="button" onClick={onClear} className="btn btn-secondary">
        {t('clearFilters')}
      </button>
      <a
        href={getWhatsAppUrl(buildGreeting(lang))}
        onClick={() => trackWhatsAppClick('catalog_empty_state')}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-whatsapp"
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>{t('askUsOnWhatsApp')}</span>
      </a>
    </EmptyState>
  )
}
