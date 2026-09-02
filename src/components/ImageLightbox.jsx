import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Fullscreen image lightbox.
 *
 * Props:
 *   images      – string[]   – ordered list of image URLs
 *   startIndex  – number     – which image to open on (default 0)
 *   alt         – string     – base alt text (index is appended automatically)
 *   onClose     – () => void – called when the user closes the lightbox
 */
export default function ImageLightbox({ images = [], startIndex = 0, alt = 'Product image', onClose }) {
  const [index, setIndex] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)
  const [animDir, setAnimDir] = useState(null) // 'left' | 'right' | null
  const touchStartX = useRef(null)

  const total = images.length
  const src = images[index] ?? null

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

  // ── Keyboard ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onClose])

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
      className="lb-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer — ${alt}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Header controls ── */}
      <div className="lb-header">
        {total > 1 && (
          <span className="lb-counter" aria-live="polite">{index + 1} / {total}</span>
        )}
        <div className="lb-header-right">
          {zoomed ? (
            <button type="button" className="lb-btn lb-btn-zoom" onClick={handleImageClick} aria-label="Zoom out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35M8 11h6" />
              </svg>
              Zoom out
            </button>
          ) : (
            <button type="button" className="lb-btn lb-btn-zoom" onClick={handleImageClick} aria-label="Zoom in">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35M11 8v6M8 11h6" />
              </svg>
              Zoom in
            </button>
          )}
          <button type="button" className="lb-btn lb-btn-close" onClick={onClose} aria-label="Close image viewer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Close
          </button>
        </div>
      </div>

      {/* ── Prev arrow ── */}
      {total > 1 && (
        <button type="button" className="lb-nav lb-nav-prev" onClick={goPrev} aria-label="Previous image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
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
        title={zoomed ? 'Click to zoom out' : 'Click to zoom in'}
      >
        {src && (
          <img
            key={src}
            src={src}
            alt={`${alt}, image ${index + 1} of ${total}`}
            className={`lb-img${animClass ? ` ${animClass}` : ''}${zoomed ? ' lb-img-zoomed' : ''}`}
            draggable={false}
          />
        )}
      </div>

      {/* ── Next arrow ── */}
      {total > 1 && (
        <button type="button" className="lb-nav lb-nav-next" onClick={goNext} aria-label="Next image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
            <path strokeLinecap="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* ── Keyboard hint ── */}
      {total > 1 && (
        <div className="lb-key-hint" aria-hidden="true">
          <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>Esc</kbd> close
        </div>
      )}

      {/* ── Thumbnail strip ── */}
      {total > 1 && (
        <div className="lb-thumbs" role="list" aria-label="Image thumbnails">
          {images.map((imgSrc, i) => (
            <button
              key={imgSrc}
              type="button"
              role="listitem"
              onClick={(e) => {
                e.stopPropagation()
                const dir = i > index ? 'right' : 'left'
                setZoomed(false)
                setAnimDir(dir)
                setIndex(i)
                setTimeout(() => setAnimDir(null), 320)
              }}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`lb-thumb${i === index ? ' lb-thumb-active' : ''}`}
            >
              <img src={imgSrc} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return createPortal(content, document.body)
}
