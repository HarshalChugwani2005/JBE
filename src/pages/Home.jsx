import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import MapPreview from '../components/MapPreview'
import ProductImage from '../components/ProductImage'
import RecentlyViewed from '../components/RecentlyViewed'
import RevealOnScroll from '../components/RevealOnScroll'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { buildGreeting } from '../i18n/whatsappMessages'
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
  const { t, tCategory, lang, href } = useLanguage()
  const featured = featuredCategorySlugs
    .map((slug) => categories.find((c) => c.category === slug))
    .filter(Boolean)
  const heroProduct = categories
    .find((category) => category.category === 'ceiling-fans')?.brands?.[0]?.models?.[0]

  return (
    <>
      <SEO description={t('seoHomeDescription')} />
      <div className="-mx-4">
        {/* Storefront Hero */}
        <section className="hero-surface px-4 py-10 text-white sm:px-6 md:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
            {/* Storefront Location Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-black/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-100">
              <MapPinIcon className="h-3.5 w-3.5 text-amber-300" />
              <span>{t('heroLocation')}</span>
            </div>

            <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-tight sm:mt-4 sm:text-4xl md:text-5xl">
              {shop.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base sm:text-lg font-medium text-amber-50 leading-relaxed">
              {t('heroTagline')}
            </p>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-amber-100 leading-normal">
              {t('heroDescription')}
            </p>

            {/* Store Information Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-amber-50 font-medium">
              <div className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-3.5 w-3.5 text-amber-300" />
                <span>{t('hours')}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5 text-amber-300" />
                <span>+91 {shop.primaryPhone}</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to={href('/catalog')}
                className="btn w-full bg-white px-6 py-3 text-amber-950 shadow-sm hover:bg-amber-50 sm:w-auto"
              >
                <span>{t('heroBrowseCatalog')}</span>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={getWhatsAppUrl(buildGreeting(lang))}
                onClick={() => trackWhatsAppClick('hero_section')}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp w-full px-6 py-3 sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4" />
                <span>{t('heroWhatsAppUs')}</span>
              </a>
            </div>
            </div>

            {heroProduct && (
              <div className="relative hidden md:block hero-product-enter">
                <div className="absolute -inset-4 rounded-4xl border border-white/15 bg-white/5" aria-hidden="true" />
                <div className="animate-float">
                  <ProductImage
                    category="ceiling-fans"
                    product={heroProduct}
                    alt={`${heroProduct.modelName} — ${tCategory('ceiling-fans')}`}
                    className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    imgClassName="object-contain p-6"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
                <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-stone-950/65 px-3 py-2 backdrop-blur-sm animate-slide-in-up" style={{animationDelay:'0.6s'}}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">{t('featuredRange')}</p>
                  <p className="mt-0.5 text-sm font-bold text-white">{heroProduct.modelName}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-0">
          {/* Featured Categories */}
          <Section
            title={t('featuredCategories')}
            subtitle={t('featuredCategoriesSubtitle')}
          >
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {featured.map((cat) => (
                <li key={cat.category} className="stagger-item">
                  <CategoryCard
                    category={cat.category}
                    categoryLabel={cat.categoryLabel}
                    comingSoon={cat.comingSoon}
                    brands={cat.brands}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link to={href('/catalog')} className="btn btn-secondary rounded-full px-6 text-amber-900">
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
              <RevealOnScroll variant="left">
                <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-4 animate-float-slow">
                    <StoreIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-stone-900">{t('wholesaleAndRetail')}</h3>
                  <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
                    {t('aboutWholesaleText')}
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll variant="right" delay={80}>
                <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow duration-300">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-4 animate-float-slow" style={{animationDelay:'1s'}}>
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
