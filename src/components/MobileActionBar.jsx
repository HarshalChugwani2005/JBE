import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { buildGreeting } from '../i18n/whatsappMessages'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { trackCallClick, trackWhatsAppClick } from '../utils/analytics'
import { CartIcon, PhoneIcon, WhatsAppIcon } from './Icons'

export default function MobileActionBar() {
  const { totalCount, toggleCart } = useCart()
  const { t, lang } = useLanguage()

  const handleCall = () => {
    trackCallClick('mobile_action_bar', shop.primaryPhone)
  }

  const handleWhatsApp = () => {
    trackWhatsAppClick('mobile_action_bar')
  }

  return (
    <aside
      aria-label={t('quickActions')}
      className="mobile-bar-enter fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-sm px-3 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-2.5">
        {/* Call Shop */}
        <a
          href={getPhoneUrl(shop.primaryPhone)}
          onClick={handleCall}
          className="btn btn-secondary flex-1 px-2 py-3"
        >
          <PhoneIcon className="h-4 w-4" />
          <span>{t('callPrimary')}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={getWhatsAppUrl(buildGreeting(lang))}
          onClick={handleWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp flex-1 px-2 py-3"
        >
          <WhatsAppIcon className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>

        {/* Enquiry List */}
        <button
          type="button"
          onClick={toggleCart}
          className="btn flex-1 border border-amber-300 bg-amber-50 px-2 py-3 text-amber-900 hover:bg-amber-100"
          aria-label={t('enquiryListCount', { count: totalCount })}
        >
          <CartIcon className="h-4 w-4" />
          <span>{t('navCart')}</span>
          {totalCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-700 px-1 text-[10px] font-bold text-white shadow-xs" aria-hidden="true">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
