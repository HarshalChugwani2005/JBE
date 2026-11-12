import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import '../src/i18n/allLocales.js'
import { faq, localizedFaq } from '../src/data/faq.js'
import { categories } from '../src/data/products.js'
import { reviews } from '../src/data/reviews.js'
import { currentSeason, seasonCategories, seasons } from '../src/data/seasons.js'
import { shop } from '../src/data/site.js'
import { translate } from '../src/i18n/format.js'
import { fanRecommendation, geyserRecommendation, ledRecommendation, roomArea, statedLitres, statedLumens } from '../src/utils/buyingGuide.js'
import { getOpenStatus } from '../src/utils/openingHours.js'
import { similarModels } from '../src/utils/similarProducts.js'

// ── Opening hours ────────────────────────────────────────────────────────────
test('open status follows the shop hours in India time', () => {
  // 2026-11-12 is a Thursday; 2026-11-14 Saturday; 2026-11-15 Sunday. Times are UTC (IST − 5:30).
  assert.deepEqual(getOpenStatus(new Date('2026-11-12T03:00:00Z')), { open: false, opensAt: '09:00', when: 'today', day: 4 })
  assert.deepEqual(getOpenStatus(new Date('2026-11-12T04:00:00Z')), { open: true, closesAt: '20:00' })
  assert.deepEqual(getOpenStatus(new Date('2026-11-12T14:31:00Z')), { open: false, opensAt: '09:00', when: 'tomorrow', day: 5 })
  assert.deepEqual(getOpenStatus(new Date('2026-11-14T15:00:00Z')), { open: false, opensAt: '10:00', when: 'tomorrow', day: 0 })
  assert.deepEqual(getOpenStatus(new Date('2026-11-15T07:00:00Z')), { open: true, closesAt: '14:00' })
  assert.deepEqual(getOpenStatus(new Date('2026-11-15T09:00:00Z')), { open: false, opensAt: '09:00', when: 'tomorrow', day: 1 })
})

test('index.html opening hours JSON-LD matches site.js', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const business = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const fromJsonLd = business.openingHoursSpecification.map((spec) => ({
    days: [spec.dayOfWeek].flat().map((d) => names.indexOf(d)).sort(),
    opens: spec.opens,
    closes: spec.closes,
  }))
  const fromSite = shop.openingHours.map((slot) => ({ ...slot, days: [...slot.days].sort() }))
  assert.deepEqual(fromJsonLd, fromSite)
})

// ── Buying guide ─────────────────────────────────────────────────────────────
test('fan size follows the room area', () => {
  assert.equal(roomArea('12', '10'), 120)
  assert.equal(roomArea('', '10'), 0)
  assert.equal(fanRecommendation(0), null)
  assert.deepEqual(fanRecommendation(40), { portable: true })
  assert.deepEqual(fanRecommendation(100), { count: 1, sweep: 1050 })
  assert.deepEqual(fanRecommendation(150), { count: 1, sweep: 1200 })
  assert.deepEqual(fanRecommendation(200), { count: 1, sweep: 1400 })
  assert.deepEqual(fanRecommendation(500), { count: 3, sweep: 1200 })
})

test('lighting suggestions reach the target with catalog lumens', () => {
  for (const [area, room] of [[120, 'bedroom'], [180, 'living'], [80, 'kitchen'], [400, 'shop']]) {
    const rec = ledRecommendation(area, room)
    assert.ok(rec.options.length > 0, `${room}: no options`)
    for (const option of rec.options) {
      assert.ok(option.count * option.lumens >= rec.lumens, `${option.model.modelName} × ${option.count} falls short`)
      assert.equal(option.lumens, statedLumens(option.model), 'only lumens stated in the catalog are used')
    }
  }
  assert.equal(ledRecommendation(100, 'garage'), null)
})

test('geyser suggestions only use stated capacities', () => {
  const kitchen = geyserRecommendation('kitchen', 2)
  assert.equal(kitchen.type, 'instant')
  assert.ok(kitchen.matches.every((m) => m.litres <= 3.5 && m.litres === statedLitres(m.model)))
  const bigFamily = geyserRecommendation('bath', 6)
  assert.equal(bigFamily.type, 'storage')
  assert.equal(geyserRecommendation('bath', 0), null)
})

// ── Seasons, similar products, FAQ, reviews ──────────────────────────────────
test('every season category exists in the catalog and each month maps to a season', () => {
  for (const season of seasons) assert.equal(seasonCategories(season).length, season.categories.length, season.slug)
  const months = seasons.flatMap((s) => s.months).sort((a, b) => a - b)
  assert.deepEqual(months, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  assert.equal(currentSeason(new Date('2026-05-10T12:00:00Z')).slug, 'summer')
  assert.equal(currentSeason(new Date('2026-08-10T12:00:00Z')).slug, 'monsoon')
  assert.equal(currentSeason(new Date('2026-12-10T12:00:00Z')).slug, 'winter')
})

test('similar products exclude the current model and prefer the same price tier', () => {
  const fans = categories.find((c) => c.category === 'ceiling-fans')
  const titan = fans.brands[0].models.find((m) => m.modelName === 'Titan')
  const similar = similarModels('ceiling-fans', 'Titan', titan.priceTier)
  assert.ok(similar.length > 0 && similar.length <= 4)
  assert.ok(similar.every(({ model }) => model.modelName !== 'Titan'))
  const firstOtherTier = similar.findIndex(({ model }) => model.priceTier !== titan.priceTier)
  if (firstOtherTier !== -1) assert.ok(similar.slice(firstOtherTier).every(({ model }) => model.priceTier !== titan.priceTier))
  assert.deepEqual(similarModels('no-such-category', 'x'), [])
})

test('FAQ is complete in every language with placeholders filled', () => {
  for (const item of faq) {
    for (const lang of ['en', 'mr', 'hi']) {
      assert.ok(item.q[lang]?.trim() && item.a[lang]?.trim(), `${item.id} missing ${lang}`)
    }
  }
  for (const lang of ['en', 'mr', 'hi']) {
    for (const item of localizedFaq(lang, translate)) assert.ok(!/\{\w+\}/.test(item.answer), `${lang}/${item.id} has an unfilled placeholder`)
  }
})

test('reviews have the documented shape', () => {
  for (const review of reviews) {
    assert.ok(review.name?.trim() && review.text?.trim(), 'name and text are required')
    if (review.rating !== undefined) assert.ok(review.rating >= 1 && review.rating <= 5)
  }
})
