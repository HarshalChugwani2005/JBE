import CategoryCard from '../components/CategoryCard'
import { categories } from '../data/products'

export default function Catalog() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
      <p className="mt-2 text-gray-600">
        Browse by category. Some categories are still being populated.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.category}
            category={cat.category}
            categoryLabel={cat.categoryLabel}
            comingSoon={cat.comingSoon}
          />
        ))}
      </div>
    </div>
  )
}
