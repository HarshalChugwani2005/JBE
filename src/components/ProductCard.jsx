import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useToast } from '../context/useToast'
import { trackEnquiryCartAction } from '../utils/analytics'
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-600/90 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                {t('inStock')}
              </span>
            ) : inStock === false ? (
              <span className="inline-flex items-center rounded-full border border-stone-600/30 bg-stone-800/85 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                {t('outOfStock')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-600/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
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
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
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
          <span className="text-xs">→</span>
        </Link>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50/90 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 hover:shadow-xs transition duration-200 active:scale-95 cursor-pointer"
          title="Add to multi-item enquiry list"
        >
          <span>+</span>
          <span>{t('addToList')}</span>
        </button>
      </div>
    </article>
  )
}
