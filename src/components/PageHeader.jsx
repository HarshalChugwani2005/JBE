/**
 * Standard page header: one <h1> per page with a consistent scale and spacing.
 * `children` render below the subtitle (badges, counts, etc.).
 */
export default function PageHeader({ title, subtitle, children, className = '' }) {
  return (
    <header className={`border-b border-stone-200/80 pb-6 sm:pb-8 ${className}`}>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      {children}
    </header>
  )
}
