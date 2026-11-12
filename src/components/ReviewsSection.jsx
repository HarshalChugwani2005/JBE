import { useLanguage } from '../context/useLanguage'
import { reviews } from '../data/reviews'
import { shop } from '../data/site'
import Section from './Section'

function Stars({ rating }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <p className="text-amber-500" aria-label={`${full} / 5`}>
      <span aria-hidden="true">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>
    </p>
  )
}

/**
 * Real customer reviews (src/data/reviews.js) plus a "Review us on Google" link.
 * Renders nothing until the shop adds reviews or its Google review link (shop.googleReviewUrl).
 */
export default function ReviewsSection() {
  const { t } = useLanguage()
  if (reviews.length === 0 && !shop.googleReviewUrl) return null

  return (
    <Section title={t('reviewsTitle')} subtitle={t('reviewsSubtitle')}>
      {reviews.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <li key={`${review.name}-${index}`} className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
              {review.rating ? <Stars rating={review.rating} /> : null}
              {/* Shown exactly as the customer wrote it, in their language. */}
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-stone-700">“{review.text}”</blockquote>
              <p className="mt-4 text-xs font-semibold text-stone-900">
                {review.name}
                {review.source && <span className="font-normal text-stone-500"> · {review.source}</span>}
              </p>
            </li>
          ))}
        </ul>
      )}
      {shop.googleReviewUrl && (
        <a
          href={shop.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-secondary ${reviews.length ? 'mt-6' : ''}`}
        >
          {t('reviewUsOnGoogle')}
        </a>
      )}
    </Section>
  )
}
