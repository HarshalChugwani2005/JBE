import { useState } from 'react'
import { shop } from '../data/site'

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
      setStatus({ type: 'error', message: 'Form not configured. Set `shop.formspreeUrl` in src/data/site.js.' })
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message,
        }),
      })

      if (res.ok) {
        setStatus({ type: 'success', message: 'Thanks — your enquiry was sent.' })
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
    <form onSubmit={submitToFormspree} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Send us a message and we'll get back to you shortly.</p>

      {status && (
        <div className={`rounded-md px-4 py-2 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send Enquiry'}
        </button>
        <p className="text-sm text-gray-500">Or contact us at {shop.phone}</p>
      </div>
    </form>
  )
}
