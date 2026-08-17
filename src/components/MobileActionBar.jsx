import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { trackCallClick, trackWhatsAppClick } from '../utils/analytics'

export default function MobileActionBar() {
  const { totalCount, toggleCart } = useCart()
  const { t } = useLanguage()

  const handleCall = () => {
    trackCallClick('mobile_action_bar', shop.primaryPhone)
  }

  const handleWhatsApp = () => {
    trackWhatsAppClick('mobile_action_bar')
  }

  return (
    <aside
      aria-label="Quick actions"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 px-3 py-2 backdrop-blur-md shadow-lg md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        {/* Call Shop */}
        <a
          href={getPhoneUrl(shop.primaryPhone)}
          onClick={handleCall}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 py-2.5 text-xs font-semibold text-stone-800 transition hover:bg-stone-100"
        >
          <span>📞</span>
          <span>{t('callPrimary')}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={getWhatsAppUrl()}
          onClick={handleWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1fb855]"
        >
          <span>💬</span>
          <span>WhatsApp</span>
        </a>

        {/* Enquiry List */}
        <button
          type="button"
          onClick={toggleCart}
          className="relative flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100 cursor-pointer"
        >
          <span>📋</span>
          <span>{t('navCart')}</span>
          {totalCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-600 px-1 text-[9px] font-bold text-white">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
