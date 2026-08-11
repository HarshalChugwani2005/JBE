import CategoryCard from '../components/CategoryCard'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { categories } from '../data/products'

export default function Catalog() {
  const liveCount = categories.filter((c) => !c.comingSoon).length
  const comingSoonCount = categories.filter((c) => c.comingSoon).length

  return (
    <>
      <SEO
        title="Catalog"
        description="Browse Jai Baba Electronic's catalog by category, including ceiling fans and more products available for enquiry."
      />
      <div>
      <header className="border-b border-stone-200 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Product Catalog
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Browse our full range by category. {liveCount} categor
          {liveCount === 1 ? 'y is' : 'ies are'} ready to explore;{' '}
          {comingSoonCount} more coming soon as we add catalog photos.
        </p>
      </header>

      <Section
        title="All Categories"
        subtitle="Tap any category to view brands and models. Categories marked Coming Soon will be updated as product data arrives."
        className="pt-8"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.category}
              category={cat.category}
              categoryLabel={cat.categoryLabel}
              comingSoon={cat.comingSoon}
              brands={cat.brands}
            />
          ))}
        </div>
      </Section>

      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
        <strong>Contact for price</strong> — we don&apos;t display prices online.
        Browse the catalog and reach out via WhatsApp or call for a quote.
      </div>
    </div>
    </>
  )
}
