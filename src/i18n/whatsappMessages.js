/**
 * WhatsApp message templates in English, Marathi and Hindi.
 *
 * Messages are written in the visitor's selected language. Product data
 * (brand, model, color, specs) stays as-is so the shop can identify items.
 * Every language must define the same label keys (enforced by test/whatsappMessages.test.js).
 */

const DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
const SHOP_HEADING = 'JAI BABA ELECTRONIC'

export const whatsappLabels = {
  en: {
    greeting: 'Hi, I would like to enquire about your products.',
    quoteTitle: 'QUOTATION REQUEST',
    date: 'Date',
    customer: 'Customer',
    orderType: 'Order Type',
    wholesale: 'Wholesale / Dealer (Bulk Order)',
    retail: 'Retail / Personal (Home Use)',
    notes: 'Location / Notes',
    requestedProducts: 'Requested Products',
    itemSingular: 'item',
    itemPlural: 'items',
    category: 'Category',
    color: 'Color',
    selectedColor: 'Selected Color',
    quantity: 'Quantity',
    unitSingular: 'unit',
    unitPlural: 'units',
    quoteClosing:
      'Hello! Please share your best price quotation, current stock availability, and delivery/pickup details for the items listed above. Thank you!',
    productTitle: 'PRODUCT ENQUIRY',
    model: 'Model',
    product: 'Product',
    keySpec: 'Key Spec',
    productClosing:
      'Hello! Please share current wholesale and retail pricing, warranty details, and availability for this model. Thank you!',
    contactTitle: 'DIRECT ENQUIRY',
    customerName: 'Customer Name',
    phone: 'Phone Number',
    message: 'Requirement / Message',
    notProvided: 'Not provided',
    contactClosing: 'Looking forward to hearing from you soon. Thank you!',
    errorReport: 'Hi, the Jai Baba Electronic website is showing an error. Please help!',
    compareTitle: 'PRODUCT COMPARISON',
    compareClosing: 'Hello! I am choosing between these models. Please share prices and help me pick the right one. Thank you!',
  },
  mr: {
    greeting: 'नमस्कार, मला तुमच्या उत्पादनांबद्दल चौकशी करायची आहे.',
    quoteTitle: 'कोटेशन विनंती',
    date: 'दिनांक',
    customer: 'ग्राहक',
    orderType: 'ऑर्डर प्रकार',
    wholesale: 'होलसेल / डीलर (मोठी ऑर्डर)',
    retail: 'रिटेल / वैयक्तिक (घरगुती वापर)',
    notes: 'ठिकाण / टीप',
    requestedProducts: 'हवी असलेली उत्पादने',
    itemSingular: 'वस्तू',
    itemPlural: 'वस्तू',
    category: 'श्रेणी',
    color: 'रंग',
    selectedColor: 'निवडलेला रंग',
    quantity: 'संख्या',
    unitSingular: 'नग',
    unitPlural: 'नग',
    quoteClosing:
      'नमस्कार! वरील वस्तूंसाठी तुमचा सर्वोत्तम दर, सध्याचा स्टॉक आणि डिलिव्हरी/पिकअपची माहिती कृपया पाठवा. धन्यवाद!',
    productTitle: 'उत्पादन चौकशी',
    model: 'मॉडेल',
    product: 'उत्पादन',
    keySpec: 'मुख्य वैशिष्ट्य',
    productClosing:
      'नमस्कार! कृपया या मॉडेलचा सध्याचा होलसेल व रिटेल दर, वॉरंटी आणि उपलब्धतेची माहिती द्या. धन्यवाद!',
    contactTitle: 'थेट चौकशी',
    customerName: 'ग्राहकाचे नाव',
    phone: 'फोन नंबर',
    message: 'गरज / संदेश',
    notProvided: 'दिलेले नाही',
    contactClosing: 'तुमच्या उत्तराची वाट पाहत आहे. धन्यवाद!',
    errorReport: 'नमस्कार, जय बाबा इलेक्ट्रॉनिकच्या वेबसाइटवर त्रुटी दिसत आहे. कृपया मदत करा!',
    compareTitle: 'उत्पादन तुलना',
    compareClosing: 'नमस्कार! मला यापैकी एक मॉडेल निवडायचे आहे. कृपया दर कळवा आणि योग्य मॉडेल निवडण्यास मदत करा. धन्यवाद!',
  },
  hi: {
    greeting: 'नमस्ते, मुझे आपके उत्पादों के बारे में जानकारी चाहिए।',
    quoteTitle: 'कोटेशन अनुरोध',
    date: 'दिनांक',
    customer: 'ग्राहक',
    orderType: 'ऑर्डर प्रकार',
    wholesale: 'होलसेल / डीलर (बल्क ऑर्डर)',
    retail: 'रिटेल / व्यक्तिगत (घरेलू उपयोग)',
    notes: 'स्थान / नोट्स',
    requestedProducts: 'आवश्यक उत्पाद',
    itemSingular: 'आइटम',
    itemPlural: 'आइटम',
    category: 'श्रेणी',
    color: 'रंग',
    selectedColor: 'चुना गया रंग',
    quantity: 'मात्रा',
    unitSingular: 'नग',
    unitPlural: 'नग',
    quoteClosing:
      'नमस्ते! कृपया ऊपर दी गई वस्तुओं के लिए अपना सबसे अच्छा रेट, मौजूदा स्टॉक और डिलीवरी/पिकअप की जानकारी भेजें। धन्यवाद!',
    productTitle: 'उत्पाद पूछताछ',
    model: 'मॉडल',
    product: 'उत्पाद',
    keySpec: 'मुख्य विशेषता',
    productClosing:
      'नमस्ते! कृपया इस मॉडल का मौजूदा होलसेल और रिटेल रेट, वारंटी और उपलब्धता की जानकारी दें। धन्यवाद!',
    contactTitle: 'सीधी पूछताछ',
    customerName: 'ग्राहक का नाम',
    phone: 'फ़ोन नंबर',
    message: 'आवश्यकता / संदेश',
    notProvided: 'नहीं दिया गया',
    contactClosing: 'आपके जवाब का इंतज़ार रहेगा। धन्यवाद!',
    errorReport: 'नमस्ते, जय बाबा इलेक्ट्रॉनिक की वेबसाइट पर त्रुटि दिख रही है। कृपया मदद करें!',
    compareTitle: 'उत्पाद तुलना',
    compareClosing: 'नमस्ते! मुझे इनमें से एक मॉडल चुनना है। कृपया रेट बताएं और सही मॉडल चुनने में मदद करें। धन्यवाद!',
  },
}

function labelsFor(lang) {
  return whatsappLabels[lang] || whatsappLabels.en
}

function productLine(brand, modelName) {
  return `${brand ? `${brand} ` : ''}${modelName}`
}

function formatDate(lang, date) {
  try {
    return date.toLocaleDateString(`${lang}-IN`, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      numberingSystem: 'latn',
    })
  } catch {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
}

/** Default greeting for generic "Chat on WhatsApp" buttons. */
export function buildGreeting(lang) {
  return labelsFor(lang).greeting
}

/** Message for reporting a site error from the error screen. */
export function buildErrorReport(lang) {
  return labelsFor(lang).errorReport
}

/** Multi-item quotation request from the enquiry list (cart drawer). */
export function buildQuoteMessage(lang, { items, totalCount, buyerName = '', buyerType, notes = '', date = new Date() }) {
  const L = labelsFor(lang)
  const lines = [`*${SHOP_HEADING} — ${L.quoteTitle}*`, DIVIDER, `${L.date}: ${formatDate(lang, date)}`]

  if (buyerName.trim()) lines.push(`${L.customer}: ${buyerName.trim()}`)
  lines.push(`${L.orderType}: ${buyerType === 'wholesale' ? L.wholesale : L.retail}`)
  if (notes.trim()) lines.push(`${L.notes}: ${notes.trim()}`)
  lines.push(DIVIDER, '')
  lines.push(`${L.requestedProducts} (${totalCount} ${totalCount > 1 ? L.itemPlural : L.itemSingular}):`, '')

  items.forEach((item, index) => {
    const qty = item.quantity || 1
    lines.push(`*${index + 1}. ${productLine(item.brand, item.modelName)}*`)
    lines.push(`   • ${L.category}: ${item.categoryLabel || item.categorySlug}`)
    if (item.selectedColor) lines.push(`   • ${L.color}: ${item.selectedColor}`)
    lines.push(`   • ${L.quantity}: *${qty} ${qty > 1 ? L.unitPlural : L.unitSingular}*`, '')
  })

  lines.push(DIVIDER, `_"${L.quoteClosing}"_`)
  return lines.join('\n')
}

/** Single-product enquiry from the product detail modal. */
export function buildProductEnquiryMessage(lang, { brand, modelName, categoryLabel, selectedColor, keySpec }) {
  const L = labelsFor(lang)
  return [
    `*${SHOP_HEADING} — ${L.productTitle}*`,
    DIVIDER,
    `*${L.model}:* ${productLine(brand, modelName)}`,
    `*${L.category}:* ${categoryLabel}`,
    selectedColor ? `*${L.selectedColor}:* ${selectedColor}` : null,
    keySpec ? `*${L.keySpec}:* ${keySpec}` : null,
    DIVIDER,
    `_"${L.productClosing}"_`,
  ]
    .filter(Boolean)
    .join('\n')
}

/** Several models from the compare page: "which of these should I buy?" */
export function buildCompareMessage(lang, { categoryLabel, products }) {
  const L = labelsFor(lang)
  return [
    `*${SHOP_HEADING} — ${L.compareTitle}*`,
    DIVIDER,
    categoryLabel ? `*${L.category}:* ${categoryLabel}` : null,
    ...products.map((name, index) => `${index + 1}. ${name}`),
    DIVIDER,
    `_"${L.compareClosing}"_`,
  ]
    .filter(Boolean)
    .join('\n')
}

/** Contact-form enquiry sent via WhatsApp. */
export function buildContactMessage(lang, { name, phone, message }) {
  const L = labelsFor(lang)
  return [
    `${SHOP_HEADING} — ${L.contactTitle}`,
    DIVIDER,
    `${L.customerName}: ${name || L.notProvided}`,
    `${L.phone}: ${phone || L.notProvided}`,
    DIVIDER,
    `${L.message}:`,
    message || '',
    DIVIDER,
    `"${L.contactClosing}"`,
  ].join('\n')
}
