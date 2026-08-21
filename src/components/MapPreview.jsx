import { Link } from 'react-router-dom'
import { shop } from '../data/site'

export default function MapPreview({ compact = false }) {
  return (
    <div className={`glass-card overflow-hidden rounded-2xl shadow-[0_2px_12px_-3px_rgba(0,0,0,0.05)] ${compact ? '' : 'grid gap-0 md:grid-cols-5'}`}>
      <div className={compact ? 'aspect-[16/9] w-full' : 'relative min-h-[220px] md:col-span-3 md:min-h-[280px]'}>
        <iframe
          title="Jai Baba Electronic location on Google Maps"
          src={shop.mapEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className={`flex flex-col justify-center p-6 sm:p-7 ${compact ? '' : 'md:col-span-2'}`}>
        <h3 className="font-heading text-lg font-bold text-stone-900">Visit Our Shop</h3>
        <p className="mt-2 text-sm text-stone-600 font-medium">{shop.address}</p>
        <p className="text-sm text-stone-600 font-medium">{shop.city}</p>
        <p className="mt-3 text-xs font-semibold text-amber-800/90">{shop.hours}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href={shop.mapDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center rounded-xl border border-stone-200 bg-stone-50/90 px-4 py-2 text-xs font-bold text-stone-800 transition duration-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900"
          >
            Get Directions ↗
          </a>
          <Link
            to="/contact"
            className="inline-flex min-h-10 items-center rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition duration-200 hover:bg-amber-700 shadow-xs"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
