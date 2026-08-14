/**
 * WhatsApp Business / Meta Commerce Catalog Exporter
 * 
 * Usage:
 *   node scripts/export-wa-catalog.js
 * 
 * Exports catalog to `public/whatsapp-catalog.csv` and `dist/whatsapp-catalog.csv`
 * for instant import into WhatsApp Business / Facebook Commerce Manager.
 */

import fs from 'node:fs'
import path from 'node:path'
import { categories } from '../src/data/products.js'
import { shop } from '../src/data/site.js'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function generateCatalogCsv() {
  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'brand',
    'google_product_category',
    'custom_label_0',
  ]

  const rows = []

  for (const cat of categories) {
    if (cat.comingSoon) continue

    for (const brand of cat.brands) {
      for (const model of brand.models) {
        const id = `${cat.category}_${slugify(brand.brand)}_${slugify(model.modelName)}`
        const title = `${brand.brand} ${model.modelName} - ${cat.categoryLabel}`
        const description = `${model.specs.join('. ')}${model.colors?.length ? ` | Colors: ${model.colors.join(', ')}` : ''} | Genuine wholesale & retail from Jai Baba Electronic Malkapur.`
        const availability = model.inStock ? 'in stock' : 'out of stock'
        const condition = 'new'
        const price = '0.00 INR' // Quotation on WhatsApp
        const link = `${shop.siteUrl}/catalog/${cat.category}/${slugify(model.modelName)}`
        const imageLink = model.image
          ? `${shop.siteUrl}/assets/images/${cat.category}/${model.image}`
          : `${shop.siteUrl}/og-image.png`
        const brandName = brand.brand
        const googleCategory = 'Home & Garden > Household Appliances'
        const customLabel = cat.categoryLabel

        rows.push([
          `"${id}"`,
          `"${title.replace(/"/g, '""')}"`,
          `"${description.replace(/"/g, '""')}"`,
          `"${availability}"`,
          `"${condition}"`,
          `"${price}"`,
          `"${link}"`,
          `"${imageLink}"`,
          `"${brandName}"`,
          `"${googleCategory}"`,
          `"${customLabel}"`,
        ])
      }
    }
  }

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  const publicOut = path.resolve('public/whatsapp-catalog.csv')
  fs.writeFileSync(publicOut, csvContent, 'utf8')
  console.log(`✅ Generated WhatsApp Business catalog with ${rows.length} products at public/whatsapp-catalog.csv`)
}

generateCatalogCsv()
