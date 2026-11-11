import assert from 'node:assert/strict'
import test from 'node:test'
// Register Marathi and Hindi so search can match translated specs and colours (the app loads them on demand).
import '../src/i18n/allLocales.js'
import { categories } from '../src/data/products.js'
import { filterCatalog, filterCategoryBrands, toQueryWords } from '../src/utils/catalogFilters.js'

const brands = [...new Set(categories.flatMap((c) => (c.brands ?? []).map((b) => b.brand)))]
const sampleQueries = ['', 'fan', 'zipsy', 'सिलिंग', 'कूलर', 'led 9w', 'brown', 'पांढरा', 'वारंटी', 'no-such-thing']
const tiers = ['', 'budget', 'mid', 'premium']

test('catalog index and category page agree for every filter combination', () => {
  for (const query of sampleQueries) {
    for (const tier of tiers) {
      for (const brand of ['', brands[0], brands.at(-1)]) {
        const filters = { query, tier, brand }
        const listed = new Set(filterCatalog(categories, filters).map((c) => c.category))
        for (const category of categories) {
          if (!category.brands?.some((b) => b.models?.length)) continue
          const shownOnPage = filterCategoryBrands(category, filters).length > 0
          assert.equal(
            listed.has(category.category),
            shownOnPage,
            `${category.category} disagrees for ${JSON.stringify(filters)}`,
          )
        }
      }
    }
  }
})

test('no filters lists every category and every model', () => {
  assert.equal(filterCatalog(categories, {}).length, categories.length)
  for (const category of categories) {
    const shown = filterCategoryBrands(category, {}).flatMap((b) => b.models)
    const all = (category.brands ?? []).flatMap((b) => b.models ?? [])
    assert.equal(shown.length, all.length, category.category)
  }
})

test('search matches category names in every site language', () => {
  const marathi = filterCatalog(categories, { query: 'सिलिंग फॅन' }).map((c) => c.category)
  assert.ok(marathi.includes('ceiling-fans'))
  const onPage = filterCategoryBrands(categories.find((c) => c.category === 'ceiling-fans'), { query: 'ceiling' })
  assert.ok(onPage.length > 0, 'category name search keeps the category page populated')
})

test('search matches translated specs and colours', () => {
  const fans = categories.find((c) => c.category === 'ceiling-fans')
  const whiteEnglish = filterCategoryBrands(fans, { query: 'ivory' }).flatMap((b) => b.models.map((m) => m.modelName))
  const whiteMarathi = filterCategoryBrands(fans, { query: 'आयव्हरी' }).flatMap((b) => b.models.map((m) => m.modelName))
  assert.ok(whiteEnglish.length > 0)
  assert.deepEqual(whiteMarathi, whiteEnglish, 'Marathi colour search finds the same models as English')
  const hindiSpec = filterCategoryBrands(fans, { query: 'डबल बॉल बेयरिंग' })
  assert.ok(hindiSpec.length > 0, 'Hindi spec search finds models')
})

test('the tier filter applies to every listed model', () => {
  for (const category of categories) {
    for (const entry of filterCategoryBrands(category, { tier: 'premium' })) {
      for (const model of entry.models) assert.equal(model.priceTier, 'premium')
    }
  }
})

test('catalog data has no stock fields (stock is not tracked online)', () => {
  for (const category of categories) {
    for (const entry of category.brands ?? []) {
      for (const model of entry.models ?? []) {
        assert.equal('inStock' in model, false, `${category.category}/${model.modelName} still has inStock`)
      }
    }
  }
})

test('name sort uses the provided label and query words are normalised', () => {
  const sorted = filterCatalog(categories, { sort: 'name' }, { labelOf: (c) => c.categoryLabel, locale: 'en' })
  const labels = sorted.map((c) => c.categoryLabel)
  assert.deepEqual(labels, [...labels].sort((a, b) => a.localeCompare(b, 'en')))
  assert.deepEqual(toQueryWords('  LED   9W '), ['led', '9w'])
})
