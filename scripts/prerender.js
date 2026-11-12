/**
 * Pre-renders every page, in every language, to static HTML (runs after both Vite builds).
 *
 * For each route it renders the React app with the server bundle (dist-ssr/entry-server.js),
 * puts the markup inside <div id="root">, and sets that page's <html lang>, title, description,
 * Open Graph / Twitter tags, canonical URL, hreflang alternates and JSON-LD. Visitors (and
 * crawlers) get real content before any JavaScript runs; the browser then hydrates it.
 *
 *   dist/index.html, dist/catalog/…/index.html        English
 *   dist/mr/index.html, dist/mr/catalog/…/index.html  Marathi
 *   dist/hi/…                                         Hindi
 *   dist/spa.html  empty app shell — fallback for unknown URLs (vercel.json) and offline (service worker)
 */
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { categories } from '../src/data/products.js'
import { localizedFaq } from '../src/data/faq.js'
import { seasonCategories, seasonKey, seasons } from '../src/data/seasons.js'
import { shop } from '../src/data/site.js'
import '../src/i18n/allLocales.js'
import { translate, translateCategory } from '../src/i18n/format.js'
import { withLang } from '../src/i18n/paths.js'
import { SUPPORTED_LANGS } from '../src/i18n/registry.js'
import {
  buildAlternates,
  buildBreadcrumbJsonLd,
  buildCategorySeo,
  buildAboutJsonLd,
  buildFaqJsonLd,
  buildModelSeo,
  buildProductJsonLd,
} from '../src/i18n/seo.js'
import { slugify } from '../src/utils/slugify.js'

const DIST = path.resolve('dist')
const SSR_ENTRY = path.resolve('dist-ssr/entry-server.js')
const OG_LOCALES = { en: 'en_IN', mr: 'mr_IN', hi: 'hi_IN' }

if (!fs.existsSync(path.join(DIST, 'index.html')) || !fs.existsSync(SSR_ENTRY)) {
  throw new Error('Run `vite build` and `vite build --ssr src/entry-server.jsx --outDir dist-ssr` before pre-rendering.')
}

const { render } = await import(pathToFileURL(SSR_ENTRY).href)
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root to fill.')

// The untouched shell, for URLs that have no pre-rendered page.
fs.writeFileSync(path.join(DIST, 'spa.html'), template, 'utf8')

const escapeHtml = (value) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const scriptJson = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')
const absolute = (urlPath) => (urlPath.startsWith('http') ? urlPath : `${shop.siteUrl}${urlPath}`)

function setMeta(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Template is missing ${pattern}`)
  return html.replace(pattern, (match, before, after) => `${before}${escapeHtml(value)}${after}`)
}

function renderPage({ lang, route, title, description, image = '/og-image.png', jsonLd }) {
  const url = withLang(lang, route)
  const pageUrl = `${shop.siteUrl}${url}`
  const imageUrl = absolute(image)
  let html = template

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  html = setMeta(html, /(<meta name="description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*(")/, pageUrl)
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, pageUrl)
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, title)
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta property="og:image" content=")[^"]*(")/, imageUrl)
  html = setMeta(html, /(<meta property="og:image:secure_url" content=")[^"]*(")/, imageUrl)
  html = setMeta(html, /(<meta property="og:locale" content=")[^"]*(")/, OG_LOCALES[lang])
  html = setMeta(html, /(<meta name="twitter:url" content=")[^"]*(")/, pageUrl)
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*(")/, title)
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*(")/, description)
  html = setMeta(html, /(<meta name="twitter:image" content=")[^"]*(")/, imageUrl)

  const head = [
    ...buildAlternates(shop.siteUrl, url).map(
      ({ hreflang, href }) => `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}" />`,
    ),
    // Same id the runtime <SEO> component uses, so it replaces this tag after hydration.
    jsonLd ? `<script type="application/ld+json" id="page-jsonld">${scriptJson(jsonLd)}</script>` : '',
  ].filter(Boolean)
  html = html.replace('</head>', `    ${head.join('\n    ')}\n  </head>`)

  html = html.replace('<div id="root"></div>', `<div id="root">${render(url)}</div>`)

  const outDir = path.join(DIST, url.replace(/^\//, ''))
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8')
}

let pages = 0
for (const lang of SUPPORTED_LANGS) {
  const t = (key, vars) => translate(lang, key, vars)
  const titled = (title) => `${title} | ${shop.name}`
  const href = (route) => withLang(lang, route)

  renderPage({ lang, route: '/', title: `${shop.name} — ${t('heroTagline')}`, description: t('seoHomeDescription') })
  renderPage({ lang, route: '/catalog', title: titled(t('catalogTitle')), description: t('seoCatalogDescription') })
  renderPage({ lang, route: '/contact', title: titled(t('contactTitle')), description: t('seoContactDescription') })
  renderPage({ lang, route: '/guide', title: titled(t('guideTitle')), description: t('seoGuideDescription') })
  renderPage({
    lang,
    route: '/about',
    title: titled(t('aboutPageTitle')),
    description: t('seoAboutDescription'),
    jsonLd: buildAboutJsonLd(shop.siteUrl, lang, t('aboutPageTitle')),
  })
  renderPage({
    lang,
    route: '/faq',
    title: titled(t('faqTitle')),
    description: t('seoFaqDescription'),
    jsonLd: buildFaqJsonLd(localizedFaq(lang, translate)),
  })
  for (const season of seasons) {
    const name = t(`season${seasonKey(season.slug)}`)
    renderPage({
      lang,
      route: `/season/${season.slug}`,
      title: titled(t('seasonTitle', { season: name })),
      description: t('seoSeasonDescription', { season: name, text: t(`season${seasonKey(season.slug)}Text`) }),
      image: `/og/${seasonCategories(season)[0]?.category ?? 'ceiling-fans'}.png`,
    })
  }
  pages += 6 + seasons.length

  for (const category of categories) {
    const categoryRoute = `/catalog/${category.category}`
    const breadcrumb = buildBreadcrumbJsonLd(shop.siteUrl, [
      { name: t('navHome'), path: href('/') },
      { name: t('navCatalog'), path: href('/catalog') },
      { name: translateCategory(lang, category.category, category.categoryLabel), path: href(categoryRoute) },
    ])
    const categoryMeta = buildCategorySeo(lang, category)
    renderPage({ lang, route: categoryRoute, ...categoryMeta, title: titled(categoryMeta.title), jsonLd: breadcrumb })
    pages += 1

    for (const brand of category.brands ?? []) {
      for (const model of brand.models ?? []) {
        const meta = buildModelSeo(lang, category, brand.brand, model)
        const product = buildProductJsonLd(shop.siteUrl, {
          lang,
          category,
          brandName: brand.brand,
          model,
          imageUrl: absolute(meta.image),
        })
        renderPage({
          lang,
          route: `${categoryRoute}/${slugify(model.modelName)}`,
          ...meta,
          title: titled(meta.title),
          jsonLd: [breadcrumb, product],
        })
        pages += 1
      }
    }
  }
}

console.log(`Pre-rendered ${pages} pages (${SUPPORTED_LANGS.join(', ')}) + spa.html shell.`)
