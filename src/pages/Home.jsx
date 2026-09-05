import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import MapPreview from '../components/MapPreview'
import RecentlyViewed from '../components/RecentlyViewed'
import RevealOnScroll from '../components/RevealOnScroll'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { categories } from '../data/products'
import { featuredCategorySlugs, getWhatsAppUrl, shop } from '../data/site'
import { trackWhatsAppClick } from '../utils/analytics'
import {
  WhatsAppIcon,
  StoreIcon,
  ShieldCheckIcon,
  CheckIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  ArrowRightIcon,
} from '../components/Icons'

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
        {/* Storefront Hero */}
        <section className="hero-surface px-4 py-10 text-white sm:px-6 md:py-16">
          <div className="mx-auto max-w-6xl">
            {/* Storefront Location Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-100">
              <MapPinIcon className="h-3.5 w-3.5 text-amber-300" />
              <span>{t('heroLocation')}</span>
            </div>

            <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-5xl">
              {shop.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg font-medium text-amber-100/90 leading-relaxed">
              {t('heroTagline')}
            </p>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-amber-100/80 leading-normal">
              {t('heroDescription')}
            </p>

            {/* Store Information Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-amber-100/90 font-medium">
              <div className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-amber-300" />
                <span>{shop.hours}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5 text-amber-300" />
                <span>+91 {shop.primaryPhone}</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/catalog"
                className="inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-amber-950 shadow-sm transition duration-150 hover:bg-amber-50 active:scale-[0.99]"
              >
                <span>{t('heroBrowseCatalog')}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={getWhatsAppUrl()}
                onClick={() => trackWhatsAppClick('hero_section')}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm"
              >
                <WhatsAppIcon className="h-4 w-4" />
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
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {featured.map((cat, index) => (
                <li key={cat.category}>
                  <RevealOnScroll delay={index * 60}>
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
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-white px-6 py-2 text-sm font-semibold text-amber-900 shadow-xs transition duration-150 hover:border-amber-400 hover:bg-amber-50/50"
              >
                <span>{t('viewAllCategories')}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 text-amber-700" />
              </Link>
            </div>
          </Section>

          {/* About Jai Baba Electronic */}
          <Section
            title={t('aboutTitle')}
            subtitle={t('aboutSubtitle')}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <RevealOnScroll>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-4">
                    <StoreIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">{t('wholesaleAndRetail')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
                    {t('aboutWholesaleText')}
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={80}>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-4">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">{t('contactForPrice')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
                    {t('aboutContactText')}
                  </p>
                  <ul className="mt-4 space-y-2.5 text-sm text-stone-600">
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>{t('warrantyZipSy')}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>{t('copperWinding')}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span>{t('friendlyService')}</span>
                    </li>
                  </ul>
                </div>
              </RevealOnScroll>
            </div>
          </Section>

          {/* Recently Viewed Products */}
          <RecentlyViewed />

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
