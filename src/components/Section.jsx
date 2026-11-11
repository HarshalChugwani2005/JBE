import RevealOnScroll from './RevealOnScroll'

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
        // The reveal wrapper fades the header in and draws the title's accent underline
        // (.reveal-on-scroll--visible .section-heading-animated::after).
        <RevealOnScroll className={`mb-6 md:mb-8 ${headerClassName}`}>
          <header>
            {title && (
              <h2 className="font-heading text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                <span className="section-heading-animated">{title}</span>
              </h2>
            )}
            {subtitle && <p className="mt-3 max-w-2xl text-base text-stone-600">{subtitle}</p>}
          </header>
        </RevealOnScroll>
      )}
      {children}
    </section>
  )
}
