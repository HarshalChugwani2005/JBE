import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { buildGreeting } from '../i18n/whatsappMessages'
import { getWhatsAppUrl, getPhoneUrl, shop } from '../data/site'
import { WhatsAppIcon, PhoneIcon } from './Icons'

export default function Footer() {
  const { t, lang } = useLanguage()

  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-white pb-20 md:pb-0 dark:bg-stone-950 dark:border-stone-800">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white text-[11px] font-black tracking-wider shadow-xs">
                JBE
              </span>
              <p className="font-heading font-bold text-stone-900 dark:text-stone-100 text-base">{shop.name}</p>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xs">{shop.tagline}</p>
          </div>

          {/* Address */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">{t('address')}</p>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">{shop.address}</p>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">{shop.city}</p>
          </div>

          {/* Contact */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">{t('contactDetails')}</p>
            <div className="mt-2 flex flex-col gap-2">
              <a
                href={getWhatsAppUrl(buildGreeting(lang))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#25D366] hover:underline transition duration-150"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{t('whatsappEnquiry')}</span>
              </a>
              <a
                href={getPhoneUrl(shop.primaryPhone)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition duration-150"
              >
                <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-stone-500" />
                <span>+91 {shop.primaryPhone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">{t('quickLinks')}</p>
            <nav aria-label="Footer navigation" className="mt-2">
              <ul className="flex flex-col gap-1.5 text-xs sm:text-sm">
                <li>
                  <Link to="/catalog" className="text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 font-medium transition duration-150 inline-flex items-center gap-1">
                    <span>→</span>
                    <span>{t('navCatalog')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 font-medium transition duration-150 inline-flex items-center gap-1">
                    <span>→</span>
                    <span>{t('navContact')}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-8 border-t border-stone-100 dark:border-stone-800 pt-6 text-center text-xs text-stone-400 font-medium">
          © {new Date().getFullYear()} {shop.name}. {t('allPricesOnEnquiry')}
        </p>
      </div>
    </footer>
  )
}
