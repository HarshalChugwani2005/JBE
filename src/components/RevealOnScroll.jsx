import { useEffect, useRef, useState } from 'react'

export default function RevealOnScroll({ children, className = '', delay = 0 }) {
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
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${isVisible ? 'reveal-on-scroll--visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}