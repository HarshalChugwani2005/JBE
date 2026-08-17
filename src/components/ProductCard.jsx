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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
      <Link
        to={{ pathname: to, search }}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
        aria-label={`${brand ? `${brand} ` : ''}${modelName}`}
      >
        <div className="relative">
          <ProductImage
            category={category}
            product={{ image }}
            alt={`${brand ? `${brand} ` : ''}${modelName}`}
            className="aspect-[4/3] w-full"
            imgClassName="group-hover:scale-105 transition duration-300"
            fallbackLabel="Photo coming soon"
          />

          {/* Stock Badge */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {inStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-xs backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                {t('inStock')}
              </span>
            ) : inStock === false ? (
              <span className="inline-flex items-center rounded-full bg-stone-700/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                {t('outOfStock')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-amber-600/90 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                {t('askAvailability')}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-base font-semibold text-stone-900 transition group-hover:text-amber-800">
              {modelName}
            </h4>
            <button
              type="button"
              onClick={handleShare}
              className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
              title={t('share')}
              aria-label={`Share ${modelName}`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
          {brand && <p className="mt-0.5 text-xs font-medium text-stone-500">{brand}</p>}
        </div>
      </Link>

      {/* Action Footer */}
      <div className="mt-auto px-4 pb-4 pt-1 flex items-center justify-between gap-2 border-t border-stone-100/80">
        <Link
          to={{ pathname: to, search }}
          className="text-xs font-semibold text-amber-700 hover:text-amber-900 hover:underline"
        >
          {t('viewSpecs')}
        </Link>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-stone-900 transition cursor-pointer"
          title="Add to multi-item enquiry list"
        >
          <span>{t('addToList')}</span>
        </button>
      </div>
    </article>
  )
}
