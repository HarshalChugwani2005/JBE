import ContactForm from '../components/ContactForm'
import MapPreview from '../components/MapPreview'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { buildGreeting } from '../i18n/whatsappMessages'
import { shop, getWhatsAppUrl, getPhoneUrl } from '../data/site'
import { trackCallClick, trackWhatsAppClick } from '../utils/analytics'
import { WhatsAppIcon, PhoneIcon } from '../components/Icons'

export default function Contact() {
  const { t, lang } = useLanguage()

  return (
    <>
      <SEO title={t('contactTitle')} description={t('seoContactDescription')} />
      <div>
        <PageHeader title={t('contactTitle')} subtitle={t('contactSubtitle')} />

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <MapPreview headingLevel="h2" />

          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs">
              <h2 className="font-heading text-lg font-bold text-stone-900">{t('contactDetails')}</h2>
              <p className="mt-2.5 text-sm text-stone-600 font-medium">{shop.address}</p>
              <p className="text-sm text-stone-600 font-medium">{shop.city}</p>
              <p className="mt-2.5 text-xs font-semibold text-amber-800">{t('hours')}</p>

              <div className="mt-5 border-t border-stone-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">{t('availableNumbers')}</h3>
                <div className="mt-2.5 flex flex-col sm:flex-row sm:flex-wrap gap-2">
                  {shop.phoneNumbers.map((num) => (
                    <a
                      key={num}
                      href={getPhoneUrl(num)}
                      onClick={() => trackCallClick('contact_page_list', num)}
                      className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-800 transition duration-150 hover:border-amber-400 hover:bg-white hover:text-amber-900 w-full sm:w-auto"
                    >
                      <PhoneIcon className="h-3.5 w-3.5 text-stone-600" />
                      <span>+91 {num}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl(buildGreeting(lang))}
                  onClick={() => trackWhatsAppClick('contact_page')}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp w-full sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>{t('chatWhatsApp')}</span>
                </a>
                <a
                  href={getPhoneUrl()}
                  onClick={() => trackCallClick('contact_page_primary', shop.primaryPhone)}
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  <PhoneIcon className="h-4 w-4 text-stone-600" />
                  <span>{t('callPrimary')} ({shop.primaryPhone})</span>
                </a>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
