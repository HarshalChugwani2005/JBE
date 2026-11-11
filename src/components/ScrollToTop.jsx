import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { stripLang } from '../i18n/paths'

/**
 * On page navigation: scroll to the top and move focus to the new page's <h1>,
 * so screen readers announce the page instead of staying silent.
 *
 * Opening or closing a product modal (/catalog/:category <-> /catalog/:category/:model)
 * is treated as the same page: no scroll jump behind the modal, and the modal keeps focus.
 */
function pageKey(pathname) {
  const path = stripLang(pathname)
  const match = path.match(/^\/catalog\/[^/]+/)
  return match ? match[0] : path
}

const FOCUS_WAIT_MS = 3000 // lazy routes render their <h1> after the chunk loads

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const key = pageKey(pathname)
  // Initialised to the first page, so the initial load (and StrictMode's double effect run)
  // leaves scroll and focus alone; only real in-app navigation acts.
  const previousKey = useRef(key)

  useEffect(() => {
    if (previousKey.current === key) return undefined
    previousKey.current = key

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const main = document.getElementById('main')
    if (!main) return undefined

    const focusHeading = () => {
      const heading = main.querySelector('h1')
      if (!heading) return false
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
      return true
    }

    if (focusHeading()) return undefined

    const observer = new MutationObserver(() => {
      if (focusHeading()) observer.disconnect()
    })
    observer.observe(main, { childList: true, subtree: true })
    const timer = setTimeout(() => observer.disconnect(), FOCUS_WAIT_MS)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [key])

  return null
}
