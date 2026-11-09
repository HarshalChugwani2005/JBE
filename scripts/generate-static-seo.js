/**
 * Writes dist/<route>/index.html copies of the built page with route-specific
 * <title>, description, Open Graph / Twitter tags, canonical URL and JSON-LD,
 * so crawlers and link previews that don't run JavaScript still see correct metadata.
 *
 * Metadata comes from the same builders the runtime <SEO> component uses
 * (src/i18n/seo.js), in English, so pre-rendered and client-side tags match.
 */
import fs from 'node:fs'
import path from 'node:path'
import { categories } from '../src/data/products.js'
import { shop } from '../src/data/site.js'
import { translate } from '../src/i18n/format.js'
import { buildBreadcrumbJsonLd, buildCategorySeo, buildModelSeo, buildProductJsonLd } from '../src/i18n/seo.js'
import { slugify } from '../src/utils/slugify.js'

const LANG = 'en'
const DIST_PATH = path.resolve('dist')
const templatePath = path.join(DIST_PATH, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/** JSON safe to embed inside a <script> element. */
function scriptJson(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

function setMeta(html, selector, content) {
  const escapedContent = escapeHtml(content)
  return html.replace(selector, (match, prefix, suffix) => `${prefix}${escapedContent}${suffix}`)
}

function absolute(urlPath) {
  return urlPath.startsWith('http') ? urlPath : `${shop.siteUrl}${urlPath}`
}

function renderPage(template, { title, description, image = '/og-image.png', route, jsonLd }) {
  const fullTitle = `${title} | ${shop.name}`
  const imageUrl = absolute(image)
  const pageUrl = `${shop.siteUrl}${route}`
  let html = template

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
  html = setMeta(html, /(<meta name="description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, fullTitle)
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta property="og:image" content=")[^"]*(")/, imageUrl)
  html = setMeta(html, /(<meta property="og:image:secure_url" content=")[^"]*(")/, imageUrl)
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, pageUrl)
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*(")/, fullTitle)
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta name="twitter:image" content=")[^"]*(")/, imageUrl)
  html = setMeta(html, /(<meta name="twitter:url" content=")[^"]*(")/, pageUrl)
  html = html.replace(/(<link rel="canonical" href=")[^"]*/, `$1${escapeHtml(pageUrl)}`)

  if (jsonLd) {
    // Same id the runtime <SEO> component uses, so it replaces this tag after hydration.
    html = html.replace(
      '</head>',
      `  <script type="application/ld+json" id="page-jsonld">${scriptJson(jsonLd)}</script>\n  </head>`,
    )
  }

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

// Top-level pages listed in the sitemap.
writeRoute(template, '/catalog', {
  title: translate(LANG, 'catalogTitle'),
  description: translate(LANG, 'seoCatalogDescription'),
})
writeRoute(template, '/contact', {
  title: translate(LANG, 'contactTitle'),
  description: translate(LANG, 'seoContactDescription'),
})
generated += 2

for (const category of categories) {
  if (category.comingSoon) continue

  const categoryRoute = `/catalog/${category.category}`
  const breadcrumb = buildBreadcrumbJsonLd(shop.siteUrl, [
    { name: translate(LANG, 'navHome'), path: '/' },
    { name: translate(LANG, 'navCatalog'), path: '/catalog' },
    { name: category.categoryLabel, path: categoryRoute },
  ])

  writeRoute(template, categoryRoute, { ...buildCategorySeo(LANG, category), jsonLd: breadcrumb })
  generated += 1

  for (const brand of category.brands ?? []) {
    for (const model of brand.models ?? []) {
      const meta = buildModelSeo(LANG, category, brand.brand, model)
      const product = buildProductJsonLd(shop.siteUrl, {
        category,
        brandName: brand.brand,
        model,
        imageUrl: absolute(meta.image),
      })
      writeRoute(template, `${categoryRoute}/${slugify(model.modelName)}`, { ...meta, jsonLd: [breadcrumb, product] })
      generated += 1
    }
  }
}

console.log(`Generated static SEO pages for ${generated} routes.`)
