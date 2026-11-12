import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import CategoryCard from '../components/CategoryCard'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { getSeason, seasonCategories, seasonKey } from '../data/seasons'
import { slugify } from '../utils/slugify'
import NotFound from './NotFound'

const MAX_PRODUCTS = 6

export default function Season() {
  const { season: slug } = useParams()
  const { t, href } = useLanguage()
  const season = getSeason(slug)
  if (!season) return <NotFound />

  const key = seasonKey(season.slug)
  const name = t(`season${key}`)
  const text = t(`season${key}Text`)
  const seasonCats = seasonCategories(season)

  // A few models from each of the season's categories, round-robin so every category shows up.
  const perCategory = seasonCats.map((category) =>
    (category.brands ?? []).flatMap((brand) => (brand.models ?? []).map((model) => ({ category, brand, model }))),
  )
  const products = []
  for (let i = 0; products.length < MAX_PRODUCTS && perCategory.some((list) => list[i]); i += 1) {
    for (const list of perCategory) if (list[i] && products.length < MAX_PRODUCTS) products.push(list[i])
  }

  return (
    <>
      <SEO
        title={t('seasonTitle', { season: name })}
        description={t('seoSeasonDescription', { season: name, text })}
        image={`/og/${seasonCats[0]?.category ?? 'ceiling-fans'}.png`}
      />
      <Breadcrumbs items={[{ label: t('navHome'), to: href('/') }, { label: name }]} className="mb-4" />
      <PageHeader title={t('seasonTitle', { season: name })} subtitle={text} />

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {seasonCats.map((category) => (
          <li key={category.category}>
            <CategoryCard
              category={category.category}
              categoryLabel={category.categoryLabel}
              comingSoon={category.comingSoon}
              brands={category.brands}
            />
          </li>
        ))}
      </ul>

      {products.length > 0 && (
        <Section title={t('seasonProducts')}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(({ category, brand, model }) => (
              <ProductCard
                key={`${category.category}-${model.modelName}`}
                to={href(`/catalog/${category.category}/${slugify(model.modelName)}`)}
                modelName={model.modelName}
                brand={brand.brand}
                image={model.image}
                category={category.category}
                categoryLabel={category.categoryLabel}
                specs={model.specs}
              />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
