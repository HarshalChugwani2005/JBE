import { useState } from 'react'
import { shop, getWhatsAppUrl } from '../data/site'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  const submitToFormspree = async (e) => {
    e.preventDefault()
    setStatus(null)

    const endpoint = shop.formspreeUrl?.trim()
    if (!endpoint) {
      // Fallback: If Formspree is not configured, redirect to WhatsApp with composed message
      if (!form.name || !form.phone || !form.message) {
        setStatus({ type: 'error', message: 'Please fill in all fields.' })
        return
      }
      const text = `Hi Jai Baba Electronic, I am ${form.name} (Phone: ${form.phone}).\n\nEnquiry: ${form.message}`
      window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
      setStatus({ type: 'success', message: 'Opening WhatsApp with your enquiry...' })
      return
    }

    if (!form.name || !form.phone || !form.message) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message,
        }),
      })

      if (res.ok) {
        setStatus({ type: 'success', message: 'Thanks — your enquiry was sent successfully!' })
        setForm({ name: '', phone: '', message: '' })
      } else {
        const text = await res.text()
        setStatus({ type: 'error', message: `Submission failed: ${text}` })
      }
    } catch (err) {
      setStatus({ type: 'error', message: `Submission error: ${err.message}` })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitToFormspree} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">Send an Enquiry</h3>
      <p className="text-sm text-gray-500">Send us a message and we'll get back to you shortly.</p>

      {status && (
        <div className={`rounded-md px-4 py-2.5 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message / Required Products
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us what product, brand, or quantity you're looking for..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60 transition"
        >
          {submitting ? 'Sending…' : shop.formspreeUrl ? 'Send Enquiry' : 'Send via WhatsApp'}
        </button>
        <p className="text-xs text-gray-500">Or call us directly at <span className="font-medium text-gray-800">+91 {shop.primaryPhone}</span></p>
      </div>
    </form>
  )
}
