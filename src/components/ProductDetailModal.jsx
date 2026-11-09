import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { buildProductEnquiryMessage, buildStockCheckMessage } from '../i18n/whatsappMessages'
import { useToast } from '../context/useToast'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { getImageBaseName, getImageSrcSet, getProductImageUrls } from '../data/productImages'
import { trackCallClick, trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import { addRecentlyViewed } from '../utils/recentlyViewed'
import { slugify } from '../utils/slugify'
import { AlertTriangleIcon, CartIcon, CloseIcon, PhoneIcon, ShareIcon, WhatsAppIcon } from './Icons'
import ImageLightbox from './ImageLightbox'
import ProductImage from './ProductImage'
import { trapTabKey } from '../utils/focus'

function findImageIndexForColor(color, imageSources, colors, modelName) {
  if (!color || !imageSources.length) return 0
  const colorSlug = slugify(color)
  const modelSlug = slugify(modelName)
  const targetName = modelSlug ? `${modelSlug}-${colorSlug}` : colorSlug

  // 1. Exact match on clean filename base (e.g. "titan-brown" or "brown")
  const exactMatchIdx = imageSources.findIndex((url) => {
    const filename = getImageBaseName(url)
    const cleanFilename = filename
    return cleanFilename === targetName || cleanFilename === colorSlug || filename === targetName || filename === colorSlug
  })
  if (exactMatchIdx !== -1) return exactMatchIdx

  // 2. Index match if colors array aligns with imageSources
  const colorIdx = (colors || []).findIndex((c) => slugify(c) === colorSlug)
  if (colorIdx !== -1 && colorIdx < imageSources.length) {
    return colorIdx
  }

  return 0
}

function findColorForImage(imageSource, colors, modelName) {
  if (!imageSource || !colors?.length) return null
  const filename = getImageBaseName(imageSource)
  const cleanFilename = filename
  const modelSlug = slugify(modelName)

  // 1. Exact match against target name
  for (const c of colors) {
    const cSlug = slugify(c)
    const targetName = modelSlug ? `${modelSlug}-${cSlug}` : cSlug
    if (cleanFilename === targetName || cleanFilename === cSlug || filename === targetName || filename === cSlug) {
      return c
    }
  }

  // 2. Fallback to longest color name matching
  const sortedColors = [...colors].sort((a, b) => b.length - a.length)
  for (const c of sortedColors) {
    const cSlug = slugify(c)
    if (cleanFilename === cSlug || cleanFilename.endsWith(`-${cSlug}`)) {
      return c
    }
  }

  return null
}

export default function ProductDetailModal({ isOpen, onClose, product }) {
  const { addToCart, openCart } = useCart()
  const { t, tCategory, lang } = useLanguage()
  const { showToast } = useToast()
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  // The lightbox owns the keyboard while open (Escape / Tab must not also reach this dialog).
  const lightboxOpenRef = useRef(false)
  useEffect(() => {
    lightboxOpenRef.current = lightboxOpen
  }, [lightboxOpen])
  const closeLightbox = useCallback(() => setLightboxOpen(false), [])

  const model = product?.model ?? product ?? null
  const brand = product?.brand ?? product?.brandName ?? null
  const brandName = brand?.brand ?? brand ?? ''
  const categorySlug = product?.categorySlug ?? product?.category ?? ''
  const categoryLabel = product?.categoryLabel ?? ''
  const inStock = model?.inStock ?? true

  const imageSources = useMemo(() => getProductImageUrls(categorySlug, model), [categorySlug, model])
  const activeImage = imageSources[activeImageIndex] ?? imageSources[0] ?? null

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement
    setActiveImageIndex(0)
    setSelectedColor(model?.colors?.[0] ?? null)

    if (model?.modelName) {
      addRecentlyViewed({
        categorySlug,
        categoryLabel,
        brand: brandName,
        modelName: model.modelName,
        image: model.image,
        inStock,
        priceTier: model.priceTier,
      })
    }

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (lightboxOpenRef.current) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      trapTabKey(event, dialogRef.current)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('overflow-hidden')

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('overflow-hidden')
      previouslyFocusedRef.current?.focus?.()
    }
  }, [isOpen, model, onClose, categorySlug, categoryLabel, brandName, inStock])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [imageSources.length])

  if (!isOpen || !model) return null

  const modelName = model.modelName ?? t('product')
  const productName = `${brandName ? `${brandName} ` : ''}${modelName}`

  const productLabel = tCategory(categorySlug, categoryLabel || categorySlug)
  const whatsappText = buildProductEnquiryMessage(lang, {
    brand: brandName,
    modelName,
    categoryLabel: productLabel,
    selectedColor,
    keySpec: model?.specs?.[0],
  })

  const oosWhatsappText = buildStockCheckMessage(lang, { brand: brandName, modelName, categoryLabel: productLabel })

  const whatsappHref = getWhatsAppUrl(whatsappText)
  const phoneHref = getPhoneUrl()
  const isExternalWhatsApp = whatsappHref.startsWith('http')
  const isExternalPhone = phoneHref.startsWith('http')

  const handleShare = async () => {
    const productUrl = window.location.href
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

  const handleAddToList = () => {
    addToCart({
      categorySlug,
      categoryLabel,
      brand,
      model,
      selectedColor,
    })
    trackEnquiryCartAction('add_item', { modelName, brand: brandName, category: categorySlug, selectedColor })
    showToast(`${productName} ${t('itemAdded')}`, 'success')
    openCart()
    onClose()
  }

  const [contactNoteBefore, contactNoteAfter = ''] = t('modalContactNote').split('{phone}')

  const handleColorSelect = (color) => {
    setSelectedColor(color)
    if (!imageSources.length) return
    const matchedIndex = findImageIndexForColor(color, imageSources, model?.colors, model?.modelName)
    setActiveImageIndex(matchedIndex)
  }

  const handleThumbnailSelect = (index) => {
    setActiveImageIndex(index)
    if (!model?.colors?.length) return
    const matchedColor = findColorForImage(imageSources[index], model.colors, model?.modelName)
    if (matchedColor) {
      setSelectedColor(matchedColor)
    } else if (model.colors[index]) {
      setSelectedColor(model.colors[index])
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 px-3 py-4 sm:px-6 sm:py-8 transition-all duration-300"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="animate-modal-pop mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-stone-200/80"
      >
        <div className="flex items-center justify-between border-b border-stone-200/90 bg-stone-50/70 px-5 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-800">
                {productLabel || t('product')}
              </p>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" aria-hidden="true" />
                  {t('inStock')}
                </span>
              ) : inStock === false ? (
                <span className="inline-flex items-center rounded-full bg-stone-200 px-2.5 py-0.5 text-[10px] font-semibold text-stone-700">
                  {t('outOfStock')}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                  {t('askAvailability')}
                </span>
              )}
            </div>
            <h2 id="product-modal-title" className="mt-1 font-heading text-xl font-extrabold text-stone-900 sm:text-2xl tracking-tight">
              {modelName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition duration-200 hover:border-amber-300 hover:bg-stone-50 cursor-pointer"
              title={t('share')}
              aria-label={t('shareProduct', { name: productName })}
            >
              <ShareIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('share')}</span>
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition duration-200 hover:border-amber-300 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer"
              aria-label={t('close')}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b border-stone-200 bg-stone-50/60 p-4 sm:p-6 lg:border-b-0 lg:border-r">
            {/* Main image — click to open lightbox */}
            <button
              type="button"
              className="group relative block w-full cursor-zoom-in rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              onClick={() => activeImage && setLightboxOpen(true)}
              aria-label={t('openImageViewer')}
              title={t('clickToZoom')}
            >
              <ProductImage
                src={activeImage}
                category={categorySlug}
                product={model}
                alt={selectedColor ? t('productInColor', { name: productName, color: selectedColor }) : productName}
                className="aspect-4/3 rounded-2xl border border-stone-200 bg-white shadow-xs"
                sizes="(min-width: 768px) 560px, 100vw"
                imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                loading="eager"
              />
              {/* Zoom hint badge */}
              {activeImage && (
                <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold text-white/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                  </svg>
                  {t('zoom')}
                </span>
              )}
            </button>

            {imageSources.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
                {imageSources.map((source, index) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleThumbnailSelect(index)}
                    className={`overflow-hidden rounded-xl border transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer ${
                      activeImageIndex === index
                        ? 'border-amber-500 ring-3 ring-amber-400/30 scale-102'
                        : 'border-stone-200 hover:border-amber-300'
                    }`}
                    aria-label={t('viewImageOf', { index: index + 1, total: imageSources.length })}
                    aria-pressed={activeImageIndex === index}
                  >
                    <img src={source} srcSet={getImageSrcSet(source)} sizes="120px" alt="" className="h-16 sm:h-20 w-full object-cover" loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-7 flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {brandName && (
                <span className="rounded-full bg-amber-100/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 shadow-xs">
                  {brandName}
                </span>
              )}
              {model?.warranty && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/80">
                  {model.warranty}
                </span>
              )}
              {model?.tagline && (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                  {model.tagline}
                </span>
              )}
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-600">{t('keySpecs')}</h3>
              {model?.specs?.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-stone-700">
                  {model.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-stone-50/80 px-3.5 py-2 transition hover:bg-stone-50">
                      <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                      <span className="font-medium">{spec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-600">
                  {t('noSpecsAvailable')}
                </p>
              )}
            </div>

            {model?.colors?.length > 0 && (
              <div className="mt-5">
                <h3 id="product-colors-label" className="text-xs font-bold uppercase tracking-[0.2em] text-stone-600">{t('availableColors')}</h3>
                <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-labelledby="product-colors-label">
                  {model.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      aria-pressed={selectedColor === color}
                      className={`min-h-9 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer ${
                        selectedColor === color
                          ? 'border-amber-700 bg-amber-700 text-white shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
              {inStock === false ? (
                /* OOS: show a disabled badge in place of Add to List */
                <div className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border-2 border-stone-200 bg-stone-50 px-4 py-3 text-sm font-bold text-stone-600 cursor-not-allowed select-none">
                  <AlertTriangleIcon className="h-4 w-4 text-stone-500" />
                  <span>{t('outOfStock')}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToList}
                  className="btn border-2 border-amber-700 bg-amber-50 px-4 py-3 text-amber-900 hover:bg-amber-100"
                >
                  <CartIcon className="h-4 w-4" />
                  <span>{t('addToList')}</span>
                </button>
              )}
              <a
                href={inStock === false ? getWhatsAppUrl(oosWhatsappText) : whatsappHref}
                onClick={() => trackWhatsAppClick('product_modal', { modelName, brand: brandName })}
                target={isExternalWhatsApp ? '_blank' : undefined}
                rel={isExternalWhatsApp ? 'noopener noreferrer' : undefined}
                className="btn btn-whatsapp px-4 py-3"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>{inStock === false ? t('askAvailabilityWa') : t('whatsappEnquiry')}</span>
              </a>
              <a
                href={phoneHref}
                onClick={() => trackCallClick('product_modal', shop.primaryPhone)}
                target={isExternalPhone ? '_blank' : undefined}
                rel={isExternalPhone ? 'noopener noreferrer' : undefined}
                className="btn btn-secondary px-4 py-3"
              >
                <PhoneIcon className="h-4 w-4" />
                <span>{t('callSeller')}</span>
              </a>
            </div>

            <p className="mt-5 text-xs text-stone-600">
              {contactNoteBefore}
              <span className="font-semibold text-stone-800">+91 {shop.primaryPhone}</span>
              {contactNoteAfter}
            </p>
            {selectedColor && (
              <p className="mt-1 text-xs text-amber-800 font-medium">{t('selectedColor')}: {selectedColor}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox portal */}
      {lightboxOpen && imageSources.length > 0 && (
        <ImageLightbox
          images={imageSources}
          startIndex={activeImageIndex}
          alt={productName}
          onClose={closeLightbox}
        />
      )}
    </div>
  )
}
