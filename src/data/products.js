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
            image: 'titan-smoke-brown.jpg',
            images: ['titan-smoke-brown.jpg', 'titan-ivory.jpg', 'titan-brown.jpg'],
            inStock: true,
            priceTier: 'mid',
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
            inStock: true,
            priceTier: 'budget',
          },
          {
            modelName: 'Bounce',
            specs: ['Contemporary aero blades', 'Low wattage consumption', 'Smooth silent run'],
            colors: ['White', 'Beige', 'Copper', 'Sky Blue', 'Bronze'],
            image: 'bounce.jpg',
            inStock: true,
            priceTier: 'mid',
          },
          {
            modelName: 'Zoro',
            specs: ['Metallic antique coating', 'Heavy duty copper motor', 'Wobble-free balance'],
            colors: ['Gold', 'White', 'Grey', 'Bronze'],
            image: 'zoro.jpg',
            inStock: true,
            priceTier: 'premium',
          },
          {
            modelName: 'Wonder',
            specs: ['Hi-speed airflow', 'Rust proof powder coating', 'Dynamic blade pitch'],
            colors: ['Brown', 'White', 'Ivory'],
            image: 'wonder.jpg',
            inStock: true,
            priceTier: 'budget',
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
            inStock: true,
            priceTier: 'premium',
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
            inStock: true,
            priceTier: 'mid',
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
            inStock: true,
            priceTier: 'budget',
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
            inStock: true,
            priceTier: 'budget',
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
        brand: 'Crompton',
        tagline: 'Instant Hot Water with 4-Level Safety Shield',
        warranty: '5 Years Tank Warranty · 2 Years Product Warranty',
        models: [
          {
            modelName: 'Rapid Jet 3L',
            specs: [
              '3000W Heavy-Duty Nickel-Coated Copper Heating Element',
              '3 Litres Capacity — Instant 33% Faster Heating',
              '6.5 Bar Pressure Rating — Suitable for High-Rise Buildings',
              'High-Grade 304L Stainless Steel Tank (Rust & Scale Proof)',
              '4-Level Advanced Safety Shield (Capillary Thermostat & Auto Thermal Cut-off)',
              'High-Density PUF Insulation for Maximum Heat Retention',
              'Anti-Siphon Protection against Dry Heating Damage',
              'Smart Bi-Color LED Indicators for Power & Heating',
            ],
            colors: ['White'],
            image: 'crompton-rapid-jet-3l.png',
            images: ['crompton-rapid-jet-3l.png'],
            inStock: true,
            priceTier: 'mid',
          },
          {
            modelName: 'Rapid Jet 5L',
            specs: [
              '2000W Nickel-Coated Copper Heating Element',
              '5 Litres Capacity — Ideal for 2–3 Users',
              '6.5 Bar Pressure Rating — Suitable for High-Rise Buildings',
              'High-Grade 304L Stainless Steel Tank (Rust & Scale Proof)',
              '4-Level Advanced Safety Shield (Capillary Thermostat & Auto Thermal Cut-off)',
              'High-Density PUF Insulation for Longer Heat Retention',
              'Anti-Siphon Protection against Dry Heating Damage',
              'Smart Bi-Color LED Indicators for Power & Heating',
              'Wall-Mount Design — Space Saving Vertical Installation',
            ],
            colors: ['White'],
            image: 'crompton-rapid-jet-3l.png',
            images: ['crompton-rapid-jet-3l.png'],
            inStock: true,
            priceTier: 'mid',
          },
        ],
      },
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
            inStock: true,
            priceTier: 'budget',
          },
        ],
      },
      {
        brand: 'Orient Electric',
        tagline: '5-Level Safety Shield · 5-Year Tank Warranty',
        warranty: '5 Years Tank · 2 Years Heating Element · 2 Years Product',
        models: [
          {
            modelName: 'Rapidus 5.5L',
            specs: [
              '3000W Heavy-Duty Copper Heating Element — Fast 33% Quicker Heating',
              '5.5 Litres Capacity — Ideal for 2–3 Users',
              '6.5 Bar Pressure Rating — Suitable for Mid-Rise Buildings',
              'High-Grade Stainless Steel Tank (Rust & Corrosion Proof)',
              '5-Level Advanced Safety Shield — Overheating, Dry Heat & Shock Protection',
              'Pressure Relief Valve + Anti-Siphon Hole for Ultra-Safe Operation',
              'Glass Wool Insulation for Superior Heat Retention & Energy Saving',
              'Shock-Proof & Rust-Proof High-Strength Polymer Outer Body',
              'Dual Neon Indicators for Power & Heating Status',
              'IPX1 Humidity Protection — Designed for Bathroom & Kitchen Use',
              'Compact Wall-Mount Design (30.7 × 28.2 × 52.5 cm) · Weight: 3 kg',
            ],
            colors: ['White / Aqua Blue'],
            image: 'orient-rapidus-5-5l.png',
            images: ['orient-rapidus-5-5l.png'],
            inStock: true,
            priceTier: 'mid',
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
            inStock: true,
            priceTier: 'budget',
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
            inStock: true,
            priceTier: 'budget',
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
            inStock: true,
            priceTier: 'budget',
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
        brand: 'Surya',
        tagline: 'Up to 85% Energy Saving · 25,000 Hours Life',
        warranty: '2 Years Warranty',
        models: [
          {
            modelName: 'LED B22 — 9W',
            specs: [
              '9W LED — Replaces 75W Incandescent Bulb',
              '900 Lumens — Bright Cool Daylight (6500K)',
              'B22 Bayonet Base — Universally Compatible',
              '140V–280V Wide Voltage Range — Stable in Power Fluctuations',
              '25,000 Hours Rated Lifespan — Long Lasting',
              'Up to 85% Energy Saving vs Traditional Bulbs',
              'Instant Start — No Warm-up Time, No Flicker',
              'Polycarbonate Body + Aluminium Base — Durable Heat Dissipation',
              'Mercury-Free & RoHS Compliant — Eco-Friendly',
              'Power Factor ≥ 0.9 — High Efficiency',
            ],
            colors: ['Cool Daylight (6500K)', 'Warm White (3000K)'],
            image: 'surya-led-b22.png',
            images: ['surya-led-b22.png'],
            inStock: true,
            priceTier: 'budget',
          },
          {
            modelName: 'LED B22 — 12W',
            specs: [
              '12W LED — Replaces 100W Incandescent Bulb',
              '1200 Lumens — High Brightness Cool Daylight (6500K)',
              'B22 Bayonet Base — Universally Compatible',
              '140V–280V Wide Voltage Range — Stable in Power Fluctuations',
              '25,000 Hours Rated Lifespan — Long Lasting',
              'Up to 85% Energy Saving vs Traditional Bulbs',
              'Instant Start — No Warm-up Time, No Flicker',
              'Polycarbonate Body + Aluminium Base — Durable Heat Dissipation',
              'Mercury-Free & RoHS Compliant — Eco-Friendly',
            ],
            colors: ['Cool Daylight (6500K)', 'Warm White (3000K)'],
            image: 'surya-led-b22.png',
            images: ['surya-led-b22.png'],
            inStock: true,
            priceTier: 'budget',
          },
          {
            modelName: 'LED B22 — 7W',
            specs: [
              '7W LED — Replaces 60W Incandescent Bulb',
              '700 Lumens — Cool Daylight (6500K)',
              'B22 Bayonet Base — Universally Compatible',
              '140V–280V Wide Voltage Range',
              '25,000 Hours Rated Lifespan',
              'Up to 85% Energy Saving',
              'Instant Start — No Flicker',
              'Eco-Friendly, Mercury-Free',
            ],
            colors: ['Cool Daylight (6500K)', 'Warm White (3000K)'],
            image: 'surya-led-b22.png',
            images: ['surya-led-b22.png'],
            inStock: true,
            priceTier: 'budget',
          },
          {
            modelName: 'LED B22 — 15W',
            specs: [
              '15W LED — Replaces 125W Incandescent Bulb',
              '1500 Lumens — Extra Bright Cool Daylight (6500K)',
              'B22 Bayonet Base — Universally Compatible',
              '140V–280V Wide Voltage Range',
              '25,000 Hours Rated Lifespan',
              'Up to 85% Energy Saving',
              'Instant Start — No Flicker',
              'Ideal for Large Rooms, Halls & Offices',
              'Eco-Friendly, Mercury-Free',
            ],
            colors: ['Cool Daylight (6500K)', 'Warm White (3000K)'],
            image: 'surya-led-b22.png',
            images: ['surya-led-b22.png'],
            inStock: true,
            priceTier: 'budget',
          },
          {
            modelName: 'LED B22 — 23W',
            specs: [
              '23W LED — Replaces 200W Incandescent Bulb',
              '2300 Lumens — Powerful Bright Daylight (6500K)',
              'B22 Bayonet Base — Universally Compatible',
              '140V–280V Wide Voltage Range',
              '25,000 Hours Rated Lifespan',
              'Up to 85% Energy Saving',
              'Ideal for Shops, Warehouses & Large Halls',
              'Eco-Friendly, Mercury-Free',
            ],
            colors: ['Cool Daylight (6500K)'],
            image: 'surya-led-b22.png',
            images: ['surya-led-b22.png'],
            inStock: true,
            priceTier: 'budget',
          },
        ],
      },
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
            inStock: true,
            priceTier: 'budget',
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
            inStock: true,
            priceTier: 'mid',
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
            inStock: true,
            priceTier: 'mid',
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
            inStock: true,
            priceTier: 'mid',
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
