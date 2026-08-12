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
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#1fb855]"
              >
                Chat on WhatsApp
              </a>
              <a
                href={getPhoneUrl()}
                className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Call Us
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
