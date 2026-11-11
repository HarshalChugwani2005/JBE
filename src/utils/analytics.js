import { track } from '@vercel/analytics'

/**
 * Event tracking (WhatsApp / call clicks, enquiry list, contact form).
 *
 * - Vercel Web Analytics: page views work on every plan, but custom events (track()) are only
 *   recorded on Vercel Pro — on the free Hobby plan they are silently dropped.
 * - Google Analytics 4 (free): set VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXX) in Vercel and every
 *   event below is also sent to GA4. Off when the variable is empty.
 * - Plausible: used automatically if its script is added to the page.
 */

const GA_MEASUREMENT_ID = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID) || ''

/** Loads GA4 when configured. No inline script, so the Content-Security-Policy stays strict. */
export function installAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // GA4 expects the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // Single-page navigation is counted by GA4's enhanced measurement (history changes).
  window.gtag('config', GA_MEASUREMENT_ID)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
  document.head.appendChild(script)
}

export function trackEvent(eventName, props = {}) {
  // 1. Vercel Analytics Custom Event
  try {
    track(eventName, props)
  } catch {
    // ignore in non-supported environments
  }

  // 2. Plausible Analytics
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }

  // 3. Google Analytics (GA4 gtag)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, props)
  }

  // 4. Dev / Debug log
  if (import.meta.env.DEV) {
    console.debug(`[Analytics Event] ${eventName}:`, props)
  }
}

export function trackWhatsAppClick(source, details = {}) {
  trackEvent('whatsapp_click', {
    source, // e.g. 'floating_button', 'product_modal', 'contact_page', 'enquiry_cart'
    ...details,
  })
}

export function trackCallClick(source, phoneNumber) {
  trackEvent('call_click', {
    source, // e.g. 'contact_page', 'product_modal', 'navbar'
    phone: phoneNumber,
  })
}

export function trackFormSubmit(status) {
  trackEvent('form_submit', {
    status, // 'success' | 'failure'
  })
}

export function trackEnquiryCartAction(action, details = {}) {
  trackEvent('enquiry_cart', {
    action, // 'add_item' | 'remove_item' | 'submit_enquiry'
    ...details,
  })
}
