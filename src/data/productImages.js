/**
 * Product image resolver.
 *
 * Raster images (jpg/png/webp/avif) are optimised at build time by vite-imagetools:
 * converted to WebP and resized to 400/800/1200px (never upscaled). Each image gets
 *   - `src`    → largest WebP (used as the default / lightbox source)
 *   - `srcSet` → responsive WebP set so cards & thumbnails download small files
 * SVG and GIF files are passed through untouched.
 */
const rasterSrcModules = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?w=1200&format=webp&quality=78&withoutEnlargement',
})

const rasterSrcSetModules = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?w=400;800;1200&format=webp&quality=78&withoutEnlargement&as=srcset',
})

const passthroughModules = import.meta.glob('../assets/images/**/*.{gif,svg}', {
  eager: true,
  import: 'default',
})

const supportedExtensions = ['webp', 'jpg', 'jpeg', 'png', 'avif', 'gif', 'svg']

/** Resolved URL → original file base name (e.g. "titan-brown"), for color matching. */
const urlToBaseName = new Map()
/** Resolved URL → responsive srcset string. */
const urlToSrcSet = new Map()

function isExternalSource(value) {
  return typeof value === 'string' && /^(https?:)?\/\//.test(value)
}

function normalizeFilename(value) {
  return String(value).split(/[?#]/)[0].split('/').pop()
}

function getBaseName(value) {
  const filename = normalizeFilename(value)
  return filename.replace(/\.[^.]+$/, '')
}

function getExtension(value) {
  const filename = normalizeFilename(value)
  const match = filename.match(/\.([^.]+)$/)
  return match ? match[1].toLowerCase() : ''
}

/** Removes duplicate width descriptors (small sources are not upscaled, so widths can repeat). */
function dedupeSrcSet(srcSet) {
  if (typeof srcSet !== 'string') return undefined
  const seen = new Set()
  const entries = srcSet
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => {
      const url = entry.split(/\s+/)[0]
      if (!url || seen.has(url)) return false
      seen.add(url)
      return true
    })
  return entries.length > 1 ? entries.join(', ') : undefined
}

function lookupModule(key) {
  if (rasterSrcModules[key]) {
    const url = rasterSrcModules[key]
    if (!urlToSrcSet.has(url)) {
      const srcSet = dedupeSrcSet(rasterSrcSetModules[key])
      if (srcSet) urlToSrcSet.set(url, srcSet)
    }
    return url
  }
  return passthroughModules[key] || null
}

function resolveLocalImage(categorySlug, candidate) {
  if (!candidate) return null

  const filename = normalizeFilename(candidate)
  const baseName = getBaseName(candidate)
  const extension = getExtension(candidate)
  const dir = `../assets/images/${categorySlug}`

  const lookupOrder = extension
    ? [filename, ...supportedExtensions.filter((ext) => ext !== extension).map((ext) => `${baseName}.${ext}`)]
    : supportedExtensions.map((ext) => `${baseName}.${ext}`)

  for (const name of lookupOrder) {
    const url = lookupModule(`${dir}/${name}`)
    if (url) {
      urlToBaseName.set(url, baseName.toLowerCase())
      return url
    }
  }

  return null
}

export function getProductImageUrls(categorySlug, product) {
  const candidates = []

  if (Array.isArray(product?.images)) {
    candidates.push(...product.images)
  }

  if (product?.image) {
    candidates.push(product.image)
  }

  return [...new Set(candidates)]
    .map((candidate) => {
      if (isExternalSource(candidate) || String(candidate).startsWith('data:')) {
        return candidate
      }

      return resolveLocalImage(categorySlug, candidate)
    })
    .filter(Boolean)
}

/** Responsive srcset for a URL returned by getProductImageUrls (undefined if none). */
export function getImageSrcSet(url) {
  return urlToSrcSet.get(url)
}

/**
 * Original file base name for a resolved image URL (e.g. "titan-brown").
 * Falls back to parsing the URL for external sources.
 */
export function getImageBaseName(url) {
  if (!url) return ''
  return urlToBaseName.get(url) ?? getBaseName(url).toLowerCase()
}
