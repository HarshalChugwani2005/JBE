import { Link } from 'react-router-dom'
import { shop } from '../data/site'

export default function MapPreview({ compact = false }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm ${compact ? '' : 'grid gap-0 md:grid-cols-5'}`}>
      <div className={compact ? 'aspect-[16/9] w-full' : 'relative min-h-[200px] md:col-span-3 md:min-h-[260px]'}>
        <iframe
          title="Jai Baba Electronic location on Google Maps"
          src={shop.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className={`flex flex-col justify-center p-5 ${compact ? '' : 'md:col-span-2 md:p-6'}`}>
        <h3 className="font-semibold text-stone-900">Visit Our Shop</h3>
        <p className="mt-2 text-sm text-stone-600">{shop.address}</p>
        <p className="text-sm text-stone-600">{shop.city}</p>
        <p className="mt-3 text-sm text-stone-500">{shop.hours}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={shop.mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-amber-400 hover:text-amber-800"
          >
            Get Directions
          </a>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
