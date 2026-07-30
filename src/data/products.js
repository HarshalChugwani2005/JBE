/**
 * Product catalog data — static source of truth for the site.
 * Schema: category → brands → models (see BACKEND_SCHEMA.md)
 */

export const categories = [
  {
    category: 'ceiling-fans',
    categoryLabel: 'Ceiling Fans',
    comingSoon: false,
    brands: [
      {
        brand: 'ZIPSY',
        tagline: '100% Copper Winding',
        warranty: '730 Days Warranty',
        models: [
          {
            modelName: 'Titan',
            specs: [
              'Highest air delivery',
              'Double ball bearing',
              'Aerodynamic design',
              'Superior paint finish',
            ],
            colors: ['Smoke Brown', 'Ivory', 'Brown'],
            image: 'titan.jpg',
          },
          {
            modelName: 'Glory',
            specs: [
              '405 RPM',
              'Optimum air delivery even at low voltage',
              'Long lasting paint finish',
            ],
            colors: ['Cherry Red'],
            image: 'glory.jpg',
          },
          {
            modelName: 'Bounce',
            specs: [],
            colors: ['White', 'Beige', 'Copper', 'Sky Blue', 'Bronze'],
            image: 'bounce.jpg',
          },
          {
            modelName: 'Zoro',
            specs: [],
            colors: ['Gold', 'White', 'Grey', 'Bronze'],
            image: 'zoro.jpg',
          },
          {
            modelName: 'Wonder',
            specs: [],
            colors: [],
            image: 'wonder.jpg',
          },
          {
            modelName: 'Intex Designer (Sona)',
            specs: [
              '850 RPM / Hi-Speed',
              'Dust Free Technology',
              'Noiseless Operation',
              '100% Super Enamelled Copper Winding',
              'Power Saver Motor',
              'Aerodynamically balanced blades',
            ],
            colors: ['Boumvita', 'Chandi', 'Poly'],
            image: 'intex-designer.jpg',
          },
        ],
      },
    ],
  },
  {
    category: 'hot-plates',
    categoryLabel: 'Electric Hot Plates',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'mixers',
    categoryLabel: 'Mixers',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'torches',
    categoryLabel: 'Torches',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'geysers',
    categoryLabel: 'Geysers',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'immersion-rods',
    categoryLabel: 'Immersion Rods',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'table-fans',
    categoryLabel: 'Table Fans',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'electric-irons',
    categoryLabel: 'Electric Irons',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'led-bulbs',
    categoryLabel: 'LED Bulbs',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'bluetooth-speakers',
    categoryLabel: 'Bluetooth Speakers',
    comingSoon: true,
    brands: [],
  },
  {
    category: '12v-batteries',
    categoryLabel: '12V Rechargeable Batteries',
    comingSoon: true,
    brands: [],
  },
  {
    category: 'coolers',
    categoryLabel: 'Coolers',
    comingSoon: true,
    brands: [],
  },
]

/** Look up a category by its URL slug. */
export function getCategoryBySlug(slug) {
  return categories.find((c) => c.category === slug)
}

/** Look up a model within a category by slugified model name. */
export function getModelBySlug(categorySlug, modelSlug) {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return null

  for (const brand of category.brands) {
    for (const model of brand.models) {
      const slug = model.modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      if (slug === modelSlug) {
        return { brand, model }
      }
    }
  }

  return null
}
