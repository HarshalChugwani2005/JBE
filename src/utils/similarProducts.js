import { categories } from '../data/products.js'

/**
 * Other models from the same category for the product modal's "More …" strip:
 * same price tier first, then the rest, in catalog order. Empty when the category has
 * no other models.
 */
export function similarModels(categorySlug, modelName, priceTier, limit = 4) {
  const category = categories.find((c) => c.category === categorySlug)
  if (!category) return []
  const others = (category.brands ?? []).flatMap((brand) =>
    (brand.models ?? []).filter((model) => model.modelName !== modelName).map((model) => ({ brand, model })),
  )
  const sameTier = others.filter(({ model }) => priceTier && model.priceTier === priceTier)
  const rest = others.filter((item) => !sameTier.includes(item))
  return [...sameTier, ...rest].slice(0, limit)
}
