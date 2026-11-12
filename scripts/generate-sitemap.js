/**
 * generate-sitemap.js
 * Generates public/sitemap.xml at build time from the live product catalog.
 * Every page is listed in English, Marathi and Hindi, each with <xhtml:link hreflang>
 * alternates so search engines connect the language versions of the same page.
 * Run: node scripts/generate-sitemap.js  (or npm run sitemap)
 */

import fs from 'node:fs'
import path from 'node:path'
import { categories } from '../src/data/products.js'
import { seasons } from '../src/data/seasons.js'
import { shop } from '../src/data/site.js'
import { withLang } from '../src/i18n/paths.js'
import { SUPPORTED_LANGS } from '../src/i18n/registry.js'
import { buildAlternates } from '../src/i18n/seo.js'
import { slugify } from '../src/utils/slugify.js'

const BASE_URL = shop.siteUrl.replace(/\/$/, '') // strip trailing slash

/** ISO-8601 date string for today (YYYY-MM-DD). */
const today = new Date().toISOString().slice(0, 10)

// Language-neutral routes with their priority / change frequency.
const routes = [
  { route: '/', priority: '1.0', changefreq: 'weekly' },
  { route: '/catalog', priority: '0.9', changefreq: 'weekly' },
  { route: '/contact', priority: '0.7', changefreq: 'monthly' },
  { route: '/guide', priority: '0.7', changefreq: 'monthly' },
  { route: '/faq', priority: '0.6', changefreq: 'monthly' },
  { route: '/about', priority: '0.6', changefreq: 'monthly' },
  ...seasons.map((season) => ({ route: `/season/${season.slug}`, priority: '0.7', changefreq: 'monthly' })),
]
for (const cat of categories) {
  if (cat.comingSoon) continue // skip unlaunched categories
  routes.push({ route: `/catalog/${cat.category}`, priority: '0.8', changefreq: 'weekly' })
  for (const brand of cat.brands ?? []) {
    for (const model of brand.models ?? []) {
      routes.push({ route: `/catalog/${cat.category}/${slugify(model.modelName)}`, priority: '0.6', changefreq: 'monthly' })
    }
  }
}

const urlElements = routes
  .flatMap(({ route, priority, changefreq }) =>
    SUPPORTED_LANGS.map((lang) => {
      const alternates = buildAlternates(BASE_URL, route)
        .map(({ hreflang, href }) => `\n    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
        .join('')
      return `
  <url>
    <loc>${BASE_URL}${withLang(lang, route)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alternates}
  </url>`
    }),
  )
  .join('')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>
`

const outPath = path.resolve('public/sitemap.xml')
fs.writeFileSync(outPath, xml, 'utf8')

console.log(`✓ Sitemap written to public/sitemap.xml  (${routes.length} pages × ${SUPPORTED_LANGS.length} languages = ${routes.length * SUPPORTED_LANGS.length} URLs)`)
