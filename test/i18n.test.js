import assert from 'node:assert/strict'
import test from 'node:test'
import { categories } from '../src/data/products.js'
import { interpolate, translate, translateCategory } from '../src/i18n/format.js'
import { buildCategorySeo, buildModelSeo } from '../src/i18n/seo.js'
import { categoryLabels, translations } from '../src/i18n/translations.js'

const languages = Object.keys(translations)

/** Plural variants (`key_one`, `key_other`) count as the base key. */
function baseKeys(dict) {
  return new Set(Object.keys(dict).map((key) => key.replace(/_(one|other)$/, '')))
}

test('every English translation key exists in every language', () => {
  const englishKeys = baseKeys(translations.en)
  for (const lang of languages) {
    const keys = baseKeys(translations[lang])
    const missing = [...englishKeys].filter((key) => !keys.has(key))
    const extra = [...keys].filter((key) => !englishKeys.has(key))
    assert.deepEqual(missing, [], `${lang} is missing keys`)
    assert.deepEqual(extra, [], `${lang} has keys English does not define`)
    for (const [key, value] of Object.entries(translations[lang])) {
      assert.ok(typeof value === 'string' && value.trim(), `${lang}.${key} is empty`)
    }
  }
})

test('translations keep the same {placeholders} as English', () => {
  const placeholders = (value) => [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()
  for (const [key, value] of Object.entries(translations.en)) {
    const base = key.replace(/_(one|other)$/, '')
    for (const lang of languages) {
      const translated = translations[lang][key] ?? translations[lang][base]
      assert.deepEqual(placeholders(translated), placeholders(value), `${lang}.${base} placeholders differ`)
    }
  }
})

test('every catalog category has a label in every language', () => {
  for (const category of categories) {
    assert.equal(
      categoryLabels.en[category.category],
      category.categoryLabel,
      `English label for ${category.category} should match products.js`,
    )
    for (const lang of languages) {
      assert.ok(categoryLabels[lang]?.[category.category]?.trim(), `${lang} is missing a label for ${category.category}`)
    }
  }
})

test('every catalog spec, colour, tagline and warranty has Marathi and Hindi text', async () => {
  const { productTextByLang } = await import('../src/i18n/productText.js')
  const strings = new Set()
  for (const category of categories) {
    for (const entry of category.brands ?? []) {
      ;[entry.tagline, entry.warranty].filter(Boolean).forEach((s) => strings.add(s))
      for (const model of entry.models ?? []) {
        ;[...(model.specs ?? []), ...(model.colors ?? []), model.tagline, model.warranty].filter(Boolean).forEach((s) => strings.add(s))
      }
    }
  }
  for (const lang of ['mr', 'hi']) {
    const missing = [...strings].filter((s) => !productTextByLang[lang].get(s)?.trim())
    assert.deepEqual(missing, [], `${lang} is missing product text`)
  }
})

test('translate interpolates, pluralizes and falls back to English', () => {
  assert.equal(translate('en', 'modelCount', { count: 1 }), '1 model')
  assert.equal(translate('en', 'modelCount', { count: 3 }), '3 models')
  assert.equal(translate('hi', 'modelCount', { count: 3 }), '3 मॉडल')
  assert.equal(translate('xx', 'navHome'), 'Home')
  assert.equal(translate('en', 'no-such-key'), 'no-such-key')
  assert.equal(interpolate('Hi {name}, {missing}', { name: 'Ram' }), 'Hi Ram, {missing}')
  assert.equal(translateCategory('mr', 'coolers'), 'कूलर')
  assert.equal(translateCategory('mr', 'unknown-slug', 'Fallback'), 'Fallback')
})

test('index.html home metadata matches the English home page strings', async () => {
  const { readFileSync } = await import('node:fs')
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const decode = (value) => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"')
  const meta = (pattern) => decode(html.match(pattern)?.[1] ?? '')
  const title = `Jai Baba Electronic — ${translations.en.heroTagline}`
  const description = translations.en.seoHomeDescription

  assert.equal(meta(/<title>([^<]*)<\/title>/), title)
  assert.equal(meta(/<meta name="description" content="([^"]*)"/), description)
  assert.equal(meta(/<meta property="og:title" content="([^"]*)"/), title)
  assert.equal(meta(/<meta property="og:description" content="([^"]*)"/), description)
  assert.equal(meta(/<meta name="twitter:title" content="([^"]*)"/), title)
  assert.equal(meta(/<meta name="twitter:description" content="([^"]*)"/), description)
})

test('SEO builders produce complete metadata for every route', () => {
  for (const category of categories) {
    const page = buildCategorySeo('en', category)
    assert.ok(page.title && page.description.includes(category.categoryLabel))
    for (const brand of category.brands ?? []) {
      for (const model of brand.models ?? []) {
        const meta = buildModelSeo('en', category, brand.brand, model)
        assert.ok(meta.title.includes(model.modelName))
        assert.ok(!meta.description.includes('{'), `unfilled placeholder in ${meta.title}`)
        assert.ok(!meta.description.includes('. .'), `empty specs leave a stray period in ${meta.title}`)
      }
    }
  }
})
