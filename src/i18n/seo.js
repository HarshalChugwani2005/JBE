/**
 * Page metadata builders shared by the runtime <SEO> component and
 * scripts/generate-static-seo.js, so pre-rendered and client-side tags match.
 */
import { slugify } from '../utils/slugify.js'
import { translate, translateCategory } from './format.js'

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
export function buildProductJsonLd(siteUrl, { category, brandName, model, imageUrl }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName(brandName, model.modelName),
    category: category.categoryLabel,
    ...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
    ...(model.specs?.length ? { description: model.specs.join(', ') } : {}),
    ...(imageUrl ? { image: imageUrl } : {}),
    url: `${siteUrl}/catalog/${category.category}/${slugify(model.modelName)}`,
  }
}
