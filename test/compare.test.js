import assert from 'node:assert/strict'
import test from 'node:test'
import { buildCompareMessage } from '../src/i18n/whatsappMessages.js'
import {
  COMPARE_MAX,
  compareSearch,
  findModel,
  parseCompareSearch,
  sanitizeCompareList,
  toggleCompareEntry,
} from '../src/utils/compare.js'

const fan = (modelSlug) => ({ categorySlug: 'ceiling-fans', modelSlug })

test('findModel resolves catalog models by URL slug', () => {
  const found = findModel('ceiling-fans', 'titan')
  assert.equal(found.model.modelName, 'Titan')
  assert.equal(found.brand.brand, 'ZIPSY')
  assert.equal(findModel('ceiling-fans', 'no-such-model'), null)
  assert.equal(findModel('no-such-category', 'titan'), null)
})

test('toggle adds, removes, caps at the maximum and restarts on another category', () => {
  let state = toggleCompareEntry([], fan('titan'))
  assert.deepEqual(state, { list: [fan('titan')], outcome: 'added' })
  state = toggleCompareEntry(state.list, fan('titan'))
  assert.deepEqual(state, { list: [], outcome: 'removed' })

  const full = [fan('titan'), fan('bounce'), fan('glory')]
  assert.equal(full.length, COMPARE_MAX)
  assert.deepEqual(toggleCompareEntry(full, fan('wonder')), { list: full, outcome: 'full' })

  const geyser = { categorySlug: 'geysers', modelSlug: 'rapid-jet-3l' }
  assert.deepEqual(toggleCompareEntry(full, geyser), { list: [geyser], outcome: 'replaced' })
})

test('saved lists are cleaned: unknown models, duplicates, other categories, over the limit', () => {
  const list = sanitizeCompareList([
    fan('titan'),
    fan('titan'),
    fan('gone'),
    { categorySlug: 'geysers', modelSlug: 'rapid-jet-3l' },
    fan('bounce'),
    fan('glory'),
    fan('wonder'),
    null,
    'junk',
  ])
  assert.deepEqual(list, [fan('titan'), fan('bounce'), fan('glory')])
  assert.deepEqual(sanitizeCompareList('nope'), [])
})

test('share links round-trip', () => {
  const list = [fan('titan'), fan('bounce')]
  const search = compareSearch(list)
  assert.equal(search, '?c=ceiling-fans&m=titan%2Cbounce')
  assert.deepEqual(parseCompareSearch(search), list)
  assert.equal(parseCompareSearch(''), null)
  assert.equal(compareSearch([]), '')
})

test('compare WhatsApp message lists every model in each language', () => {
  for (const lang of ['en', 'mr', 'hi']) {
    const message = buildCompareMessage(lang, { categoryLabel: 'Ceiling Fans', products: ['ZIPSY Titan', 'ZIPSY Bounce'] })
    assert.match(message, /1\. ZIPSY Titan\n2\. ZIPSY Bounce/)
    assert.ok(!message.includes('undefined'), lang)
  }
})
