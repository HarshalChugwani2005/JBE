import ContactForm from '../components/ContactForm'
import MapPreview from '../components/MapPreview'
import SEO from '../components/SEO'
import { shop, getWhatsAppUrl, getPhoneUrl } from '../data/site'

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Visit Jai Baba Electronic on Buldana Road, Malkapur or enquire by WhatsApp, call, or contact form."
      />
      <div>
      <h1 className="font-display text-2xl font-bold text-gray-900">Contact Us</h1>
      <p className="mt-2 text-gray-600">Reach us via WhatsApp, phone, or the form below.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <MapPreview />

        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="font-semibold text-gray-900">Contact Details</h2>
            <p className="mt-2 text-sm text-gray-600">{shop.address}</p>
            <p className="text-sm text-gray-600">{shop.city}</p>
            <p className="mt-2 text-sm text-gray-500">{shop.hours}</p>

            <div className="mt-4 border-t border-stone-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Available Numbers</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {shop.phoneNumbers.map((num) => (
                  <a
                    key={num}
                    href={getPhoneUrl(num)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-800 transition hover:border-amber-400 hover:bg-amber-50"
                  >
                    📞 +91 {num}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1fb855]"
              >
                Chat on WhatsApp
              </a>
              <a
                href={getPhoneUrl()}
                className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50"
              >
                Call Primary ({shop.primaryPhone})
              </a>
            </div>
          </div>

          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
