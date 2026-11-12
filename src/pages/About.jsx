import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { ArrowRightIcon, CheckIcon, PhoneIcon, ShieldCheckIcon, StoreIcon, TagIcon, WhatsAppIcon } from '../components/Icons'
import ImageLightbox from '../components/ImageLightbox'
import MapPreview from '../components/MapPreview'
import PageHeader from '../components/PageHeader'
import SEO from '../components/SEO'
import { useLanguage } from '../context/useLanguage'
import { categories } from '../data/products'
import { shopPhotos } from '../data/shopPhotos'
import { getPhoneUrl, getWhatsAppUrl, shop } from '../data/site'
import { buildAboutJsonLd } from '../i18n/seo'
import { buildGreeting } from '../i18n/whatsappMessages'
import { trackCallClick, trackWhatsAppClick } from '../utils/analytics'

// Figures come straight from the catalog, so they stay true as products are added.
const liveCategories = categories.filter((c) => !c.comingSoon && (c.brands ?? []).some((b) => b.models?.length))
const brandNames = [...new Set(categories.flatMap((c) => (c.brands ?? []).map((b) => b.brand)).filter(Boolean))].sort((a, b) =>
  a.localeCompare(b),
)
const modelCount = categories.reduce((sum, c) => sum + (c.brands ?? []).reduce((n, b) => n + (b.models?.length ?? 0), 0), 0)

export default function About() {
  const { t, lang, href } = useLanguage()
  const [photoIndex, setPhotoIndex] = useState(null)

  const stats = [
    { value: brandNames.length, label: t('aboutStatBrands') },
    { value: modelCount, label: t('aboutStatModels') },
    { value: liveCategories.length, label: t('aboutStatRanges') },
    { value: 7, label: t('aboutStatDays') },
  ]

  const reasons = [
    { Icon: StoreIcon, title: t('wholesaleAndRetail'), text: t('aboutWholesaleText') },
    { Icon: TagIcon, title: t('contactForPrice'), text: t('aboutContactText') },
    { Icon: CheckIcon, title: t('aboutPageHelpTitle'), text: t('aboutPageHelpText') },
    { Icon: ShieldCheckIcon, title: t('aboutPageWarrantyTitle'), text: t('aboutPageWarrantyText') },
  ]

  return (
    <>
      <SEO title={t('aboutPageTitle')} description={t('seoAboutDescription')} jsonLd={buildAboutJsonLd(shop.siteUrl, lang, t('aboutPageTitle'))} />
      <Breadcrumbs items={[{ label: t('navHome'), to: href('/') }, { label: t('navAbout') }]} className="mb-4" />
      <PageHeader title={t('aboutPageTitle')} subtitle={t('aboutSubtitle')}>
        {shop.establishedYear && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">
            {t('aboutSince', { year: shop.establishedYear })}
          </p>
        )}
      </PageHeader>

      {/* Story + figures */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="space-y-4 text-base leading-relaxed text-stone-700">
          <p>{t('aboutPageIntro')}</p>
          <p>{t('aboutPageIntro2')}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse justify-end rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
              <dt className="mt-0.5 text-xs font-semibold text-stone-600 sm:text-sm">{label}</dt>
              <dd className="font-heading text-3xl font-extrabold text-amber-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Shop photos — appear once photos are added to src/assets/shop/ */}
      {shopPhotos.length > 0 && (
        <section aria-labelledby="about-photos" className="mt-12">
          <h2 id="about-photos" className="font-heading text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{t('aboutPhotosTitle')}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {shopPhotos.map((photo, index) => (
              <li key={photo.src} className={index === 0 && shopPhotos.length > 2 ? 'col-span-2 row-span-2' : ''}>
                <button
                  type="button"
                  onClick={() => setPhotoIndex(index)}
                  aria-label={t('aboutPhotoOpen', { index: index + 1, total: shopPhotos.length })}
                  className="group block h-full w-full cursor-zoom-in overflow-hidden rounded-2xl bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                >
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes={index === 0 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 50vw'}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-4/3 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Why customers buy here */}
      <section aria-labelledby="about-why" className="mt-12">
        <h2 id="about-why" className="font-heading text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{t('aboutWhyTitle')}</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {reasons.map(({ Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs sm:p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-heading text-base font-bold text-stone-900 sm:text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Brands */}
      <section aria-labelledby="about-brands" className="mt-12">
        <h2 id="about-brands" className="font-heading text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{t('aboutBrandsTitle')}</h2>
        <p className="mt-2 text-sm text-stone-600">{t('aboutBrandsText')}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {brandNames.map((brand) => (
            <li key={brand}>
              <Link
                to={`${href('/catalog')}?brand=${encodeURIComponent(brand)}`}
                className="inline-flex min-h-10 items-center rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-bold text-stone-800 shadow-2xs transition hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
              >
                {brand}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Visit */}
      <section aria-labelledby="about-visit" className="mt-12">
        <h2 id="about-visit" className="font-heading text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{t('aboutVisitTitle')}</h2>
        <p className="mt-2 text-sm text-stone-600">{t('findUsSubtitle')}</p>
        <div className="mt-5">
          <MapPreview />
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 text-center sm:p-8">
        <h2 className="font-heading text-lg font-bold text-stone-900 sm:text-xl">{t('aboutCtaTitle')}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-stone-700">{t('aboutCtaText')}</p>
        <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a
            href={getWhatsAppUrl(buildGreeting(lang))}
            onClick={() => trackWhatsAppClick('about_page')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>{t('askUsOnWhatsApp')}</span>
          </a>
          <a href={getPhoneUrl()} onClick={() => trackCallClick('about_page', shop.primaryPhone)} className="btn btn-secondary">
            <PhoneIcon className="h-4 w-4" />
            <span>{t('callUs')}</span>
          </a>
          <Link to={href('/catalog')} className="btn btn-secondary">
            <span>{t('heroBrowseCatalog')}</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {photoIndex !== null && (
        <ImageLightbox
          images={shopPhotos.map((photo) => photo.src)}
          startIndex={photoIndex}
          alt={t('aboutPhotoAlt', { name: shop.name })}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </>
  )
}
