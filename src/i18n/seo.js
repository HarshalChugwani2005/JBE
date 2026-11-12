/**
 * Page metadata builders shared by the runtime <SEO> component and
 * scripts/prerender.js, so pre-rendered and client-side tags match.
 */
import { slugify } from '../utils/slugify.js'
import { translate, translateCategory } from './format.js'
import { stripLang, withLang } from './paths.js'
import { DEFAULT_LANG, SUPPORTED_LANGS } from './registry.js'

function productName(brand, modelName) {
  return `${brand ? `${brand} ` : ''}${modelName}`
}

export function buildCategorySeo(lang, category) {
  const label = translateCategory(lang, category.category, category.categoryLabel)
  return {
    title: label,
    description: translate(lang, category.comingSoon ? 'seoComingSoonDescription' : 'seoCategoryDescription', {
      category: label,
    }),
    image: `/og/${category.category}.png`,
  }
}

export function buildModelSeo(lang, category, brandName, model) {
  const label = translateCategory(lang, category.category, category.categoryLabel)
  const name = productName(brandName, model.modelName)
  const specs = model.specs?.slice(0, 3).join(', ')
  return {
    title: `${name} | ${label}`,
    description: translate(lang, 'seoModelDescription', {
      product: name,
      category: label,
      specs: specs ? `${specs}. ` : '',
    }),
    image: `/og/products/${category.category}-${slugify(model.modelName)}.png`,
  }
}

/**
 * <link rel="alternate" hreflang> entries for a page: the same page in every language,
 * plus x-default (English) — tells search engines which URL to show to which language.
 */
export function buildAlternates(siteUrl, pathname) {
  const path = stripLang(pathname)
  return [
    ...SUPPORTED_LANGS.map((lang) => ({ hreflang: lang, href: `${siteUrl}${withLang(lang, path)}` })),
    { hreflang: 'x-default', href: `${siteUrl}${withLang(DEFAULT_LANG, path)}` },
  ]
}

export function buildBreadcrumbJsonLd(siteUrl, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}

/** Product structured data without price — the shop quotes prices on enquiry only. */
export function buildProductJsonLd(siteUrl, { category, brandName, model, imageUrl, lang = 'en' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName(brandName, model.modelName),
    category: category.categoryLabel,
    ...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
    ...(model.specs?.length ? { description: model.specs.join(', ') } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    url: `${siteUrl}${withLang(lang, `/catalog/${category.category}/${slugify(model.modelName)}`)}`,
  }
}

/** FAQPage structured data from localizedFaq() items. */
export function buildFaqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}
