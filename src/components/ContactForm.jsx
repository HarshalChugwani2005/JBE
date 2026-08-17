import { useState } from 'react'
import { useLanguage } from '../context/useLanguage'
import { getWhatsAppUrl, shop } from '../data/site'
import { trackFormSubmit } from '../utils/analytics'

export default function ContactForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  const submitToFormspree = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (!form.name || !form.phone || !form.message) {
      setStatus({ type: 'error', message: t('fillAllFields') })
      return
    }

    const endpoint = shop.formspreeUrl?.trim()
    if (!endpoint) {
      // Direct WhatsApp compose fallback
      const text = `Hi ${shop.name}, I am ${form.name} (Phone: ${form.phone}).\n\nEnquiry: ${form.message}`
      trackFormSubmit('whatsapp_redirect')
      window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
      setStatus({ type: 'success', message: 'Opening WhatsApp with your enquiry...' })
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
        trackFormSubmit('success')
        setStatus({ type: 'success', message: t('submissionSuccess') })
        setForm({ name: '', phone: '', message: '' })
      } else {
        trackFormSubmit('failure')
        const text = await res.text()
        setStatus({ type: 'error', message: `Submission failed: ${text}` })
      }
    } catch (err) {
      trackFormSubmit('failure')
      setStatus({ type: 'error', message: `Submission error: ${err.message}` })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitToFormspree} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
      <h3 className="text-base font-bold text-stone-900">{t('sendEnquiry')}</h3>
      <p className="text-xs text-stone-500">{t('sendEnquirySubtitle')}</p>

      {status && (
        <div className={`rounded-xl px-4 py-2.5 text-xs font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
          {status.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-stone-700">
          {t('yourName')}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold text-stone-700">
          {t('phoneNumber')}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-stone-700">
          {t('messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60 transition cursor-pointer"
        >
          {submitting ? t('submitting') : shop.formspreeUrl ? t('submitEnquiry') : t('sendViaWhatsApp')}
        </button>
        <p className="text-xs text-stone-500">Or call: <span className="font-semibold text-stone-800">+91 {shop.primaryPhone}</span></p>
      </div>
    </form>
  )
}
