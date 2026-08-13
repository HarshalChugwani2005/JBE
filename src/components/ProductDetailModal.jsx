import { useEffect, useMemo, useRef, useState } from 'react'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { getProductImageUrls } from '../data/productImages'
import ProductImage from './ProductImage'

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  )
}

export default function ProductDetailModal({ isOpen, onClose, product }) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)

  const model = product?.model ?? product ?? null
  const brand = product?.brand ?? product?.brandName ?? null
  const categorySlug = product?.categorySlug ?? product?.category ?? ''
  const categoryLabel = product?.categoryLabel ?? ''

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

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 px-4 py-6 backdrop-blur-sm sm:px-6 sm:py-10"
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
        className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
              {categoryLabel || categorySlug || 'Product'}
            </p>
            <h2 id="product-modal-title" className="mt-1 text-xl font-semibold text-stone-900 sm:text-2xl">
              {modelName}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition hover:border-amber-300 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            Close
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b border-stone-200 bg-stone-50 p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <ProductImage
              category={categorySlug}
              product={{
                images: Array.isArray(model?.images) ? model.images : undefined,
                image: model.image,
              }}
              alt={`${brandName ? `${brandName} ` : ''}${modelName}`}
              className="aspect-[4/3] rounded-2xl border border-stone-200"
              imgClassName="transition duration-300"
              fallbackLabel="Photo coming soon"
              loading="eager"
            />

            {imageSources.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                {imageSources.map((source, index) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`overflow-hidden rounded-xl border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                      activeImageIndex === index ? 'border-amber-500 ring-2 ring-amber-200' : 'border-stone-200'
                    }`}
                    aria-label={`View image ${index + 1} of ${imageSources.length}`}
                  >
                    <img src={source} alt="" className="h-20 w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {brandName && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                  {brandName}
                </span>
              )}
              {model?.warranty && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {model.warranty}
                </span>
              )}
              {model?.tagline && (
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                  {model.tagline}
                </span>
              )}
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Key specs</p>
              {model?.specs?.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-stone-700">
                  {model.specs.map((spec) => (
                    <li key={spec} className="flex gap-3 rounded-xl bg-stone-50 px-3 py-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2 text-sm text-stone-500">
                  No specifications available for this model yet.
                </p>
              )}
            </div>

            {model?.colors?.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Available colors</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {model.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
                        selectedColor === color
                          ? 'border-amber-500 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-amber-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href={whatsappHref}
                target={isExternalWhatsApp ? '_blank' : undefined}
                rel={isExternalWhatsApp ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1fb855] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
              >
                WhatsApp enquiry
              </a>
              <a
                href={phoneHref}
                target={isExternalPhone ? '_blank' : undefined}
                rel={isExternalPhone ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-300 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Call seller
              </a>
            </div>

            <p className="mt-5 text-sm text-stone-500">Contact {shop.phoneNumbers?.join(', ') || shop.primaryPhone} for pricing and availability.</p>
            {selectedColor && (
              <p className="mt-2 text-sm text-stone-500">Selected color: {selectedColor}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

