export default function Section({
  id,
  title,
  subtitle,
  children,
  className = '',
  headerClassName = '',
}) {
  return (
    <section id={id} className={`py-10 md:py-14 ${className}`}>
      {(title || subtitle) && (
        <header className={`mb-6 md:mb-8 ${headerClassName}`}>
          {title && (
            <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 max-w-2xl text-base text-stone-600">{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}
