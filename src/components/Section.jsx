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
            <h2 className="font-heading text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
              <span className="section-heading-animated">{title}</span>
            </h2>
          )}
          {subtitle && (
            <p className="mt-3 max-w-2xl text-base text-stone-600 animate-slide-in-up" style={{animationDelay:'0.1s'}}>{subtitle}</p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}
