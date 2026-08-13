/**
 * Shop details and site-wide constants.
 * Update whatsapp/phone when owner provides numbers (needed by Day 3).
 */

export const shop = {
  name: 'Jai Baba Electronic',
  tagline: 'Wholesale & Retail Electronics in Malkapur',
  address: 'Buldana Road, Malkapur',
  city: 'Malkapur, Maharashtra',
  hours: 'Mon–Sat: 9:00 AM – 8:00 PM · Sun: 10:00 AM – 2:00 PM',
  phone: '9673558859,8421009925,9156576666,9421394471', // e.g. '919876543210' — Day 3
  whatsapp: '8421009925', // e.g. '919876543210' — Day 3
  mapEmbedUrl:
    'https://maps.google.com/maps?q=Buldana+Road,+Malkapur,+Maharashtra&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=Buldana+Road+Malkapur+Maharashtra',
  // Formspree endpoint (set to your form's URL, e.g. 'https://formspree.io/f/xyz')
  formspreeUrl: '',
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
  const text = encodeURIComponent(message)
  if (!number) return `/contact?enquiry=whatsapp`
  return `https://wa.me/${number}?text=${text}`
}

export function getPhoneUrl() {
  const number = shop.phone.replace(/\D/g, '')
  if (!number) return '/contact'
  return `tel:+${number}`
}
