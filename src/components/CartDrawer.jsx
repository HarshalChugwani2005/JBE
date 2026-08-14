import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { getWhatsAppUrl, shop } from '../data/site'
import { trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import ProductImage from './ProductImage'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalCount } = useCart()
  const [buyerName, setBuyerName] = useState('')
  const [buyerType, setBuyerType] = useState('wholesale') // 'wholesale' | 'retail'
  const [notes, setNotes] = useState('')

  if (!isOpen) return null

  const handleSendWhatsApp = () => {
    if (items.length === 0) return

    trackWhatsAppClick('enquiry_cart', { itemCount: totalCount, buyerType })
    trackEnquiryCartAction('submit_enquiry', { totalCount, buyerType })

    let msg = `*Jai Baba Electronic — Product Quotation Request*\n`
    msg += `------------------------------------\n`
    if (buyerName.trim()) {
      msg += `*Customer:* ${buyerName.trim()}\n`
    }
    msg += `*Enquiry Type:* ${buyerType === 'wholesale' ? 'Wholesale (Bulk Pricing)' : 'Retail (Home/Personal)'}\n`
    msg += `------------------------------------\n`
    msg += `*Selected Products (${totalCount} item${totalCount > 1 ? 's' : ''}):*\n\n`

    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.brand ? `${item.brand} ` : ''}${item.modelName}*`
      if (item.selectedColor) {
        msg += ` (${item.selectedColor})`
      }
      msg += `\n   Category: ${item.categoryLabel || item.categorySlug}`
      if (item.quantity && item.quantity > 1) {
        msg += `\n   Quantity: ${item.quantity}`
      }
      msg += `\n\n`
    })

    if (notes.trim()) {
      msg += `*Additional Note:* ${notes.trim()}\n\n`
    }

    msg += `Please provide your best price, available stock, and delivery/pickup details.\nThank you!`

    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col">
          {/* Header */}
          <div className="border-b border-stone-200 bg-stone-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-stone-900" id="slide-over-title">
                  Enquiry List
                </h2>
                <p className="text-xs text-stone-500">
                  {totalCount} item{totalCount !== 1 ? 's' : ''} ready for quotation
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-lg p-2 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition"
              >
                <span className="sr-only">Close drawer</span>
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl">
                  📋
                </div>
                <h3 className="mt-4 text-base font-semibold text-stone-900">Your enquiry list is empty</h3>
                <p className="mt-1 text-sm text-stone-500">
                  Browse the catalog and add products to send a single consolidated WhatsApp enquiry!
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <>
                {/* Item List */}
                <div className="divide-y divide-stone-100 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                        <ProductImage
                          category={item.categorySlug}
                          product={{ image: item.image }}
                          alt={item.modelName}
                          className="h-full w-full object-cover"
                          fallbackLabel=""
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">
                          {item.brand ? `${item.brand} ` : ''}{item.modelName}
                        </h4>
                        {item.selectedColor && (
                          <p className="text-xs text-amber-700 font-medium">Color: {item.selectedColor}</p>
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="h-6 w-6 rounded border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-100"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold text-stone-800">{item.quantity || 1}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="h-6 w-6 rounded border border-stone-200 bg-white text-xs font-bold text-stone-700 hover:bg-stone-100"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 p-1"
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* Enquiry Preferences Form */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Enquiry Details
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Pricing Interest</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBuyerType('wholesale')}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          buyerType === 'wholesale'
                            ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        ⚡ Wholesale (Bulk)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBuyerType('retail')}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          buyerType === 'retail'
                            ? 'border-amber-600 bg-amber-600 text-white shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        🏠 Retail / Home
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="drawer-name" className="block text-xs font-medium text-stone-700">
                      Your Name (optional)
                    </label>
                    <input
                      id="drawer-name"
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="drawer-notes" className="block text-xs font-medium text-stone-700">
                      Notes / City
                    </label>
                    <input
                      id="drawer-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Malkapur, need delivery this weekend"
                      className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer CTA */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 bg-white p-6 space-y-3">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-[#1fb855] transition"
              >
                <span>💬</span>
                <span>Send {totalCount} Items to WhatsApp</span>
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-stone-500 hover:text-red-600 transition"
                >
                  Clear All
                </button>
                <span>Direct quote from {shop.name}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
