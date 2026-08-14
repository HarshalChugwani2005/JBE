/**
 * Lightweight, privacy-friendly event tracking utility.
 * Supports Plausible Analytics and Google Analytics (GA4) if present,
 * with zero dependency overhead.
 */

export function trackEvent(eventName, props = {}) {
  // 1. Plausible Analytics
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(eventName, { props })
  }

  // 2. Google Analytics (GA4 gtag)
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, props)
  }

  // 3. Dev / Debug log
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
