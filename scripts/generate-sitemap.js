/**
 * generate-sitemap.js
 * Generates public/sitemap.xml at build time from the live product catalog.
 * Run: node scripts/generate-sitemap.js
 * Or:  npm run sitemap
 */

import fs from 'node:fs'
import path from 'node:path'
import { categories } from '../src/data/products.js'
import { shop } from '../src/data/site.js'

const BASE_URL = shop.siteUrl.replace(/\/$/, '') // strip trailing slash

/**
 * Slugify a model name to match the URL pattern used by the router.
 * Mirrors the logic in products.js getModelBySlug().
 */
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** ISO-8601 date string for today (YYYY-MM-DD). */
const today = new Date().toISOString().slice(0, 10)

const urls = []

// 1. Static pages
urls.push({ loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' })
urls.push({ loc: `${BASE_URL}/catalog`, priority: '0.9', changefreq: 'weekly' })
urls.push({ loc: `${BASE_URL}/contact`, priority: '0.7', changefreq: 'monthly' })

// 2. Category pages
for (const cat of categories) {
  if (cat.comingSoon) continue // skip unlaunched categories

  urls.push({
    loc: `${BASE_URL}/catalog/${cat.category}`,
    priority: '0.8',
    changefreq: 'weekly',
  })

  // 3. Individual model pages (deep-link query format: ?model=slug)
  for (const brand of cat.brands ?? []) {
    for (const model of brand.models ?? []) {
      const modelSlug = slugify(model.modelName)
      urls.push({
        loc: `${BASE_URL}/catalog/${cat.category}?model=${modelSlug}`,
        priority: '0.6',
        changefreq: 'monthly',
      })
    }
  }
}

// Build XML
const urlElements = urls
  .map(
    ({ loc, priority, changefreq }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlElements}
</urlset>
`

const outPath = path.resolve('public/sitemap.xml')
fs.writeFileSync(outPath, xml, 'utf8')

console.log(`✓ Sitemap written to public/sitemap.xml  (${urls.length} URLs)`)
urls.forEach((u) => console.log(`  ${u.loc}`))
