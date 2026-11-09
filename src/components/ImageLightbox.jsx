import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../context/useLanguage'
import { getImageSrcSet } from '../data/productImages'
import { trapTabKey } from '../utils/focus'

/**
 * Fullscreen image lightbox.
 *
 * Props:
 *   images      – string[]   – ordered list of image URLs
 *   startIndex  – number     – which image to open on (default 0)
 *   alt         – string     – base alt text (index is appended automatically)
 *   onClose     – () => void – called when the user closes the lightbox
 */
export default function ImageLightbox({ images = [], startIndex = 0, alt = '', onClose }) {
  const { t } = useLanguage()
  const [index, setIndex] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)
  const [animDir, setAnimDir] = useState(null) // 'left' | 'right' | null
  const touchStartX = useRef(null)
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const onCloseRef = useRef(onClose)

  const total = images.length
  const src = images[index] ?? null
  const name = alt || t('product')

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // ── Navigation ───────────────────────────────────────────────────────────────
  const go = useCallback(
    (dir) => {
      if (total <= 1) return
      setZoomed(false)
      setAnimDir(dir)
      setIndex((prev) => (dir === 'right' ? (prev + 1) % total : (prev - 1 + total) % total))
      setTimeout(() => setAnimDir(null), 320)
    },
    [total],
  )

  const goNext = useCallback(() => go('right'), [go])
  const goPrev = useCallback(() => go('left'), [go])

  // ── Focus: remember the opener once, restore it on unmount ──────────────────
  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus())
    return () => {
      cancelAnimationFrame(frame)
      previouslyFocusedRef.current?.focus?.()
    }
  }, [])

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onCloseRef.current?.(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); return }
      trapTabKey(e, dialogRef.current)
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  // ── Body scroll lock ─────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // ── Touch / swipe ────────────────────────────────────────────────────────────
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 45) return
    if (delta < 0) goNext(); else goPrev()
  }

  // ── Zoom toggle ──────────────────────────────────────────────────────────────
  const handleImageClick = () => setZoomed((z) => !z)

  const animClass =
    animDir === 'right' ? 'lb-slide-right' :
    animDir === 'left'  ? 'lb-slide-left'  : ''

  const content = (
    <div
      ref={dialogRef}
      className="lb-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t('imageViewerLabel', { name })}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Header controls ── */}
      <div className="lb-header">
        {total > 1 && (
          <span className="lb-counter" aria-live="polite">{index + 1} / {total}</span>
        )}
        <div className="lb-header-right">
          <button type="button" className="lb-btn lb-btn-zoom" onClick={handleImageClick} aria-pressed={zoomed}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d={zoomed ? 'm21 21-4.35-4.35M8 11h6' : 'm21 21-4.35-4.35M11 8v6M8 11h6'} />
            </svg>
            {zoomed ? t('zoomOut') : t('zoomIn')}
          </button>
          <button ref={closeButtonRef} type="button" className="lb-btn lb-btn-close" onClick={onClose} aria-label={t('closeImageViewer')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            {t('close')}
          </button>
        </div>
      </div>

      {/* ── Prev arrow ── */}
      {total > 1 && (
        <button type="button" className="lb-nav lb-nav-prev" onClick={goPrev} aria-label={t('previousImage')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6" aria-hidden="true">
            <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* ── Image stage ── */}
      <div
        className={`lb-stage${zoomed ? ' lb-stage-zoomed' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleImageClick}
        title={zoomed ? t('clickToZoomOut') : t('clickToZoomIn')}
      >
        {src && (
          <img
            key={src}
            src={src}
            alt={t('imageAlt', { name, index: index + 1, total })}
            className={`lb-img${animClass ? ` ${animClass}` : ''}${zoomed ? ' lb-img-zoomed' : ''}`}
            draggable={false}
          />
        )}
      </div>

      {/* ── Next arrow ── */}
      {total > 1 && (
        <button type="button" className="lb-nav lb-nav-next" onClick={goNext} aria-label={t('nextImage')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6" aria-hidden="true">
            <path strokeLinecap="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* ── Keyboard hint ── */}
      {total > 1 && (
        <div className="lb-key-hint" aria-hidden="true">
          <kbd>←</kbd> <kbd>→</kbd> {t('keyHintNavigate')} · <kbd>Esc</kbd> {t('close')}
        </div>
      )}

      {/* ── Thumbnail strip ── */}
      {total > 1 && (
        <div className="lb-thumbs" role="group" aria-label={t('imageThumbnails')}>
          {images.map((imgSrc, i) => (
            <button
              key={imgSrc}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                const dir = i > index ? 'right' : 'left'
                setZoomed(false)
                setAnimDir(dir)
                setIndex(i)
                setTimeout(() => setAnimDir(null), 320)
              }}
              aria-label={t('viewImage', { index: i + 1 })}
              aria-current={i === index ? 'true' : undefined}
              className={`lb-thumb${i === index ? ' lb-thumb-active' : ''}`}
            >
              <img src={imgSrc} srcSet={getImageSrcSet(imgSrc)} sizes="80px" alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return createPortal(content, document.body)
}
