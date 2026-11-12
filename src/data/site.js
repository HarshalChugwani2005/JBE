/**
 * Shop details and site-wide constants.
 * Update whatsapp/phone when owner provides numbers (needed by Day 3).
 */

export const shop = {
  name: 'Jai Baba Electronic',
  tagline: 'Wholesale & Retail Electronics in Malkapur',
  // Address, city and opening hours are shown in the visitor's language, so they live in
  // src/i18n/locales/*.js (heroLocation, shopCity, hours). Keep the LocalBusiness JSON-LD
  // in index.html in sync if they change.
  primaryPhone: '9673558859',
  phoneNumbers: ['9673558859', '8421009925', '9156576666', '9421394471'],
  whatsapp: '8421009925',
  siteUrl: 'https://jai-baba-electronics.vercel.app',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Buldana+Road,+Malkapur,+Maharashtra&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Buldana+Road+Malkapur+Maharashtra',
  // Formspree endpoint (set via VITE_FORMSPREE_URL or VITE_FORMSPREE_ID)
  // Opening hours in shop time (Asia/Kolkata). Drives the live "Open now" badge; keep the
  // `hours` text in src/i18n/locales/*.js and the JSON-LD in index.html in sync (test enforces
  // the JSON-LD). days: 0 = Sunday … 6 = Saturday.
  timeZone: 'Asia/Kolkata',
  openingHours: [
    { days: [1, 2, 3, 4, 5, 6], opens: '09:00', closes: '20:00' },
    { days: [0], opens: '10:00', closes: '14:00' },
  ],
  // Google Business Profile "write a review" link (Google Maps → your listing → Share → "Ask
  // for reviews" link). Leave empty to hide the "Review us on Google" button.
  googleReviewUrl: '',
  // Year the shop opened, e.g. 1998. Shows "Serving Malkapur since …" on the About page;
  // leave null to hide it.
  establishedYear: null,
  formspreeUrl:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FORMSPREE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FORMSPREE_ID
      ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
      : ''),
}

/** Category slugs shown on the Home page featured grid. */
export const featuredCategorySlugs = [
  'ceiling-fans',
  'coolers',
  'table-fans',
  'geysers',
]

export function getWhatsAppUrl(message = 'Hi, I would like to enquire about your products.') {
  const number = shop.whatsapp.replace(/\D/g, '')
  const formattedNumber = number.length === 10 ? `91${number}` : number
  const text = encodeURIComponent(message)
  if (!formattedNumber) return `/contact?enquiry=whatsapp`
  return `https://wa.me/${formattedNumber}?text=${text}`
}

export function getPhoneUrl(phoneNumber = shop.primaryPhone) {
  const digits = String(phoneNumber || '').replace(/\D/g, '')
  if (!digits) return '/contact'
  const formatted = digits.length === 10 ? `+91${digits}` : `+${digits}`
  return `tel:${formatted}`
}
