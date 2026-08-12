const imageModules = import.meta.glob('../assets/images/**/*.{avif,webp,jpg,jpeg,png,gif,svg}', {
  eager: true,
  import: 'default',
})

const supportedExtensions = ['webp', 'jpg', 'jpeg', 'png', 'avif', 'gif', 'svg']

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
    const key = `${dir}/${name}`
    if (imageModules[key]) {
      return imageModules[key]
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
