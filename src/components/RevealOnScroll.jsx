import { useEffect, useRef, useState } from 'react'

/**
 * Premium scroll-triggered reveal component.
 * @param {'up'|'left'|'right'|'scale'} variant - animation direction
 * @param {number} delay - transition delay in ms
 * @param {number} threshold - intersection threshold (0-1)
 */
export default function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  threshold = 0.12,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || isVisible) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isVisible, threshold])

  // Map variant → CSS classes
  const variantClass = {
    up:    'reveal-on-scroll',
    left:  'reveal-on-scroll reveal-from-left',
    right: 'reveal-on-scroll reveal-from-right',
    scale: 'reveal-on-scroll reveal-scale',
  }[variant] ?? 'reveal-on-scroll'

  return (
    <div
      ref={ref}
      className={`${variantClass} ${isVisible ? 'reveal-on-scroll--visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}