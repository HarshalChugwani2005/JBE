import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { shop } from '../data/site'

export default function SEO({ title, description, image = '/og-image.png' }) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${shop.name}` : `${shop.name} — Wholesale & Retail Electronics`
    document.title = fullTitle

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description || shop.tagline)
    }

    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', `${shop.siteUrl || window.location.origin}${pathname}`)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', fullTitle)

    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', description || shop.tagline)
    }

    const fullImageUrl = image.startsWith('http') ? image : `${shop.siteUrl || window.location.origin}${image.startsWith('/') ? image : `/${image}`}`

    const ogImage = document.querySelector('meta[property="og:image"]')
    if (ogImage) ogImage.setAttribute('content', fullImageUrl)

    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) twitterTitle.setAttribute('content', fullTitle)

    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', description || shop.tagline)
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]')
    if (twitterImage) twitterImage.setAttribute('content', fullImageUrl)
  }, [title, description, image, pathname])

  return null
}
