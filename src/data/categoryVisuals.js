/** Visual treatment per category slug (placeholder until real photos on Day 6). */

export const categoryVisuals = {
  'ceiling-fans': {
    gradient: 'from-amber-500 to-orange-600',
    label: 'Ceiling Fans',
  },
  'hot-plates': {
    gradient: 'from-orange-400 to-red-500',
    label: 'Hot Plates',
  },
  mixers: {
    gradient: 'from-yellow-500 to-amber-600',
    label: 'Mixers',
  },
  torches: {
    gradient: 'from-slate-500 to-slate-700',
    label: 'Torches',
  },
  geysers: {
    gradient: 'from-sky-500 to-blue-600',
    label: 'Geysers',
  },
  'immersion-rods': {
    gradient: 'from-red-400 to-orange-500',
    label: 'Immersion Rods',
  },
  'table-fans': {
    gradient: 'from-teal-500 to-cyan-600',
    label: 'Table Fans',
  },
  'electric-irons': {
    gradient: 'from-violet-500 to-purple-600',
    label: 'Irons',
  },
  'led-bulbs': {
    gradient: 'from-yellow-400 to-yellow-600',
    label: 'LED Bulbs',
  },
  'bluetooth-speakers': {
    gradient: 'from-indigo-500 to-blue-600',
    label: 'Speakers',
  },
  '12v-batteries': {
    gradient: 'from-emerald-500 to-green-600',
    label: '12V Batteries',
  },
  coolers: {
    gradient: 'from-cyan-500 to-teal-600',
    label: 'Coolers',
  },
}

export function getCategoryVisual(slug) {
  return (
    categoryVisuals[slug] ?? {
      gradient: 'from-stone-400 to-stone-600',
      label: 'Products',
    }
  )
}

/** Count total models in a category (for live categories). */
export function getModelCount(category) {
  if (!category?.brands?.length) return 0
  return category.brands.reduce((sum, b) => sum + (b.models?.length ?? 0), 0)
}
