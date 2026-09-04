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
        <h1 className="font-display text-2xl font-extrabold text-stone-900 dark:text-white sm:text-3xl sm:text-4xl tracking-tight">{t('contactTitle')}</h1>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl">{t('contactSubtitle')}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <MapPreview />

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.05)]">
              <h2 className="font-heading text-lg font-bold text-stone-900">{t('contactDetails')}</h2>
              <p className="mt-2.5 text-sm text-stone-600 font-medium">{shop.address}</p>
              <p className="text-sm text-stone-600 font-medium">{shop.city}</p>
              <p className="mt-2.5 text-xs font-semibold text-amber-800/90">{t('hours')}</p>

              <div className="mt-5 border-t border-stone-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{t('availableNumbers')}</p>
                <div className="mt-2.5 flex flex-col sm:flex-row sm:flex-wrap gap-2">
                  {shop.phoneNumbers.map((num) => (
                    <a
                      key={num}
                      href={getPhoneUrl(num)}
                      onClick={() => trackCallClick('contact_page_list', num)}
                      className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50/90 px-3 py-2.5 text-sm font-bold text-stone-800 transition duration-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 w-full sm:w-auto"
                    >
                      📞 +91 {num}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                <a
                  href={getWhatsAppUrl()}
                  onClick={() => trackWhatsAppClick('contact_page')}
                  target="_blank"
                  rel="noreferrer"
                  className="glow-wa inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1fb855] hover:-translate-y-0.5 transition duration-200"
                >
                  <span>💬</span>
                  <span>{t('chatWhatsApp')}</span>
                </a>
                <a
                  href={getPhoneUrl()}
                  onClick={() => trackCallClick('contact_page_primary', shop.primaryPhone)}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-3.5 text-sm font-bold text-stone-800 shadow-xs hover:border-stone-300 hover:bg-stone-50 transition duration-200"
                >
                  <span>📞</span>
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
