import ContactForm from '../components/ContactForm'

export default function Contact() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
      <p className="mt-2 text-gray-600">
        Buldana Road, Malkapur — map, hours, and form coming on Day 4.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-8 text-center text-sm text-gray-500">
          Google Maps embed stub
        </div>
        <ContactForm />
      </div>
    </div>
  )
}
