import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import MapPreview from '../components/MapPreview'
import RevealOnScroll from '../components/RevealOnScroll'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { categories } from '../data/products'
import { featuredCategorySlugs, getWhatsAppUrl, shop } from '../data/site'
import { trackWhatsAppClick } from '../utils/analytics'

export default function Home() {
  const { t } = useLanguage()
  const featured = featuredCategorySlugs
    .map((slug) => categories.find((c) => c.category === slug))
    .filter(Boolean)

  return (
    <>
      <SEO
        title={t('navHome')}
        description="Jai Baba Electronic offers ceiling fans, coolers, appliances and more in Malkapur. Browse the catalog and enquire for wholesale or retail pricing."
      />
      <div className="-mx-4">
        {/* Hero */}
        <section className="hero-surface relative overflow-hidden px-4 py-14 text-white sm:px-6 md:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-orange-400/20 blur-2xl" />
          <div className="pointer-events-none absolute inset-0 hero-texture" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl">
            <p className="hero-entrance text-sm font-medium uppercase tracking-wider text-amber-100">
              {t('heroLocation')}
            </p>
            <h1 className="hero-entrance hero-entrance--delay-1 font-display mt-2 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {shop.name}
            </h1>
            <p className="hero-entrance hero-entrance--delay-2 mt-4 max-w-xl text-lg text-amber-50">
              {t('heroTagline')}
            </p>
            <p className="hero-entrance hero-entrance--delay-3 mt-2 max-w-lg text-sm text-amber-100/90">
              {t('heroDescription')}
            </p>
            <div className="hero-entrance hero-entrance--delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/catalog"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-amber-800 shadow-md transition hover:bg-amber-50"
              >
                {t('heroBrowseCatalog')}
              </Link>
              <a
                href={getWhatsAppUrl()}
                onClick={() => trackWhatsAppClick('hero_section')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1fb855]"
              >
                {t('heroWhatsAppUs')}
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-0">
          {/* Featured Categories */}
          <Section
            title={t('featuredCategories')}
            subtitle={t('featuredCategoriesSubtitle')}
          >
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((cat, index) => (
                <li key={cat.category}>
                  <RevealOnScroll delay={index * 80}>
                    <CategoryCard
                      category={cat.category}
                      categoryLabel={cat.categoryLabel}
                      comingSoon={cat.comingSoon}
                      brands={cat.brands}
                    />
                  </RevealOnScroll>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <Link
                to="/catalog"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-amber-700 hover:text-amber-900"
              >
                {t('viewAllCategories')}
              </Link>
            </div>
          </Section>

          {/* About */}
          <Section
            title={t('aboutTitle')}
            subtitle={t('aboutSubtitle')}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <RevealOnScroll>
                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-stone-900">{t('wholesaleAndRetail')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed">
                    {t('aboutWholesaleText')}
                  </p>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={120}>
                <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <h3 className="font-semibold text-stone-900">{t('contactForPrice')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed">
                    {t('aboutContactText')}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-stone-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {t('warrantyZipSy')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {t('copperWinding')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {t('friendlyService')}
                    </li>
                  </ul>
                </div>
              </RevealOnScroll>
            </div>
          </Section>

          {/* Map Preview */}
          <Section
            title={t('findUs')}
            subtitle={t('findUsSubtitle')}
          >
            <MapPreview />
          </Section>
        </div>
      </div>
    </>
  )
}
