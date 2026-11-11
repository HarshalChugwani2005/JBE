import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { buildQuoteMessage } from '../i18n/whatsappMessages'
import { getWhatsAppUrl, shop } from '../data/site'
import { trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import ProductImage from './ProductImage'
import { CartIcon, WhatsAppIcon, CloseIcon, TrashIcon } from './Icons'
import { getFocusableElements, trapTabKey } from '../utils/focus'

const ANIM_DURATION = 300 // ms — must match the CSS transition duration

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalCount } = useCart()
  const { t, tCategory, tProduct, lang, href } = useLanguage()
  const [buyerName, setBuyerName] = useState('')
  const [buyerType, setBuyerType] = useState('wholesale') // 'wholesale' | 'retail'
  const [notes, setNotes] = useState('')
  const drawerRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  // Animation state: track whether the panel is currently visible (CSS-wise)
  const [isVisible, setIsVisible] = useState(false)
  const closeTimerRef = useRef(null)

  // Sync CSS visibility with isOpen from context
  useEffect(() => {
    if (isOpen) {
      // Slight rAF delay lets the browser paint the hidden state first so the
      // enter transition actually plays
      const frame = requestAnimationFrame(() => setIsVisible(true))
      return () => cancelAnimationFrame(frame)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }
  }, [])

  // Animated close: slide out first, then call context closeCart
  const handleAnimatedClose = () => {
    setIsVisible(false)
    closeTimerRef.current = setTimeout(() => closeCart(), ANIM_DURATION)
  }

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement
    document.body.classList.add('overflow-hidden')
    const frame = requestAnimationFrame(() => {
      getFocusableElements(drawerRef.current)?.[0]?.focus({ preventScroll: true })
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleAnimatedClose()
        return
      }
      trapTabKey(event, drawerRef.current)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('overflow-hidden')
      previouslyFocusedRef.current?.focus?.({ preventScroll: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Keep DOM mounted so exit animation plays; hide visually when fully closed
  if (!isOpen && !isVisible) return null

  const handleSendWhatsApp = () => {
    if (items.length === 0) return

    trackWhatsAppClick('enquiry_cart', { itemCount: totalCount, buyerType })
    trackEnquiryCartAction('submit_enquiry', { totalCount, buyerType })

    const localizedItems = items.map((item) => ({
      ...item,
      categoryLabel: tCategory(item.categorySlug, item.categoryLabel),
    }))
    const msg = buildQuoteMessage(lang, { items: localizedItems, totalCount, buyerName, buyerType, notes })
    const url = getWhatsAppUrl(msg)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const buyerTypeClass = (active) =>
    `min-h-11 rounded-xl border px-3 py-2 text-xs font-bold transition duration-200 cursor-pointer ${
      active
        ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
        : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50/40'
    }`

  const quantityButtonClass =
    'h-8 w-8 rounded-lg border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 transition active:scale-90 cursor-pointer'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop — fades in/out */}
      <div
        className={`fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleAnimatedClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div
          ref={drawerRef}
          className={`w-screen max-w-md transform bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col
            transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header */}
          <div className="border-b border-stone-200 bg-stone-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-stone-900" id="slide-over-title">
                  {t('enquiryDrawerTitle')}
                </h2>
                <p className="text-xs text-stone-600 font-medium">
                  {t('itemsReady', { count: totalCount })}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAnimatedClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition duration-150 cursor-pointer"
              >
                <span className="sr-only">{t('close')}</span>
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <CartIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-heading text-base font-bold text-stone-900">{t('enquiryEmpty')}</h3>
                <p className="mt-1.5 text-xs text-stone-600 max-w-xs mx-auto">
                  {t('enquiryEmptySubtitle')}
                </p>
                <Link to={href('/catalog')} onClick={closeCart} className="btn btn-primary mt-6">
                  {t('heroBrowseCatalog')}
                </Link>
              </div>
            ) : (
              <>
                {/* Item List */}
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 items-center rounded-2xl border border-stone-200/80 bg-stone-50/50 p-3 transition hover:border-amber-300/80 hover:bg-white hover:shadow-xs">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
                        <ProductImage
                          category={item.categorySlug}
                          product={item}
                          alt=""
                          className="h-full w-full object-cover"
                          sizes="96px"
                          fallbackLabel=""
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-sm font-bold text-stone-900 truncate">
                          {item.brand ? `${item.brand} ` : ''}{item.modelName}
                        </h3>
                        {item.selectedColor && (
                          <p className="text-xs text-amber-800 font-semibold">{t('selectedColor')}: {tProduct(item.selectedColor)}</p>
                        )}
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            aria-label={t('decreaseQuantity', { name: item.modelName })}
                            className={quantityButtonClass}
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-stone-800 min-w-4 text-center" aria-live="polite">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            aria-label={t('increaseQuantity', { name: item.modelName })}
                            className={quantityButtonClass}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        title={t('removeItem', { name: item.modelName })}
                        aria-label={t('removeItem', { name: item.modelName })}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Enquiry Preferences Form */}
                <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 space-y-3.5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t('enquiryDetails')}
                  </h3>

                  <div>
                    <p id="drawer-pricing-label" className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {t('pricingInterest')}
                    </p>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="drawer-pricing-label">
                      <button
                        type="button"
                        onClick={() => setBuyerType('wholesale')}
                        aria-pressed={buyerType === 'wholesale'}
                        className={buyerTypeClass(buyerType === 'wholesale')}
                      >
                        {t('wholesaleBulk')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBuyerType('retail')}
                        aria-pressed={buyerType === 'retail'}
                        className={buyerTypeClass(buyerType === 'retail')}
                      >
                        {t('retailHome')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="drawer-name" className="block text-xs font-semibold text-stone-700">
                      {t('yourNameOptional')}
                    </label>
                    <input
                      id="drawer-name"
                      type="text"
                      autoComplete="name"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder={t('buyerNamePlaceholder')}
                      className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs text-stone-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="drawer-notes" className="block text-xs font-semibold text-stone-700">
                      {t('notesCity')}
                    </label>
                    <input
                      id="drawer-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={t('buyerNotesPlaceholder')}
                      className="glass-input mt-1 w-full rounded-xl px-3 py-2 text-xs text-stone-900"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 bg-white p-5 sm:p-6 space-y-3 shadow-lg">
              <button type="button" onClick={handleSendWhatsApp} className="btn btn-whatsapp w-full py-3">
                <WhatsAppIcon className="h-4 w-4" />
                <span>{t('sendItemsToWhatsApp')} ({totalCount})</span>
              </button>

              <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="min-h-11 text-stone-600 hover:text-red-600 transition cursor-pointer font-medium"
                >
                  {t('clearAll')}
                </button>
                <span>{t('directQuoteFrom')} <strong className="font-semibold text-stone-800">{shop.name}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
