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
        <section className="hero-surface relative overflow-hidden px-4 py-16 text-white sm:px-6 md:py-24">
          {/* Ambient Lighting Orbs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-float-slow" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-amber-400/25 blur-3xl animate-float-reverse" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute inset-0 hero-texture" aria-hidden="true" />

          <div className="relative mx-auto max-w-6xl">
            {/* Location Pill */}
            <div className="hero-entrance inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-100 backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
              <span>{t('heroLocation')}</span>
            </div>

            <h1 className="hero-entrance hero-entrance--delay-1 font-display mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-balance drop-shadow-sm">
              {shop.name}
            </h1>
            <p className="hero-entrance hero-entrance--delay-2 mt-4 max-w-xl text-lg font-medium text-amber-50/95 sm:text-xl leading-relaxed">
              {t('heroTagline')}
            </p>
            <p className="hero-entrance hero-entrance--delay-3 mt-2 max-w-lg text-sm text-amber-100/85 leading-normal">
              {t('heroDescription')}
            </p>

            {/* CTA Buttons */}
            <div className="hero-entrance hero-entrance--delay-4 mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link
                to="/catalog"
                className="btn-shimmer inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-amber-900 shadow-lg shadow-black/10 transition duration-200 hover:bg-amber-50 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{t('heroBrowseCatalog')}</span>
                <span className="ml-2 text-base transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={getWhatsAppUrl()}
                onClick={() => trackWhatsAppClick('hero_section')}
                target="_blank"
                rel="noreferrer"
                className="glow-wa inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:bg-[#1fb855] hover:-translate-y-0.5"
              >
                <span>💬</span>
                <span>{t('heroWhatsAppUs')}</span>
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
            <div className="mt-8 text-center">
              <Link
                to="/catalog"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-white px-6 py-2 text-sm font-semibold text-amber-800 shadow-xs transition duration-200 hover:border-amber-400 hover:bg-amber-50 hover:shadow-sm"
              >
                <span>{t('viewAllCategories')}</span>
                <span>→</span>
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
                <div className="glass-card rounded-2xl p-6 sm:p-7">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 text-lg mb-4">
                    🏪
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">{t('wholesaleAndRetail')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
                    {t('aboutWholesaleText')}
                  </p>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delay={120}>
                <div className="glass-card rounded-2xl p-6 sm:p-7">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 text-lg mb-4">
                    🛡️
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">{t('contactForPrice')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
                    {t('aboutContactText')}
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                        ✓
                      </span>
                      <span>{t('warrantyZipSy')}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                        ✓
                      </span>
                      <span>{t('copperWinding')}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-800">
                        ✓
                      </span>
                      <span>{t('friendlyService')}</span>
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
