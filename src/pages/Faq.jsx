import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { ChevronRightIcon, PhoneIcon, WhatsAppIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { localizedFaq } from '../data/faq'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { translate } from '../i18n/format'
import { buildFaqJsonLd } from '../i18n/seo'
import { buildGreeting } from '../i18n/whatsappMessages'
import { trackCallClick, trackWhatsAppClick } from '../utils/analytics'

export default function Faq() {
  const { t, lang, href } = useLanguage()
  const items = localizedFaq(lang, translate)

  return (
    <>
      <SEO title={t('faqTitle')} description={t('seoFaqDescription')} jsonLd={buildFaqJsonLd(items)} />
      <Breadcrumbs items={[{ label: t('navHome'), to: href('/') }, { label: t('navFaq') }]} className="mb-4" />
      <PageHeader title={t('faqTitle')} subtitle={t('faqSubtitle')} />

      {/* Native <details> accordions: work without JavaScript and are keyboard / screen-reader friendly. */}
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <details
            key={item.id}
            id={item.id}
            className="group rounded-2xl border border-stone-200 bg-white shadow-xs open:border-amber-300"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 [&::-webkit-details-marker]:hidden">
              <h2 className="font-heading text-base font-bold text-stone-900 sm:text-lg">{item.question}</h2>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-amber-800 transition-transform duration-200 group-open:rotate-90" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-stone-700 sm:text-base">{item.answer}</p>
          </details>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-center sm:p-8">
        <h2 className="font-heading text-lg font-bold text-stone-900 sm:text-xl">{t('faqStillQuestions')}</h2>
        <p className="mt-2 text-sm text-stone-700">{t('faqStillQuestionsText')}</p>
        <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={getWhatsAppUrl(buildGreeting(lang))}
            onClick={() => trackWhatsAppClick('faq_page')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>{t('askUsOnWhatsApp')}</span>
          </a>
          <a href={getPhoneUrl()} onClick={() => trackCallClick('faq_page', shop.primaryPhone)} className="btn btn-secondary">
            <PhoneIcon className="h-4 w-4" />
            <span>{t('callUs')}</span>
          </a>
          <Link to={href('/contact')} className="btn btn-secondary">
            {t('navContact')}
          </Link>
        </div>
      </section>
    </>
  )
}
