import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { shop } from '../data/site'

const OG_LOCALES = { en: 'en_IN', mr: 'mr_IN', hi: 'hi_IN' }
const JSON_LD_ID = 'page-jsonld'

function setAttr(selector, attribute, value) {
  document.querySelector(selector)?.setAttribute(attribute, value)
}

/**
 * Updates document metadata for the current route.
 *
 * - `noindex`: adds <meta name="robots" content="noindex"> while mounted (404 / not-found states).
 * - `jsonLd`: object or array of schema.org objects, injected as one <script type="application/ld+json">
 *   and removed on unmount. The site-wide LocalBusiness JSON-LD in index.html is left untouched.
 */
export default function SEO({ title, description, image = '/og-image.png', noindex = false, jsonLd }) {
  const { pathname } = useLocation()
  const { lang, t } = useLanguage()
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const siteUrl = shop.siteUrl || window.location.origin
    const fullTitle = title ? `${title} | ${shop.name}` : `${shop.name} — ${t('heroTagline')}`
    const metaDescription = description || t('seoHomeDescription')
    // Canonical and og:url use the pathname only, so filter query strings never create duplicate URLs.
    const fullUrl = `${siteUrl}${pathname}`
    const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`

    document.title = fullTitle
    setAttr('meta[name="description"]', 'content', metaDescription)
    setAttr('link[rel="canonical"]', 'href', fullUrl)
    setAttr('meta[property="og:title"]', 'content', fullTitle)
    setAttr('meta[property="og:description"]', 'content', metaDescription)
    setAttr('meta[property="og:image"]', 'content', fullImageUrl)
    setAttr('meta[property="og:image:secure_url"]', 'content', fullImageUrl)
    setAttr('meta[property="og:url"]', 'content', fullUrl)
    setAttr('meta[property="og:locale"]', 'content', OG_LOCALES[lang] || OG_LOCALES.en)
    setAttr('meta[name="twitter:title"]', 'content', fullTitle)
    setAttr('meta[name="twitter:description"]', 'content', metaDescription)
    setAttr('meta[name="twitter:image"]', 'content', fullImageUrl)
    setAttr('meta[name="twitter:url"]', 'content', fullUrl)
  }, [title, description, image, pathname, lang, t])

  useEffect(() => {
    if (!noindex) return undefined
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => robots.remove()
  }, [noindex])

  useEffect(() => {
    if (!jsonLdText) return undefined
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = JSON_LD_ID
    script.textContent = jsonLdText
    document.getElementById(JSON_LD_ID)?.remove()
    document.head.appendChild(script)
    return () => script.remove()
  }, [jsonLdText])

  return null
}
