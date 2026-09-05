import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useToast } from '../context/useToast'
import { getWhatsAppUrl } from '../data/site'
import { trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import { addRecentlyViewed } from '../utils/recentlyViewed'
import { PlusIcon, ShareIcon, WhatsAppIcon } from './Icons'
import ProductImage from './ProductImage'

export default function ProductCard({
  to,
  search = '',
  modelName,
  brand,
  image,
  category,
  categoryLabel,
  inStock = true,
}) {
  const { addToCart, openCart } = useCart()
  const { t } = useLanguage()
  const { showToast } = useToast()

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (inStock === false) return // guard: OOS items cannot be added
    addToCart({
      categorySlug: category,
      categoryLabel,
      brand,
      modelName,
      image,
    })
    trackEnquiryCartAction('add_item', { modelName, brand, category })
    showToast(`${brand ? `${brand} ` : ''}${modelName} ${t('itemAdded')}`, 'success')
    openCart()
  }

  const handleShare = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const productUrl = `${window.location.origin}${typeof to === 'string' ? to : to.pathname}`
    const shareTitle = `${brand ? `${brand} ` : ''}${modelName} | Jai Baba Electronic`
    const shareText = `Check out ${brand ? `${brand} ` : ''}${modelName} at Jai Baba Electronic Malkapur`

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: productUrl,
        })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(productUrl)
      showToast(t('copied'), 'success')
    } catch {
      showToast('Could not copy link', 'info')
    }
  }

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-[0_12px_24px_-4px_rgba(217,119,6,0.12)]">
      <Link
        to={{ pathname: to, search }}
        onClick={() => {
          addRecentlyViewed({
            categorySlug: category,
            categoryLabel,
            brand,
            modelName,
            image,
            inStock,
          })
        }}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        aria-label={`${brand ? `${brand} ` : ''}${modelName}`}
      >
        <div className="relative overflow-hidden bg-stone-100">
          <ProductImage
            category={category}
            product={{ image }}
            alt={`${brand ? `${brand} ` : ''}${modelName}`}
            className="aspect-[4/3] w-full"
            imgClassName="group-hover:scale-108 transition-transform duration-500 ease-out"
            fallbackLabel="Photo coming soon"
          />

          {/* Gradient Overlay on Hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Stock Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {inStock ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-700 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                {t('inStock')}
              </span>
            ) : inStock === false ? (
              <span className="inline-flex items-center rounded-full border border-stone-600/30 bg-stone-800 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {t('outOfStock')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {t('askAvailability')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-heading text-base font-bold text-stone-900 transition-colors duration-200 group-hover:text-amber-800">
              {modelName}
            </h4>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-amber-50 hover:text-amber-800 transition duration-200 cursor-pointer"
              title={t('share')}
              aria-label={`Share ${modelName}`}
            >
              <ShareIcon className="h-4 w-4" />
            </button>
          </div>
          {brand && <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-amber-700/90">{brand}</p>}
        </div>
      </Link>

      {/* Action Footer */}
      <div className="mt-auto px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
        <Link
          to={{ pathname: to, search }}
          className="text-xs font-bold text-amber-700 hover:text-amber-900 transition duration-150 inline-flex items-center gap-1"
        >
          <span>{t('viewSpecs')}</span>
        </Link>

        {inStock === false ? (
          /* OOS: replace button with a WhatsApp ask link */
          <a
            href={getWhatsAppUrl(
              `*JAI BABA ELECTRONIC — STOCK CHECK*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n*Product:* ${brand ? `${brand} ` : ''}${modelName}\n*Category:* ${categoryLabel}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n_"Hello! Could you please let me know when this model will be available in stock? Thank you!"_`
            )}
            onClick={(e) => {
              e.stopPropagation()
              trackWhatsAppClick('product_card_oos', { modelName, brand, category })
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:border-emerald-400 hover:bg-emerald-100 transition duration-200 active:scale-95"
            title="Ask about stock on WhatsApp"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            <span>{t('askAvailabilityWa')}</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50/90 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 hover:shadow-xs transition duration-200 active:scale-95 cursor-pointer"
            title="Add to multi-item enquiry list"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>{t('addToList')}</span>
          </button>
        )}
      </div>
    </article>
  )
}
