import ContactForm from '../components/ContactForm'
import MapPreview from '../components/MapPreview'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { shop, getWhatsAppUrl, getPhoneUrl } from '../data/site'
import { trackCallClick, trackWhatsAppClick } from '../utils/analytics'

export default function Contact() {
  const { t } = useLanguage()

  return (
    <>
      <SEO
        title={t('contactTitle')}
        description="Visit Jai Baba Electronic on Buldana Road, Malkapur or enquire by WhatsApp, call, or contact form."
      />
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-900 sm:text-3xl">{t('contactTitle')}</h1>
        <p className="mt-2 text-stone-600">{t('contactSubtitle')}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <MapPreview />

          <div>
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
              <h2 className="font-bold text-stone-900">{t('contactDetails')}</h2>
              <p className="mt-2 text-sm text-stone-600">{shop.address}</p>
              <p className="text-sm text-stone-600">{shop.city}</p>
              <p className="mt-2 text-xs font-medium text-stone-500">{t('hours')}</p>

              <div className="mt-4 border-t border-stone-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{t('availableNumbers')}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {shop.phoneNumbers.map((num) => (
                    <a
                      key={num}
                      href={getPhoneUrl(num)}
                      onClick={() => trackCallClick('contact_page_list', num)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-semibold text-stone-800 transition hover:border-amber-400 hover:bg-amber-50"
                    >
                      📞 +91 {num}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl()}
                  onClick={() => trackWhatsAppClick('contact_page')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1fb855] transition"
                >
                  {t('chatWhatsApp')}
                </a>
                <a
                  href={getPhoneUrl()}
                  onClick={() => trackCallClick('contact_page_primary', shop.primaryPhone)}
                  className="inline-flex items-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
                >
                  {t('callPrimary')} ({shop.primaryPhone})
                </a>
              </div>
            </div>

            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
