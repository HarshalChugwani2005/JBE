import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildContactMessage,
  buildGreeting,
  buildProductEnquiryMessage,
  buildQuoteMessage,
  whatsappLabels,
} from '../src/i18n/whatsappMessages.js'

const languages = Object.keys(whatsappLabels)

test('every language defines the same WhatsApp label keys', () => {
  const englishKeys = Object.keys(whatsappLabels.en).sort()
  for (const lang of languages) {
    assert.deepEqual(Object.keys(whatsappLabels[lang]).sort(), englishKeys, `${lang} labels differ from en`)
    for (const [key, value] of Object.entries(whatsappLabels[lang])) {
      assert.ok(value.trim(), `${lang}.${key} is empty`)
    }
  }
})

test('quote message is localized and keeps product data intact', () => {
  const items = [
    { brand: 'ZIPSY', modelName: 'Titan', categoryLabel: 'Ceiling Fans', selectedColor: 'Ivory', quantity: 3 },
    { brand: 'Prestige', modelName: 'Cooktop 2 Burner', categorySlug: 'hot-plates' },
  ]
  for (const lang of languages) {
    const L = whatsappLabels[lang]
    const msg = buildQuoteMessage(lang, { items, totalCount: 4, buyerName: ' Ram ', buyerType: 'retail', notes: '' })
    assert.match(msg, /ZIPSY Titan/)
    assert.match(msg, /Ivory/)
    assert.ok(msg.includes(`${L.customer}: Ram`))
    assert.ok(msg.includes(L.retail))
    assert.ok(msg.includes(L.quoteClosing))
    assert.ok(msg.includes('hot-plates'), 'falls back to category slug')
    assert.ok(!msg.includes(L.notes + ':'), 'empty notes are omitted')
  }
})

test('single-product and contact messages use the selected language', () => {
  const hi = whatsappLabels.hi
  const product = buildProductEnquiryMessage('hi', { brand: 'ZIPSY', modelName: 'Zoro', categoryLabel: 'Ceiling Fans', keySpec: 'Wobble-free' })
  assert.ok(product.includes(hi.productClosing) && product.includes('ZIPSY Zoro') && product.includes(hi.keySpec))
  assert.ok(!product.includes(hi.selectedColor), 'missing color line is omitted')


  const contact = buildContactMessage('en', { name: '', phone: '98', message: 'Need 10 fans' })
  assert.ok(contact.includes('Customer Name: Not provided') && contact.includes('Need 10 fans'))
})

test('unknown language falls back to English', () => {
  assert.equal(buildGreeting('xx'), whatsappLabels.en.greeting)
})
