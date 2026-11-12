/**
 * Shop photos for the About page gallery: every image in src/assets/shop/, in file-name order.
 * Optimised at build time like product photos (WebP, 400/800/1200 px, never upscaled).
 */
const srcModules = import.meta.glob('../assets/shop/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?w=1200&format=webp&quality=78&withoutEnlargement',
})

const srcSetModules = import.meta.glob('../assets/shop/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?w=400;800;1200&format=webp&quality=78&withoutEnlargement&as=srcset',
})

export const shopPhotos = Object.keys(srcModules)
  .sort()
  .map((key) => ({ src: srcModules[key], srcSet: srcSetModules[key] }))
