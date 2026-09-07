import fs from 'node:fs'
import path from 'node:path'
import { categories } from '../src/data/products.js'
import { shop } from '../src/data/site.js'
import { slugify } from '../src/utils/slugify.js'

const DIST_PATH = path.resolve('dist')
const templatePath = path.join(DIST_PATH, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function setMeta(html, selector, content) {
  const escapedContent = escapeHtml(content)
  return html.replace(selector, (match, prefix, suffix) => `${prefix}${escapedContent}${suffix}`)
}

function renderPage(template, { title, description, image, route }) {
  const fullTitle = `${title} | ${shop.name}`
  const imageUrl = image.startsWith('http') ? image : `${shop.siteUrl}${image}`
  const pageUrl = `${shop.siteUrl}${route}`
  let html = template

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
  html = setMeta(html, /(<meta name="description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, fullTitle)
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta property="og:image" content=")[^"]*(")/, imageUrl)
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, pageUrl)
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*(")/, fullTitle)
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta name="twitter:image" content=")[^"]*(")/, imageUrl)
  html = html.replace(
    /(<link rel="canonical" href=")[^"]*/,
    `$1${escapeHtml(pageUrl)}`,
  )

  return html
}

function writeRoute(template, route, metadata) {
  const outputDirectory = path.join(DIST_PATH, route.replace(/^\//, ''))
  fs.mkdirSync(outputDirectory, { recursive: true })
  fs.writeFileSync(path.join(outputDirectory, 'index.html'), renderPage(template, { ...metadata, route }), 'utf8')
}

if (!fs.existsSync(templatePath)) {
  throw new Error('dist/index.html was not found. Run vite build before generating static SEO pages.')
}

const template = fs.readFileSync(templatePath, 'utf8')
let generated = 0

for (const category of categories) {
  if (category.comingSoon) continue

  const categoryRoute = `/catalog/${category.category}`
  writeRoute(template, categoryRoute, {
    title: category.categoryLabel,
    description: `Browse ${category.categoryLabel} products at Jai Baba Electronic Malkapur. Wholesale and retail pricing on enquiry.`,
    image: `/og/${category.category}.png`,
  })
  generated += 1

  for (const brand of category.brands ?? []) {
    for (const model of brand.models ?? []) {
      const modelSlug = slugify(model.modelName)
      const route = `${categoryRoute}/${modelSlug}`
      const brandName = brand.brand ? `${brand.brand} ` : ''
      writeRoute(template, route, {
        title: `${brandName}${model.modelName} | ${category.categoryLabel}`,
        description: `${brandName}${model.modelName} (${category.categoryLabel}). ${model.specs?.slice(0, 3).join(', ') || ''}. Genuine wholesale and retail pricing on enquiry at Jai Baba Electronic Malkapur.`,
        image: `/og/products/${category.category}-${modelSlug}.png`,
      })
      generated += 1
    }
  }
}

console.log(`Generated static SEO pages for ${generated} catalog routes.`)
