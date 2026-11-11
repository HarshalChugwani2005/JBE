import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { shop } from '../data/site'
import { ArrowRightIcon, MapPinIcon } from './Icons'

/**
 * Embedded map with shop address.
 * `headingLevel` keeps the document outline valid: h3 under a section h2 (Home), h2 directly under a page h1 (Contact).
 */
export default function MapPreview({ compact = false, headingLevel: Heading = 'h3' }) {
  const { t } = useLanguage()

  return (
    <div className={`glass-card overflow-hidden rounded-2xl ${compact ? '' : 'grid gap-0 md:grid-cols-5'}`}>
      <div className={compact ? 'relative aspect-video w-full' : 'relative min-h-55 md:col-span-3 md:min-h-70'}>
        <iframe
          title={t('mapFrameTitle', { name: shop.name })}
          src={shop.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className={`flex flex-col justify-center p-6 sm:p-7 ${compact ? '' : 'md:col-span-2'}`}>
        <Heading className="font-heading text-lg font-bold text-stone-900">{t('visitOurShop')}</Heading>
        <p className="mt-2 text-sm text-stone-600 font-medium">{t('heroLocation')}</p>
        <p className="text-sm text-stone-600 font-medium">{t('shopCity')}</p>
        <p className="mt-3 text-xs font-semibold text-amber-800">{t('hours')}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a href={shop.mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary px-4 text-xs">
            <MapPinIcon className="h-3.5 w-3.5" />
            <span>{t('getDirections')}</span>
          </a>
          <Link to="/contact" className="btn btn-primary px-4 text-xs">
            <span>{t('contactTitle')}</span>
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
