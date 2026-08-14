/**
 * Google Sheets / Remote Catalog Sync Script
 * 
 * Usage:
 *   node scripts/sync-catalog.js
 * 
 * Set CATALOG_SHEET_URL in your environment or below to sync directly from a published Google Sheet CSV / opensheet endpoint.
 * Format expected in Google Sheet:
 * Category | CategoryLabel | Brand | Tagline | Warranty | ModelName | Specs (comma separated) | Colors (comma separated) | Image | InStock (TRUE/FALSE)
 */

import fs from 'node:fs'
import path from 'node:path'

const SHEET_URL = process.env.CATALOG_SHEET_URL || ''
const PRODUCTS_JS_PATH = path.resolve('src/data/products.js')
const BACKUP_PATH = path.resolve('src/data/products.backup.js')

async function syncCatalog() {
  console.log('🔄 Checking for remote catalog updates...')

  if (!SHEET_URL) {
    console.log('ℹ️ No CATALOG_SHEET_URL provided. Keeping existing static catalog in src/data/products.js.')
    console.log('💡 To enable Google Sheets sync, publish your sheet to CSV and set CATALOG_SHEET_URL=<published_csv_url>')
    return
  }

  try {
    const res = await fetch(SHEET_URL)
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }

    const csvText = await res.text()
    const lines = csvText.trim().split('\n').map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')))
    
    if (lines.length <= 1) {
      console.warn('⚠️ Fetched sheet is empty or only contains headers. Aborting.')
      return
    }

    const _headers = lines[0].map((h) => h.toLowerCase())
    const rows = lines.slice(1)

    const categoriesMap = new Map()

    for (const row of rows) {
      if (!row[0]) continue
      const categorySlug = row[0]
      const categoryLabel = row[1] || categorySlug
      const brandName = row[2] || 'Generic'
      const tagline = row[3] || ''
      const warranty = row[4] || ''
      const modelName = row[5] || 'Standard'
      const specs = row[6] ? row[6].split(';').map((s) => s.trim()).filter(Boolean) : []
      const colors = row[7] ? row[7].split(';').map((c) => c.trim()).filter(Boolean) : []
      const image = row[8] || null
      const inStock = row[9] ? row[9].toLowerCase() === 'true' || row[9] === '1' : true

      if (!categoriesMap.has(categorySlug)) {
        categoriesMap.set(categorySlug, {
          category: categorySlug,
          categoryLabel,
          comingSoon: false,
          brands: new Map(),
        })
      }

      const catObj = categoriesMap.get(categorySlug)
      if (!catObj.brands.has(brandName)) {
        catObj.brands.set(brandName, {
          brand: brandName,
          tagline,
          warranty,
          models: [],
        })
      }

      const brandObj = catObj.brands.get(brandName)
      brandObj.models.push({
        modelName,
        specs,
        colors,
        image,
        inStock,
      })
    }

    const structuredCategories = Array.from(categoriesMap.values()).map((cat) => ({
      category: cat.category,
      categoryLabel: cat.categoryLabel,
      comingSoon: cat.comingSoon,
      brands: Array.from(cat.brands.values()),
    }))

    // Backup previous file
    if (fs.existsSync(PRODUCTS_JS_PATH)) {
      fs.copyFileSync(PRODUCTS_JS_PATH, BACKUP_PATH)
    }

    const fileContent = `/**
 * Product catalog data — auto-synced from Google Sheets.
 * Backup stored at products.backup.js
 */

export const categories = ${JSON.stringify(structuredCategories, null, 2)}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.category === slug)
}

export function getModelBySlug(categorySlug, modelSlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return null

  for (const brand of category.brands) {
    for (const model of brand.models) {
      const slug = model.modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (slug === modelSlug) {
        return { brand, model }
      }
    }
  }

  return null
}
`

    fs.writeFileSync(PRODUCTS_JS_PATH, fileContent, 'utf8')
    console.log(`✅ Successfully synced ${structuredCategories.length} categories from Google Sheets!`)
  } catch (err) {
    console.error('❌ Error syncing catalog from Google Sheets:', err.message)
    console.log('🛡️ Retaining local src/data/products.js as fallback.')
  }
}

syncCatalog()
