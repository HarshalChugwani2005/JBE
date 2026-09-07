import assert from 'node:assert/strict'
import test from 'node:test'
import { categories, getModelBySlug } from '../src/data/products.js'
import { slugify } from '../src/utils/slugify.js'

test('product slugs are stable and resolve back to their models', () => {
  for (const category of categories) {
    const slugs = new Set()

    for (const brand of category.brands ?? []) {
      for (const model of brand.models ?? []) {
        const modelSlug = slugify(model.modelName)
        assert.ok(modelSlug, `${category.category}/${model.modelName} should have a slug`)
        assert.equal(slugs.has(modelSlug), false, `${category.category}/${modelSlug} is duplicated`)
        slugs.add(modelSlug)

        const resolved = getModelBySlug(category.category, modelSlug)
        assert.equal(resolved?.model, model)
        assert.equal(resolved?.brand, brand)
      }
    }
  }
})

test('slugs trim punctuation and repeated separators consistently', () => {
  assert.equal(slugify('Intex Designer (Sona)'), 'intex-designer-sona')
  assert.equal(slugify('  12V / Rechargeable  '), '12v-rechargeable')
  assert.equal(slugify('MX-200'), 'mx-200')
})

test('catalog categories have unique category slugs', () => {
  const slugs = categories.map((category) => category.category)
  assert.equal(new Set(slugs).size, slugs.length)
})
