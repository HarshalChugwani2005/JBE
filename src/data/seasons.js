/**
 * Seasonal collections. Each season page lists these categories; the Home page highlights the
 * season that is current in Malkapur (months are evaluated in Asia/Kolkata).
 * Titles and intro text live in the locale files (seasonSummer / seasonSummerText, …).
 */
import { categories } from './products.js'

export const seasons = [
  { slug: 'summer', months: [3, 4, 5, 6], categories: ['coolers', 'ceiling-fans', 'table-fans'] },
  { slug: 'monsoon', months: [7, 8, 9], categories: ['torches', 'led-bulbs', 'led-battens', '12v-batteries'] },
  { slug: 'winter', months: [10, 11, 12, 1, 2], categories: ['geysers', 'immersion-rods'] },
]

/** Translation key suffix: 'summer' → 'Summer' (seasonSummer, seasonSummerText). */
export const seasonKey = (slug) => slug.charAt(0).toUpperCase() + slug.slice(1)

export function getSeason(slug) {
  return seasons.find((s) => s.slug === slug) ?? null
}

/** The season's categories that exist in the catalog, in the season's order. */
export function seasonCategories(season) {
  return season.categories.map((slug) => categories.find((c) => c.category === slug)).filter(Boolean)
}

/** Season for a date, using the month in India (Asia/Kolkata). */
export function currentSeason(date = new Date()) {
  const month = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', month: 'numeric' }).format(date))
  return seasons.find((s) => s.months.includes(month)) ?? seasons[0]
}
