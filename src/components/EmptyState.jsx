/**
 * Empty / status message with an icon and call-to-action buttons.
 *
 * - `as="h1"`: full status page (404, category not found, coming soon); uses the page title scale.
 * - default `as="h2"`: an inline card, e.g. when filters match nothing.
 */
export default function EmptyState({ icon: Icon, visual, title, description, children, as: Heading = 'h2', className = '' }) {
  const isPage = Heading === 'h1'

  return (
    <div
      className={`text-center ${
        isPage ? 'py-12 sm:py-16' : 'rounded-2xl border border-stone-200 bg-white px-6 py-10 shadow-xs'
      } ${className}`}
    >
      {visual ??
        (Icon && (
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Icon className="h-7 w-7" />
          </div>
        ))}
      <Heading className={isPage ? 'page-title mt-5' : 'mt-4 font-heading text-lg font-bold text-stone-900'}>
        {title}
      </Heading>
      {description && (
        <p className={`mx-auto max-w-md text-stone-600 ${isPage ? 'page-subtitle' : 'mt-2 text-sm'}`}>{description}</p>
      )}
      {children && (
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">{children}</div>
      )}
    </div>
  )
}
