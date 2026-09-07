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
import { slugify } from '../src/utils/slugify.js'

const SHEET_URL = process.env.CATALOG_SHEET_URL || ''
const PRODUCTS_JS_PATH = path.resolve('src/data/products.js')
const BACKUP_PATH = path.resolve('src/data/products.backup.js')

function parseCsv(csvText) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < csvText.length; index += 1) {
    const character = csvText[index]
    const nextCharacter = csvText[index + 1]

    if (character === '"' && quoted && nextCharacter === '"') {
      cell += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      row.push(cell.trim())
      cell = ''
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1
      row.push(cell.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += character
    }
  }

  if (cell || row.length) {
    row.push(cell.trim())
    if (row.some(Boolean)) rows.push(row)
  }

  return rows
}

function validateCatalog(categories) {
  const errors = []
  const categorySlugs = new Set()
  const allowedPriceTiers = new Set(['budget', 'mid', 'premium', null])

  for (const category of categories) {
    if (!category.category || !category.categoryLabel) {
      errors.push('Every category requires category and categoryLabel.')
    }
    if (categorySlugs.has(category.category)) {
      errors.push(`Duplicate category slug: ${category.category}`)
    }
    categorySlugs.add(category.category)

    const modelSlugs = new Set()
    for (const brand of category.brands ?? []) {
      if (!brand.brand) errors.push(`Category ${category.category} has a brand without a name.`)

      for (const model of brand.models ?? []) {
        const modelSlug = slugify(model.modelName)
        if (!model.modelName || !modelSlug) {
          errors.push(`Category ${category.category} has a model without a valid name.`)
        }
        if (modelSlugs.has(modelSlug)) {
          errors.push(`Duplicate model slug in ${category.category}: ${modelSlug}`)
        }
        modelSlugs.add(modelSlug)
        if (!Array.isArray(model.specs) || !Array.isArray(model.colors)) {
          errors.push(`Invalid specs/colors for ${category.category}/${model.modelName}.`)
        }
        if (typeof model.inStock !== 'boolean') {
          errors.push(`Invalid inStock value for ${category.category}/${model.modelName}.`)
        }
        if (!allowedPriceTiers.has(model.priceTier)) {
          errors.push(`Invalid priceTier for ${category.category}/${model.modelName}.`)
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Catalog validation failed:\n- ${errors.join('\n- ')}`)
  }
}

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

    const lines = parseCsv(await res.text())

    if (lines.length <= 1) {
      console.warn('⚠️ Fetched sheet is empty or only contains headers. Aborting.')
      return
    }

    const headers = lines[0].map((header) => header.trim().toLowerCase())
    const rows = lines.slice(1)

    const getCell = (row, name, fallback = '') => {
      const index = headers.indexOf(name)
      return index === -1 ? fallback : row[index]?.trim() || fallback
    }

    const categoriesMap = new Map()

    for (const row of rows) {
      const categorySlug = getCell(row, 'category')
      if (!categorySlug) continue
      const categoryLabel = getCell(row, 'categorylabel', categorySlug)
      const brandName = getCell(row, 'brand', 'Generic')
      const tagline = getCell(row, 'tagline')
      const warranty = getCell(row, 'warranty')
      const modelName = getCell(row, 'modelname', 'Standard')
      const specs = getCell(row, 'specs').split(';').map((s) => s.trim()).filter(Boolean)
      const colors = getCell(row, 'colors').split(';').map((c) => c.trim()).filter(Boolean)
      const image = getCell(row, 'image') || null
      const priceTier = getCell(row, 'pricetier') || null
      const inStockValue = getCell(row, 'instock')
      const inStock = inStockValue ? ['true', '1', 'yes'].includes(inStockValue.toLowerCase()) : true

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
        images: image ? [image] : [],
        inStock,
        priceTier,
      })
    }

    const structuredCategories = Array.from(categoriesMap.values()).map((cat) => ({
      category: cat.category,
      categoryLabel: cat.categoryLabel,
      comingSoon: cat.comingSoon,
      brands: Array.from(cat.brands.values()),
    }))

    validateCatalog(structuredCategories)

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
      const slug = model.modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
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
