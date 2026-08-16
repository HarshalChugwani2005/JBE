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
  primaryPhone: '9673558859',
  phoneNumbers: ['9673558859', '8421009925', '9156576666', '9421394471'],
  whatsapp: '8421009925',
  siteUrl: 'https://jaibabaelectronic.vercel.app',
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
