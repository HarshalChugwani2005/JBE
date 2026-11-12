/**
 * Buying-guide calculators (ceiling fan size, room lighting, geyser capacity).
 *
 * Rules are common Indian sizing guidelines, kept deliberately simple and conservative.
 * Product suggestions only use numbers the catalog actually states (lumens and litres in
 * specs / model names); nothing is guessed. When no listed product fits, the UI offers a
 * pre-filled WhatsApp question instead.
 */
import { categories } from '../data/products.js'

export const SQFT_PER_SQM = 10.7639

/** Room area in square feet (0 for invalid / empty input). */
export function roomArea(lengthFt, widthFt) {
  const l = Number(lengthFt)
  const w = Number(widthFt)
  if (!(l > 0) || !(w > 0)) return 0
  return Math.round(l * w)
}

// ── Ceiling fans ─────────────────────────────────────────────────────────────
// Sweep (blade span) by room area. Above 250 sq ft: one 1200 mm fan per ~180 sq ft.
const FAN_SWEEPS = [
  { maxArea: 75, sweep: 900 },
  { maxArea: 110, sweep: 1050 },
  { maxArea: 180, sweep: 1200 },
  { maxArea: 250, sweep: 1400 },
]

/** @returns {{ portable: true } | { count: number, sweep: number } | null} */
export function fanRecommendation(areaSqFt) {
  if (!(areaSqFt > 0)) return null
  if (areaSqFt <= 50) return { portable: true }
  const band = FAN_SWEEPS.find((b) => areaSqFt <= b.maxArea)
  if (band) return { count: 1, sweep: band.sweep }
  return { count: Math.ceil(areaSqFt / 180), sweep: 1200 }
}

// ── LED lighting ─────────────────────────────────────────────────────────────
/** Target illuminance (lux) by room type. */
export const ROOM_LUX = { bedroom: 150, living: 200, kitchen: 300, study: 400, shop: 500 }

/** Lumens stated in a model's specs ("900 Lumens — …"), or null. */
export function statedLumens(model) {
  for (const spec of model.specs ?? []) {
    const match = spec.match(/([\d,]+)\s*Lumens/i)
    if (match) return Number(match[1].replace(/,/g, ''))
  }
  return null
}

function lightingCatalog() {
  const items = []
  for (const category of categories.filter((c) => c.category === 'led-bulbs' || c.category === 'led-battens')) {
    for (const brand of category.brands ?? []) {
      for (const model of brand.models ?? []) {
        const lumens = statedLumens(model)
        // Night lamps (tens of lumens) are not room lighting.
        if (lumens && lumens >= 300) items.push({ category, brand, model, lumens })
      }
    }
  }
  return items
}

/**
 * @returns {{ lux: number, lumens: number, options: Array<{ category, brand, model, lumens: number, count: number }> } | null}
 * Options: fixtures that reach the target with a sensible number of lights for the room
 * (roughly one per 80 sq ft), least wasted light first; at most 3.
 */
export function ledRecommendation(areaSqFt, roomType) {
  const lux = ROOM_LUX[roomType]
  if (!(areaSqFt > 0) || !lux) return null
  const lumens = Math.round(((areaSqFt / SQFT_PER_SQM) * lux) / 50) * 50
  const idealFixtures = Math.min(6, Math.max(1, Math.ceil(areaSqFt / 80)))

  const candidates = lightingCatalog()
    .map((item) => ({ ...item, count: Math.max(idealFixtures, Math.ceil(lumens / item.lumens)) }))
    .filter((item) => item.count <= idealFixtures + 1)
    .map((item) => ({ ...item, excess: item.count * item.lumens - lumens }))
    .sort((a, b) => a.excess - b.excess || a.count - b.count)

  // One suggestion per category first (a bulb option and a batten option), then the rest.
  const picked = []
  for (const slug of ['led-bulbs', 'led-battens']) {
    const best = candidates.find((c) => c.category.category === slug)
    if (best) picked.push(best)
  }
  for (const c of candidates) {
    if (picked.length >= 3) break
    if (!picked.includes(c)) picked.push(c)
  }
  return {
    lux,
    lumens,
    options: picked.sort((a, b) => a.excess - b.excess).map(({ excess: _excess, ...rest }) => rest),
  }
}

// ── Geysers ──────────────────────────────────────────────────────────────────
/** Litres stated in a geyser's specs ("5 Litres Capacity") or model name ("Rapid Jet 3L"), or null. */
export function statedLitres(model) {
  for (const spec of model.specs ?? []) {
    const match = spec.match(/(\d+(?:\.\d+)?)\s*Litres?/i)
    if (match) return Number(match[1])
  }
  const fromName = model.modelName.match(/(\d+(?:\.\d+)?)\s*L\b/i)
  return fromName ? Number(fromName[1]) : null
}

/**
 * @param {'kitchen'|'bath'} use
 * @returns {{ type: 'instant'|'storage', min: number, max: number, matches: Array<{ category, brand, model, litres: number }> } | null}
 */
export function geyserRecommendation(use, people) {
  const n = Number(people)
  if (!(n > 0) || !['kitchen', 'bath'].includes(use)) return null
  let need
  if (use === 'kitchen') need = { type: 'instant', min: 1, max: 3 }
  else if (n <= 3) need = { type: 'instant', min: 5, max: 6 }
  else if (n <= 5) need = { type: 'storage', min: 15, max: 25 }
  else need = { type: 'storage', min: 25, max: 35 }

  const geysers = categories.find((c) => c.category === 'geysers')
  const matches = []
  for (const brand of geysers?.brands ?? []) {
    for (const model of brand.models ?? []) {
      const litres = statedLitres(model)
      if (litres && litres >= need.min && litres <= need.max + 0.5) matches.push({ category: geysers, brand, model, litres })
    }
  }
  return { ...need, matches }
}
