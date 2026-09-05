import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { categories } from '../src/data/products.js'
import { shop } from '../src/data/site.js'

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 1. Render default og-image.png from public/og-image.svg
const svgPath = path.resolve('public/og-image.svg')
const pngPath = path.resolve('public/og-image.png')

if (fs.existsSync(svgPath)) {
  const svg = fs.readFileSync(svgPath, 'utf8')
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
  const pngBuffer = resvg.render().asPng()
  fs.writeFileSync(pngPath, pngBuffer)
  console.log(`✓ Generated public/og-image.png (${pngBuffer.length} bytes)`)
}

// 2. Render per-category OG images into public/og/
const ogDir = path.resolve('public/og')
if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true })
}

const ogProductsDir = path.resolve('public/og/products')
if (!fs.existsSync(ogProductsDir)) {
  fs.mkdirSync(ogProductsDir, { recursive: true })
}

function buildCategorySvg(category) {
  const brandsList = (category.brands || [])
    .map((b) => b.brand)
    .filter(Boolean)
    .slice(0, 4)
    .join('  ·  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#1C1917"/>

  <!-- Border -->
  <rect x="30" y="30" width="1140" height="570" rx="20" stroke="#44403C" stroke-width="1.5" fill="none"/>

  <!-- Top Pills -->
  <rect x="80" y="80" width="220" height="42" rx="8" fill="#D97706"/>
  <text x="100" y="106" fill="#FFFFFF" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="1">MALKAPUR · JBE</text>

  <!-- Category Badge -->
  <rect x="316" y="80" width="190" height="42" rx="8" fill="#292524" stroke="#57534E" stroke-width="1.5"/>
  <text x="336" y="106" fill="#E7E5E4" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="1">PRODUCT CATALOG</text>

  <!-- Main Headline -->
  <text x="80" y="220" fill="#FAF7F2" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" letter-spacing="-1">
    ${escapeXml(category.categoryLabel)}
  </text>

  <!-- Tagline / Subtitle -->
  <text x="80" y="280" fill="#D97706" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="28" font-weight="600">
    Wholesale &amp; Retail Pricing · Jai Baba Electronic
  </text>

  <!-- Brands bar -->
  ${
    brandsList
      ? `<rect x="80" y="340" width="800" height="64" rx="12" fill="#292524" stroke="#44403C" stroke-width="1"/>
  <text x="110" y="380" fill="#FBBF24" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="20" font-weight="700">
    BRANDS: <tspan fill="#E7E5E4" font-weight="500">${escapeXml(brandsList)}</tspan>
  </text>`
      : ''
  }

  <!-- Footer Info -->
  <line x1="80" y1="460" x2="1120" y2="460" stroke="#44403C" stroke-width="1"/>
  <text x="80" y="520" fill="#D6D3D1" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="20" font-weight="600">
    Buldana Road, Malkapur, Maharashtra · Call/WhatsApp: +91 ${shop.primaryPhone}
  </text>
  <text x="80" y="555" fill="#A8A29E" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="16" font-weight="500">
    Direct WhatsApp Quotation · Genuine Warranty Backed Stock
  </text>
</svg>`
}

function buildProductSvg(category, brand, model) {
  const modelName = escapeXml(model.modelName)
  const brandName = escapeXml(brand.brand || '')
  const categoryLabel = escapeXml(category.categoryLabel)
  const warranty = escapeXml(brand.warranty || 'Genuine Manufacturer Warranty')
  const tagline = escapeXml(brand.tagline || 'Wholesale & Retail in Malkapur')
  const specs = (model.specs || []).slice(0, 3)

  const specsListSvg = specs
    .map((s, idx) => {
      const y = 350 + idx * 38
      return `
        <circle cx="105" cy="${y - 6}" r="5" fill="#D97706" />
        <text x="125" y="${y}" fill="#E7E5E4" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="19" font-weight="500">
          ${escapeXml(s.length > 75 ? s.slice(0, 72) + '...' : s)}
        </text>
      `
    })
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#1C1917"/>

  <!-- Border -->
  <rect x="30" y="30" width="1140" height="570" rx="20" stroke="#44403C" stroke-width="1.5" fill="none"/>

  <!-- Top Badges -->
  <rect x="80" y="70" width="220" height="38" rx="8" fill="#D97706"/>
  <text x="100" y="94" fill="#FFFFFF" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" letter-spacing="1">MALKAPUR · JBE</text>

  <rect x="312" y="70" width="170" height="38" rx="8" fill="#292524" stroke="#57534E" stroke-width="1.5"/>
  <text x="330" y="94" fill="#FDE68A" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="1">${brandName.toUpperCase()}</text>

  <rect x="494" y="70" width="240" height="38" rx="8" fill="#292524" stroke="#44403C" stroke-width="1.5"/>
  <text x="512" y="94" fill="#A8A29E" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" letter-spacing="1">${categoryLabel.toUpperCase()}</text>

  <!-- Product Title -->
  <text x="80" y="175" fill="#FAF7F2" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="50" font-weight="900" letter-spacing="-1">
    ${modelName}
  </text>

  <!-- Brand & Subtitle -->
  <text x="80" y="225" fill="#E7E5E4" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="24" font-weight="600">
    ${brandName ? `${brandName} · ` : ''}${tagline}
  </text>

  <!-- Warranty Pill -->
  <rect x="80" y="248" width="380" height="34" rx="8" fill="#14532D" stroke="#22C55E" stroke-width="1"/>
  <text x="96" y="271" fill="#86EFAC" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="14" font-weight="700">
    ${warranty}
  </text>

  <!-- Key Specifications Box -->
  <rect x="80" y="300" width="1040" height="155" rx="12" fill="#292524" stroke="#44403C" stroke-width="1"/>
  <text x="105" y="332" fill="#FBBF24" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" letter-spacing="1">KEY SPECIFICATIONS</text>
  ${specsListSvg}

  <!-- Footer Info -->
  <line x1="80" y1="485" x2="1120" y2="485" stroke="#44403C" stroke-width="1"/>
  <text x="80" y="530" fill="#D6D3D1" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="20" font-weight="600">
    Buldana Road, Malkapur, Maharashtra · Call/WhatsApp: +91 ${shop.primaryPhone}
  </text>
  <text x="80" y="562" fill="#A8A29E" font-family="'Inter', system-ui, -apple-system, sans-serif" font-size="15" font-weight="500">
    Direct WhatsApp Quotation · Best Wholesale &amp; Retail Pricing
  </text>
</svg>`
}

// Generate category OG images
for (const cat of categories) {
  const catSvg = buildCategorySvg(cat)
  const resvg = new Resvg(catSvg, { fitTo: { mode: 'width', value: 1200 } })
  const pngBuffer = resvg.render().asPng()
  const outPath = path.join(ogDir, `${cat.category}.png`)
  fs.writeFileSync(outPath, pngBuffer)
}
console.log(`✓ Generated ${categories.length} category OG images in public/og/`)

// Generate per-product OG images
let productCardCount = 0
for (const cat of categories) {
  for (const brand of cat.brands || []) {
    for (const model of brand.models || []) {
      const modelSlug = slugify(model.modelName)
      const pSvg = buildProductSvg(cat, brand, model)
      const resvg = new Resvg(pSvg, { fitTo: { mode: 'width', value: 1200 } })
      const pngBuffer = resvg.render().asPng()
      const outPath = path.join(ogProductsDir, `${cat.category}-${modelSlug}.png`)
      fs.writeFileSync(outPath, pngBuffer)
      productCardCount++
    }
  }
}
console.log(`✓ Generated ${productCardCount} product OG images in public/og/products/`)
