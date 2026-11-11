import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { buildGreeting } from '../i18n/whatsappMessages'
import { getWhatsAppUrl, getPhoneUrl, shop } from '../data/site'
import { ArrowRightIcon, WhatsAppIcon, PhoneIcon } from './Icons'

export default function Footer() {
  const { t, lang } = useLanguage()

  return (
    <footer className="mt-auto border-t border-stone-200/80 bg-white pb-20 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-700 text-white text-[11px] font-black tracking-wider shadow-xs" aria-hidden="true">
                JBE
              </span>
              <p className="font-heading font-bold text-stone-900 text-base">{shop.name}</p>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-xs">{t('heroTagline')}</p>
          </div>

          {/* Address */}
          <div>
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900">{t('address')}</h2>
            <p className="mt-2 text-xs sm:text-sm text-stone-600">{t('heroLocation')}</p>
            <p className="text-xs sm:text-sm text-stone-600">{t('shopCity')}</p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900">{t('contactDetails')}</h2>
            <div className="mt-2 flex flex-col gap-2">
              <a
                href={getWhatsAppUrl(buildGreeting(lang))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-8 items-center gap-1.5 text-xs sm:text-sm font-semibold text-green-800 hover:underline transition duration-150"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{t('whatsappEnquiry')}</span>
              </a>
              <a
                href={getPhoneUrl(shop.primaryPhone)}
                className="inline-flex min-h-8 items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-amber-800 transition duration-150"
              >
                <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-stone-600" />
                <span>+91 {shop.primaryPhone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-stone-900">{t('quickLinks')}</h2>
            <nav aria-label={t('footerNavigation')} className="mt-2">
              <ul className="flex flex-col gap-1.5 text-xs sm:text-sm">
                <li>
                  <Link to="/catalog" className="text-stone-600 hover:text-amber-800 font-medium transition duration-150 inline-flex min-h-8 items-center gap-1.5">
                    <ArrowRightIcon className="h-3 w-3" />
                    <span>{t('navCatalog')}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-stone-600 hover:text-amber-800 font-medium transition duration-150 inline-flex min-h-8 items-center gap-1.5">
                    <ArrowRightIcon className="h-3 w-3" />
                    <span>{t('navContact')}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <p className="mt-8 border-t border-stone-100 pt-6 text-center text-xs text-stone-600 font-medium">
          © {new Date().getFullYear()} {shop.name}. {t('allPricesOnEnquiry')}
        </p>
      </div>
    </footer>
  )
}
