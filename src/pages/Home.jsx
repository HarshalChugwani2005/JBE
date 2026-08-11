import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import MapPreview from '../components/MapPreview'
import Section from '../components/Section'
import SEO from '../components/SEO'
import { categories } from '../data/products'
import { featuredCategorySlugs, getWhatsAppUrl, shop } from '../data/site'

export default function Home() {
  const featured = featuredCategorySlugs
    .map((slug) => categories.find((c) => c.category === slug))
    .filter(Boolean)

  return (
    <>
      <SEO
        title="Home"
        description="Jai Baba Electronic offers ceiling fans, coolers, appliances and more in Malkapur. Browse the catalog and enquire for wholesale or retail pricing."
      />
      <div className="-mx-4">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 px-4 py-14 text-white sm:px-6 md:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-orange-400/20 blur-2xl" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-100">
            Buldana Road, Malkapur
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {shop.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-amber-50">{shop.tagline}</p>
          <p className="mt-2 max-w-lg text-sm text-amber-100/90">
            Browse fans, coolers, kitchen appliances, and more. Contact us for
            prices — wholesale and retail welcome.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/catalog"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-amber-800 shadow-md transition hover:bg-amber-50"
            >
              Browse Catalog
            </Link>
            <a
              href={getWhatsAppUrl()}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1fb855]"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-0">
        {/* Featured Categories */}
        <Section
          title="Featured Categories"
          subtitle="Tap a category to explore models and enquire. More ranges are being added regularly."
        >
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((cat) => (
              <li key={cat.category}>
                <CategoryCard
                  category={cat.category}
                  categoryLabel={cat.categoryLabel}
                  comingSoon={cat.comingSoon}
                  brands={cat.brands}
                />
              </li>
            ))}
          </ul>
          <div className="mt-6 text-center">
            <Link
              to="/catalog"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-amber-700 hover:text-amber-900"
            >
              View all categories →
            </Link>
          </div>
        </Section>

        {/* About */}
        <Section
          title="About Us"
          subtitle="Your neighborhood electronics shop — trusted by homes and dealers across Malkapur."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-stone-900">Wholesale &amp; Retail</h3>
              <p className="mt-3 text-stone-600 leading-relaxed">
                Whether you need a single ceiling fan for your home or bulk stock
                for your shop, Jai Baba Electronic has you covered. We carry
                trusted brands with warranty-backed products — from ceiling fans
                and coolers to kitchen appliances and lighting.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-stone-900">Contact for Price</h3>
              <p className="mt-3 text-stone-600 leading-relaxed">
                We don&apos;t list prices online — every enquiry gets a personal
                quote. Reach out via WhatsApp, call, or visit us on Buldana Road.
                Mention if you&apos;re buying in bulk and we&apos;ll arrange the
                best deal for you.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  730 Days Warranty on select ZIPSY ceiling fans
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  100% Copper Winding — quality you can trust
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  Walk-in shop with friendly, local service
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Map Preview */}
        <Section
          title="Find Us"
          subtitle="Visit our shop on Buldana Road or get directions on Google Maps."
        >
          <MapPreview />
        </Section>
      </div>
    </div>
    </>
  )
}
