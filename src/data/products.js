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
    comingSoon: false,
    brands: [
      {
        brand: 'Prestige',
        tagline: 'Quick heating, sturdy build',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: 'Cooktop 2 Burner',
            specs: ['2 burner design', 'Fast heating coils', 'Good for homes and small shops'],
            colors: ['Black', 'Silver'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'mixers',
    categoryLabel: 'Mixers',
    comingSoon: false,
    brands: [
      {
        brand: 'Bajaj',
        tagline: 'Reliable kitchen performance',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: 'MX-200',
            specs: ['High speed motor', 'Easy grip handle', 'Ideal for daily use'],
            colors: ['White', 'Red'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'torches',
    categoryLabel: 'Torches',
    comingSoon: false,
    brands: [
      {
        brand: 'Eveready',
        tagline: 'Power for homes and outdoor use',
        warranty: '6 Months Warranty',
        models: [
          {
            modelName: 'LED Torch',
            specs: ['Long battery life', 'Water resistant body', 'Portable design'],
            colors: ['Black', 'Yellow'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'geysers',
    categoryLabel: 'Geysers',
    comingSoon: false,
    brands: [
      {
        brand: 'Havells',
        tagline: 'Fast heating and safety',
        warranty: '2 Year Warranty',
        models: [
          {
            modelName: 'Instant 3L',
            specs: ['Instant heating', 'Compact body', 'Energy efficient'],
            colors: ['White', 'Grey'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'immersion-rods',
    categoryLabel: 'Immersion Rods',
    comingSoon: false,
    brands: [
      {
        brand: 'Orient',
        tagline: 'Quick water heating',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: '300W Rod',
            specs: ['Fast heating', 'Powerful coil', 'Easy to store'],
            colors: ['Black', 'Silver'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'table-fans',
    categoryLabel: 'Table Fans',
    comingSoon: false,
    brands: [
      {
        brand: 'Usha',
        tagline: 'Portable cooling for daily use',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: 'Desk Fan 12',
            specs: ['Compact design', 'Low power consumption', 'Adjustable tilt'],
            colors: ['White', 'Blue'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'electric-irons',
    categoryLabel: 'Electric Irons',
    comingSoon: false,
    brands: [
      {
        brand: 'Philips',
        tagline: 'Smooth ironing experience',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: 'Steam Iron',
            specs: ['Steam burst', 'Non-stick soleplate', 'Comfortable grip'],
            colors: ['Blue', 'Grey'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'led-bulbs',
    categoryLabel: 'LED Bulbs',
    comingSoon: false,
    brands: [
      {
        brand: 'Syska',
        tagline: 'Energy-saving lighting',
        warranty: '2 Year Warranty',
        models: [
          {
            modelName: '9W LED',
            specs: ['Low power use', 'Long life', 'Warm white output'],
            colors: ['Warm White', 'Cool White'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'bluetooth-speakers',
    categoryLabel: 'Bluetooth Speakers',
    comingSoon: false,
    brands: [
      {
        brand: 'Boat',
        tagline: 'Portable sound for homes and travel',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: 'Soundbar Mini',
            specs: ['Bluetooth connectivity', 'Portable design', 'Balanced sound'],
            colors: ['Black', 'Blue'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: '12v-batteries',
    categoryLabel: '12V Rechargeable Batteries',
    comingSoon: false,
    brands: [
      {
        brand: 'Amaron',
        tagline: 'Reliable backup power',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: '12V Rechargeable',
            specs: ['Deep discharge support', 'Long service life', 'Maintenance friendly'],
            colors: ['Black'],
            image: null,
          },
        ],
      },
    ],
  },
  {
    category: 'coolers',
    categoryLabel: 'Coolers',
    comingSoon: false,
    brands: [
      {
        brand: 'Symphony',
        tagline: 'Portable cooling for homes and shops',
        warranty: '1 Year Warranty',
        models: [
          {
            modelName: 'Cooler 30L',
            specs: ['High airflow', 'Water tank', 'Easy mobility'],
            colors: ['White', 'Grey'],
            image: null,
          },
        ],
      },
    ],
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
