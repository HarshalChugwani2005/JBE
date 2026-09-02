/**
 * PageSkeleton — route-aware shimmer placeholder shown while lazy pages load.
 *
 * Reads window.location.pathname to pick the closest matching layout so the
 * skeleton matches the real page's grid shape and reduces layout shift.
 */

/** Reusable shimmer block */
function Bone({ className = '' }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} aria-hidden="true" />
}

/** Single category card skeleton (matches CategoryCard layout) */
function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
      {/* Image area */}
      <Bone className="aspect-[4/3] w-full rounded-none" />
      {/* Text area */}
      <div className="p-5 space-y-2.5">
        <Bone className="h-5 w-3/4" />
        <Bone className="h-3.5 w-1/2" />
        <Bone className="mt-3 h-3 w-2/3" />
      </div>
    </div>
  )
}

/** Single product card skeleton (matches ProductCard layout) */
function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
      <Bone className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Bone className="h-5 w-2/3" />
        <Bone className="h-3.5 w-1/3" />
      </div>
      <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-stone-100">
        <Bone className="h-3.5 w-20" />
        <Bone className="h-7 w-24 rounded-lg" />
      </div>
    </div>
  )
}

/** Catalog page skeleton — header + filter bar + 3-col grid */
function CatalogSkeleton() {
  return (
    <div>
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-8 space-y-3">
        <Bone className="h-9 w-56" />
        <Bone className="h-4 w-80" />
      </div>

      {/* Filter bar */}
      <div className="mt-8 flex flex-wrap gap-3 items-center">
        <Bone className="h-10 flex-1 min-w-48 max-w-sm rounded-xl" />
        <Bone className="h-10 w-36 rounded-xl" />
        <Bone className="h-10 w-28 rounded-xl" />
        <Bone className="ml-auto h-4 w-24" />
      </div>

      {/* Grid */}
      <div className="mt-10">
        <div className="mb-6 space-y-1.5">
          <Bone className="h-6 w-32" />
          <Bone className="h-3.5 w-48" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }, (_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Category page skeleton — breadcrumb + filter + product grid per brand */
function CategoryPageSkeleton() {
  return (
    <div>
      {/* Breadcrumb */}
      <Bone className="h-4 w-28" />
      <Bone className="mt-3 h-9 w-56" />

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap gap-3 items-center">
        <Bone className="h-10 flex-1 min-w-48 max-w-sm rounded-xl" />
        <Bone className="h-10 w-36 rounded-xl" />
        <Bone className="h-10 w-28 rounded-xl" />
      </div>

      {/* Brand section */}
      <div className="mt-10">
        <div className="flex items-center gap-3 border-b border-stone-200/80 pb-3">
          <Bone className="h-7 w-24" />
          <Bone className="h-4 w-32" />
          <Bone className="h-6 w-28 rounded-full" />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Contact page skeleton — map + details card + form */
function ContactSkeleton() {
  return (
    <div>
      <Bone className="h-9 w-44" />
      <Bone className="mt-2 h-4 w-72" />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Map placeholder */}
        <Bone className="h-64 w-full rounded-2xl lg:h-80" />

        {/* Details + form */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 space-y-3">
            <Bone className="h-5 w-36" />
            <Bone className="h-4 w-48" />
            <Bone className="h-4 w-32" />
            <Bone className="mt-4 h-px w-full rounded-none bg-stone-100" />
            <Bone className="h-3 w-28" />
            <div className="flex gap-2 flex-wrap pt-1">
              <Bone className="h-9 w-36 rounded-xl" />
              <Bone className="h-9 w-36 rounded-xl" />
            </div>
            <div className="flex gap-3 flex-wrap pt-1">
              <Bone className="h-11 w-40 rounded-xl" />
              <Bone className="h-11 w-44 rounded-xl" />
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 space-y-4">
            <Bone className="h-5 w-32" />
            <Bone className="h-10 w-full rounded-xl" />
            <Bone className="h-10 w-full rounded-xl" />
            <Bone className="h-24 w-full rounded-xl" />
            <div className="flex items-center justify-between pt-1">
              <Bone className="h-11 w-36 rounded-xl" />
              <Bone className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Generic spinner fallback (Home page loads eagerly so this rarely shows) */
function SpinnerFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
    </div>
  )
}

/** Route-aware entry point used as the Suspense fallback in App.jsx */
export default function PageSkeleton() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  if (path === '/contact') return <ContactSkeleton />

  // /catalog/:category/* — product grid skeleton
  const catalogMatch = path.match(/^\/catalog\/([^/]+)/)
  if (catalogMatch) return <CategoryPageSkeleton />

  // /catalog (index)
  if (path === '/catalog') return <CatalogSkeleton />

  return <SpinnerFallback />
}
