import assert from 'node:assert/strict'
import test from 'node:test'
import { categories } from '../src/data/products.js'
import { filterCatalog, filterCategoryBrands, toQueryWords } from '../src/utils/catalogFilters.js'

const brands = [...new Set(categories.flatMap((c) => (c.brands ?? []).map((b) => b.brand)))]
const sampleQueries = ['', 'fan', 'zipsy', 'सिलिंग', 'कूलर', 'led 9w', 'brown', 'no-such-thing']
const tiers = ['', 'budget', 'mid', 'premium']

test('catalog index and category page agree for every filter combination', () => {
  for (const query of sampleQueries) {
    for (const tier of tiers) {
      for (const inStockOnly of [false, true]) {
        for (const brand of ['', brands[0], brands.at(-1)]) {
          const filters = { query, tier, inStockOnly, brand }
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

test('a model must pass every filter at once', () => {
  for (const category of categories) {
    for (const entry of filterCategoryBrands(category, { tier: 'premium', inStockOnly: true })) {
      for (const model of entry.models) {
        assert.equal(model.priceTier, 'premium')
        assert.notEqual(model.inStock, false)
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
