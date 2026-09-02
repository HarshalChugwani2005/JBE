import fs from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import { categories } from '../src/data/products.js'
import { shop } from '../src/data/site.js'

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

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildCategorySvg(category) {
  const brandsList = (category.brands || [])
    .map((b) => b.brand)
    .filter(Boolean)
    .slice(0, 4)
    .join('  ·  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="#0C0A09"/>
  <defs>
    <radialGradient id="glow1" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#D97706" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#0C0A09" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="85%" cy="70%" r="55%">
      <stop offset="0%" stop-color="#EA580C" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0C0A09" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7"/>
      <stop offset="50%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <!-- Border -->
  <rect x="30" y="30" width="1140" height="570" rx="24" stroke="#44403C" stroke-width="1.5" fill="none" opacity="0.6"/>

  <!-- Top Pills -->
  <rect x="80" y="80" width="220" height="42" rx="21" fill="#78350F" fill-opacity="0.4" stroke="#D97706" stroke-width="1.5"/>
  <circle cx="102" cy="101" r="6" fill="#10B981"/>
  <text x="118" y="107" fill="#FDE68A" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" letter-spacing="1">MALKAPUR · JBE</text>

  <!-- Category Badge -->
  <rect x="316" y="80" width="180" height="42" rx="21" fill="#292524" stroke="#57534E" stroke-width="1.5"/>
  <text x="336" y="107" fill="#E7E5E4" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="700" letter-spacing="1">PRODUCT CATALOG</text>

  <!-- Main Headline -->
  <text x="80" y="220" fill="url(#textGrad)" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="900" letter-spacing="-1">
    ${escapeXml(category.categoryLabel)}
  </text>

  <!-- Tagline / Subtitle -->
  <text x="80" y="280" fill="#E7E5E4" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600">
    Wholesale &amp; Retail Pricing · Jai Baba Electronic
  </text>

  <!-- Brands bar -->
  ${
    brandsList
      ? `<rect x="80" y="340" width="800" height="64" rx="18" fill="#1C1917" stroke="#44403C" stroke-width="1"/>
  <text x="110" y="380" fill="#FBBF24" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700">
    BRANDS: <tspan fill="#E7E5E4" font-weight="500">${escapeXml(brandsList)}</tspan>
  </text>`
      : ''
  }

  <!-- Footer Info -->
  <line x1="80" y1="460" x2="1120" y2="460" stroke="#292524" stroke-width="1"/>
  <text x="80" y="520" fill="#D6D3D1" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600">
    📍 Buldana Road, Malkapur, Maharashtra · 📞 +91 ${shop.primaryPhone}
  </text>
  <text x="80" y="555" fill="#A8A29E" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500">
    Direct WhatsApp Quotation · Genuine Warranty Backed Stock
  </text>
</svg>`
}

for (const cat of categories) {
  const catSvg = buildCategorySvg(cat)
  const resvg = new Resvg(catSvg, { fitTo: { mode: 'width', value: 1200 } })
  const pngBuffer = resvg.render().asPng()
  const outPath = path.join(ogDir, `${cat.category}.png`)
  fs.writeFileSync(outPath, pngBuffer)
}

console.log(`✓ Generated ${categories.length} category OG images in public/og/`)
