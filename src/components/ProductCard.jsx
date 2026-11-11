import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useToast } from '../context/useToast'
import { trackEnquiryCartAction } from '../utils/analytics'
import { addRecentlyViewed } from '../utils/recentlyViewed'
import { PlusIcon, ShareIcon } from './Icons'
import ProductImage from './ProductImage'

/**
 * Product tile. The title link is "stretched" over the whole card (::after overlay),
 * so the card is one link while the share / add controls stay separate,
 * valid interactive elements layered above it (relative z-10).
 */
export default function ProductCard({
  to,
  search = '',
  modelName,
  brand,
  image,
  category,
  categoryLabel,
  specs = [],
}) {
  const { addToCart, openCart } = useCart()
  const { t, tProduct } = useLanguage()
  const { showToast } = useToast()
  const productName = `${brand ? `${brand} ` : ''}${modelName}`

  const handleQuickAdd = () => {
    addToCart({
      categorySlug: category,
      categoryLabel,
      brand,
      modelName,
      image,
    })
    trackEnquiryCartAction('add_item', { modelName, brand, category })
    showToast(`${productName} ${t('itemAdded')}`, 'success')
    openCart()
  }

  const handleShare = async () => {
    const productUrl = `${window.location.origin}${typeof to === 'string' ? to : to.pathname}`
    const shareTitle = `${productName} | Jai Baba Electronic`
    const shareText = t('shareText', { name: productName })

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
      showToast(t('copyFailed'), 'info')
    }
  }

  return (
    <article className="group press-effect relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-[0_12px_24px_-4px_rgba(217,119,6,0.12)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-amber-500">
      <div className="shimmer-on-hover img-zoom-container relative overflow-hidden bg-stone-100">
        <ProductImage
          category={category}
          product={{ image }}
          alt={productName}
          className="aspect-4/3 w-full"
          imgClassName="transition-transform duration-600 ease-out"
        />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-stone-900/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
      </div>

      <div className="flex flex-1 flex-col p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-bold text-stone-900 transition-colors duration-200 group-hover:text-amber-800">
            <Link
              to={{ pathname: to, search }}
              onClick={() => {
                addRecentlyViewed({
                  categorySlug: category,
                  categoryLabel,
                  brand,
                  modelName,
                  image,
                })
              }}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {modelName}
            </Link>
          </h3>
          <button
            type="button"
            onClick={handleShare}
            className="relative z-10 -mr-1.5 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-500 transition duration-200 hover:bg-amber-50 hover:text-amber-800 cursor-pointer"
            title={t('share')}
            aria-label={t('shareProduct', { name: productName })}
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>
        {brand && <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-amber-800">{brand}</p>}
        {specs[0] && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-600">{tProduct(specs[0])}</p>}
      </div>

      {/* Action Footer */}
      <div className="mt-auto px-4 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-stone-100">
        <span className="text-xs font-bold text-amber-800 group-hover:text-amber-950" aria-hidden="true">
          {t('viewSpecs')}
        </span>
        <button
          type="button"
          onClick={handleQuickAdd}
          className="relative z-10 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50/90 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 hover:shadow-xs transition duration-200 active:scale-95 cursor-pointer"
          title={t('addToEnquiryList')}
          aria-label={`${t('addToList')} — ${productName}`}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span>{t('addToList')}</span>
        </button>
      </div>
    </article>
  )
}
