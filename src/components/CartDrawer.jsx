import { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { getWhatsAppUrl, shop } from '../data/site'
import { trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import ProductImage from './ProductImage'
import { CartIcon, WhatsAppIcon, CloseIcon, TrashIcon } from './Icons'

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

const ANIM_DURATION = 300 // ms — must match the CSS transition duration

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalCount } = useCart()
  const { t } = useLanguage()
  const [buyerName, setBuyerName] = useState('')
  const [buyerType, setBuyerType] = useState('wholesale') // 'wholesale' | 'retail'
  const [notes, setNotes] = useState('')
  const drawerRef = useRef(null)
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

    document.body.classList.add('overflow-hidden')

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleAnimatedClose()
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return

      const focusableElements = getFocusableElements(drawerRef.current)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('overflow-hidden')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Keep DOM mounted so exit animation plays; hide visually when fully closed
  if (!isOpen && !isVisible) return null

  const handleSendWhatsApp = () => {
    if (items.length === 0) return

    trackWhatsAppClick('enquiry_cart', { itemCount: totalCount, buyerType })
    trackEnquiryCartAction('submit_enquiry', { totalCount, buyerType })

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    let msg = `*JAI BABA ELECTRONIC — QUOTATION REQUEST*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `Date: ${dateStr}\n`
    if (buyerName.trim()) {
      msg += `Customer: ${buyerName.trim()}\n`
    }
    msg += `Order Type: ${buyerType === 'wholesale' ? 'Wholesale / Dealer (Bulk Order)' : 'Retail / Personal (Home Use)'}\n`
    if (notes.trim()) {
      msg += `Location / Notes: ${notes.trim()}\n`
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    msg += `Requested Products (${totalCount} item${totalCount > 1 ? 's' : ''}):\n\n`

    items.forEach((item, index) => {
      const num = index + 1
      msg += `*${num}. ${item.brand ? `${item.brand} ` : ''}${item.modelName}*\n`
      msg += `   • Category: ${item.categoryLabel || item.categorySlug}\n`
      if (item.selectedColor) {
        msg += `   • Color: ${item.selectedColor}\n`
      }
      msg += `   • Quantity: *${item.quantity || 1} unit${(item.quantity || 1) > 1 ? 's' : ''}*\n\n`
    })

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `_"Hello! Please share your best price quotation, current stock availability, and delivery/pickup details for the items listed above. Thank you!"_`

    const url = getWhatsAppUrl(msg)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop — fades in/out */}
      <div
        className={`fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleAnimatedClose}
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
                <p className="text-xs text-stone-500 font-medium">
                  {totalCount} {t('readyForQuotation')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleAnimatedClose}
                className="rounded-full border border-stone-200 bg-white p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition duration-150 cursor-pointer"
              >
                <span className="sr-only">{t('close')}</span>
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <CartIcon className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-heading text-base font-bold text-stone-900">{t('enquiryEmpty')}</h3>
                <p className="mt-1.5 text-xs text-stone-500 max-w-xs mx-auto">
                  {t('enquiryEmptySubtitle')}
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-700 hover:to-orange-600 transition duration-200 active:scale-95 cursor-pointer"
                >
                  {t('heroBrowseCatalog')}
                </button>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center rounded-2xl border border-stone-200/80 bg-stone-50/50 p-3 transition hover:border-amber-300/80 hover:bg-white hover:shadow-xs">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
                        <ProductImage
                          category={item.categorySlug}
                          product={item}
                          alt={item.modelName}
                          className="h-full w-full object-cover"
                          fallbackLabel=""
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-sm font-bold text-stone-900 truncate">
                          {item.brand ? `${item.brand} ` : ''}{item.modelName}
                        </h4>
                        {item.selectedColor && (
                          <p className="text-xs text-amber-700 font-semibold">{t('selectedColor')}: {item.selectedColor}</p>
                        )}
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="h-6 w-6 rounded-lg border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 transition active:scale-90 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-stone-800 min-w-4 text-center">{item.quantity || 1}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="h-6 w-6 rounded-lg border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 transition active:scale-90 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Enquiry Preferences Form */}
                <div className="rounded-2xl border border-stone-200/90 bg-stone-50/80 p-4 space-y-3.5 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    {t('enquiryDetails')}
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">{t('pricingInterest')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBuyerType('wholesale')}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold transition duration-200 cursor-pointer ${
                          buyerType === 'wholesale'
                            ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50/40'
                        }`}
                      >
                        {t('wholesaleBulk')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBuyerType('retail')}
                        className={`rounded-xl border px-3 py-2 text-xs font-bold transition duration-200 cursor-pointer ${
                          buyerType === 'retail'
                            ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50/40'
                        }`}
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
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
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
                      placeholder="e.g. Malkapur, need delivery this weekend"
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
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="btn-whatsapp w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-bold text-white shadow-xs transition duration-150 cursor-pointer"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>{t('sendItemsToWhatsApp')} ({totalCount})</span>
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-stone-500 hover:text-red-600 transition cursor-pointer font-medium"
                >
                  {t('clearAll')}
                </button>
                <span>{t('directQuoteFrom')} <strong className="font-semibold text-stone-700">{shop.name}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
