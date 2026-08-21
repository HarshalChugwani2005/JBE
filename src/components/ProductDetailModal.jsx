import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '../context/useCart'
import { useLanguage } from '../context/useLanguage'
import { useToast } from '../context/useToast'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { getProductImageUrls } from '../data/productImages'
import { trackCallClick, trackEnquiryCartAction, trackWhatsAppClick } from '../utils/analytics'
import ProductImage from './ProductImage'

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

function slugifyText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function findImageIndexForColor(color, imageSources, colors, modelName) {
  if (!color || !imageSources.length) return 0
  const colorSlug = slugifyText(color)
  const modelSlug = slugifyText(modelName)
  const targetName = modelSlug ? `${modelSlug}-${colorSlug}` : colorSlug

  // 1. Exact match on clean filename base (e.g. "titan-brown" or "brown")
  const exactMatchIdx = imageSources.findIndex((url) => {
    const filename = url.split(/[?#]/)[0].split('/').pop().replace(/\.[^.]+$/, '').toLowerCase()
    const cleanFilename = filename.replace(/-[a-zA-Z0-9_-]{8,}$/, '')
    return cleanFilename === targetName || cleanFilename === colorSlug || filename === targetName || filename === colorSlug
  })
  if (exactMatchIdx !== -1) return exactMatchIdx

  // 2. Index match if colors array aligns with imageSources
  const colorIdx = (colors || []).findIndex((c) => slugifyText(c) === colorSlug)
  if (colorIdx !== -1 && colorIdx < imageSources.length) {
    return colorIdx
  }

  return 0
}

function findColorForImage(imageSource, colors, modelName) {
  if (!imageSource || !colors?.length) return null
  const filename = imageSource.split(/[?#]/)[0].split('/').pop().replace(/\.[^.]+$/, '').toLowerCase()
  const cleanFilename = filename.replace(/-[a-zA-Z0-9_-]{8,}$/, '')
  const modelSlug = slugifyText(modelName)

  // 1. Exact match against target name
  for (const c of colors) {
    const cSlug = slugifyText(c)
    const targetName = modelSlug ? `${modelSlug}-${cSlug}` : cSlug
    if (cleanFilename === targetName || cleanFilename === cSlug || filename === targetName || filename === cSlug) {
      return c
    }
  }

  // 2. Fallback to longest color name matching
  const sortedColors = [...colors].sort((a, b) => b.length - a.length)
  for (const c of sortedColors) {
    const cSlug = slugifyText(c)
    if (cleanFilename === cSlug || cleanFilename.endsWith(`-${cSlug}`)) {
      return c
    }
  }

  return null
}

export default function ProductDetailModal({ isOpen, onClose, product }) {
  const { addToCart, openCart } = useCart()
  const { t } = useLanguage()
  const { showToast } = useToast()
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)

  const model = product?.model ?? product ?? null
  const brand = product?.brand ?? product?.brandName ?? null
  const categorySlug = product?.categorySlug ?? product?.category ?? ''
  const categoryLabel = product?.categoryLabel ?? ''
  const inStock = model?.inStock ?? true

  const imageSources = useMemo(() => getProductImageUrls(categorySlug, model), [categorySlug, model])
  const activeImage = imageSources[activeImageIndex] ?? imageSources[0] ?? null
  const whatsappText = `Hi, I would like to enquire about the ${brand?.brand ?? brand ?? ''} ${model?.modelName ?? ''}${selectedColor ? ` in ${selectedColor}` : ''}`.trim()

  useEffect(() => {
    if (!isOpen) return

    previouslyFocusedRef.current = document.activeElement
    setActiveImageIndex(0)
    setSelectedColor(model?.colors?.[0] ?? null)

    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = getFocusableElements(dialogRef.current)
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
    document.body.classList.add('overflow-hidden')

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('overflow-hidden')
      previouslyFocusedRef.current?.focus?.()
    }
  }, [isOpen, model, onClose])

  useEffect(() => {
    setActiveImageIndex(0)
  }, [imageSources.length])

  if (!isOpen || !model) return null

  const modelName = model.modelName ?? 'Product Detail'
  const brandName = brand?.brand ?? brand ?? ''
  const whatsappHref = getWhatsAppUrl(whatsappText)
  const phoneHref = getPhoneUrl()
  const isExternalWhatsApp = whatsappHref.startsWith('http')
  const isExternalPhone = phoneHref.startsWith('http')

  const handleShare = async () => {
    const productUrl = window.location.href
    const shareTitle = `${brandName ? `${brandName} ` : ''}${modelName} | Jai Baba Electronic`
    const shareText = `Check out ${brandName ? `${brandName} ` : ''}${modelName} at Jai Baba Electronic Malkapur`

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

  const handleAddToList = () => {
    addToCart({
      categorySlug,
      categoryLabel,
      brand,
      model,
      selectedColor,
    })
    trackEnquiryCartAction('add_item', { modelName, brand: brandName, category: categorySlug, selectedColor })
    showToast(`${brandName ? `${brandName} ` : ''}${modelName} ${t('itemAdded')}`, 'success')
    openCart()
    onClose()
  }

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
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-8 transition-all duration-300"
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
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                {categoryLabel || categorySlug || 'Product'}
              </p>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
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
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition duration-200 hover:border-amber-300 hover:bg-stone-50 cursor-pointer"
              title={t('share')}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden sm:inline">{t('share')}</span>
            </button>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-600 transition duration-200 hover:border-amber-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b border-stone-200 bg-stone-50/60 p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <ProductImage
              src={activeImage}
              category={categorySlug}
              product={model}
              alt={`${brandName ? `${brandName} ` : ''}${modelName}${selectedColor ? ` in ${selectedColor}` : ''}`}
              className="aspect-[4/3] rounded-2xl border border-stone-200 bg-white shadow-xs"
              imgClassName="transition-transform duration-500"
              fallbackLabel="Photo coming soon"
              loading="eager"
            />

            {imageSources.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-2.5 sm:grid-cols-6">
                {imageSources.map((source, index) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => handleThumbnailSelect(index)}
                    className={`overflow-hidden rounded-xl border transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer ${
                      activeImageIndex === index
                        ? 'border-amber-500 ring-3 ring-amber-400/30 scale-102'
                        : 'border-stone-200 hover:border-amber-300'
                    }`}
                    aria-label={`View image ${index + 1} of ${imageSources.length}`}
                  >
                    <img src={source} alt="" className="h-16 sm:h-20 w-full object-cover" loading="lazy" />
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
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{t('keySpecs')}</p>
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
                <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-500">
                  {t('noSpecsAvailable')}
                </p>
              )}
            </div>

            {model?.colors?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{t('availableColors')}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {model.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer ${
                        selectedColor === color
                          ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
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
              <button
                type="button"
                onClick={handleAddToList}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-amber-600 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900 transition duration-200 hover:bg-amber-100 hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <span>📋</span>
                <span>{t('addToList')}</span>
              </button>
              <a
                href={whatsappHref}
                onClick={() => trackWhatsAppClick('product_modal', { modelName, brand: brandName })}
                target={isExternalWhatsApp ? '_blank' : undefined}
                rel={isExternalWhatsApp ? 'noopener noreferrer' : undefined}
                className="glow-wa inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-[#1fb855] hover:-translate-y-0.5 active:scale-95"
              >
                <span>💬</span>
                <span>{t('whatsappEnquiry')}</span>
              </a>
              <a
                href={phoneHref}
                onClick={() => trackCallClick('product_modal', shop.primaryPhone)}
                target={isExternalPhone ? '_blank' : undefined}
                rel={isExternalPhone ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-bold text-stone-800 transition duration-200 hover:border-stone-300 hover:bg-stone-50"
              >
                <span>📞</span>
                <span>{t('callSeller')}</span>
              </a>
            </div>

            <p className="mt-5 text-xs text-stone-500">Contact <span className="font-semibold text-stone-800">+91 {shop.primaryPhone}</span> for wholesale pricing and stock availability.</p>
            {selectedColor && (
              <p className="mt-1 text-xs text-amber-800 font-medium">{t('selectedColor')}: {selectedColor}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
