import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/useLanguage'
import { getWhatsAppUrl, shop } from '../data/site'
import { trackFormSubmit } from '../utils/analytics'
import { WhatsAppIcon, CheckCircleIcon, InfoIcon, CloseIcon } from './Icons'

const hasFormspree = Boolean(shop.formspreeUrl?.trim())

export default function ContactForm() {
  const { t } = useLanguage()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)   // { type: 'success'|'error', message: string, canWhatsApp?: boolean }
  const [submitting, setSubmitting] = useState(false)
  const [lastSubmitted, setLastSubmitted] = useState(null)
  const clearTimerRef = useRef(null)

  // Auto-clear success banner after 8 s
  useEffect(() => {
    if (status?.type === 'success') {
      clearTimerRef.current = setTimeout(() => setStatus(null), 8000)
    }
    return () => clearTimeout(clearTimerRef.current)
  }, [status])

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  const getWhatsAppMessage = (data = form) => {
    return [
      `JAI BABA ELECTRONIC — DIRECT ENQUIRY`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Customer Name: ${data.name || 'Not provided'}`,
      `Phone Number: ${data.phone || 'Not provided'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Requirement / Message:`,
      data.message || '',
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `"Looking forward to hearing from you soon. Thank you!"`,
    ].join('\n')
  }

  const handleWhatsAppRedirect = (data = form) => {
    trackFormSubmit('whatsapp_redirect')
    window.open(getWhatsAppUrl(getWhatsAppMessage(data)), '_blank', 'noopener,noreferrer')
  }

  const submitToFormspree = async (e) => {
    e.preventDefault()
    setStatus(null)

    const cleanName = form.name.trim()
    const cleanPhone = form.phone.trim()
    const cleanMessage = form.message.trim()

    if (!cleanName || !cleanPhone || !cleanMessage) {
      setStatus({ type: 'error', message: t('fillAllFields') })
      return
    }

    // Phone sanity check (standard 10-digit Indian mobile)
    const digitsOnly = cleanPhone.replace(/\D/g, '')
    if (digitsOnly.length < 10) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid 10-digit mobile number.',
      })
      return
    }

    const endpoint = shop.formspreeUrl?.trim()
    if (!endpoint) {
      // Direct WhatsApp compose fallback
      handleWhatsAppRedirect({ name: cleanName, phone: cleanPhone, message: cleanMessage })
      setStatus({ type: 'success', message: 'Opening WhatsApp with your enquiry…' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: cleanName, phone: cleanPhone, message: cleanMessage }),
      })

      if (res.ok) {
        trackFormSubmit('success')
        setLastSubmitted({ name: cleanName, phone: cleanPhone, message: cleanMessage })
        setStatus({
          type: 'success',
          message: t('submissionSuccess'),
          canWhatsApp: true,
        })
        setForm({ name: '', phone: '', message: '' })
      } else {
        trackFormSubmit('failure')
        setStatus({
          type: 'error',
          message: 'Could not send via form service. You can send directly via WhatsApp instead.',
          canWhatsApp: true,
        })
      }
    } catch {
      trackFormSubmit('failure')
      setStatus({
        type: 'error',
        message: `Network error. You can send your enquiry directly via WhatsApp.`,
        canWhatsApp: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submitToFormspree} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs">
      <div>
        <h3 className="font-heading text-lg font-bold text-stone-900">{t('sendEnquiry')}</h3>
        <p className="text-xs text-stone-500 mt-0.5">{t('sendEnquirySubtitle')}</p>
      </div>

      {/* Status banner */}
      {status && (
        <div
          role="alert"
          className={`flex flex-col gap-2 rounded-xl p-3.5 text-xs font-semibold border transition-all duration-200 ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <span className="shrink-0 mt-0.5">
              {status.type === 'success' ? (
                <CheckCircleIcon className="h-4 w-4 text-emerald-700" />
              ) : (
                <InfoIcon className="h-4 w-4 text-amber-700" />
              )}
            </span>
            <div className="flex-1">
              <p className="leading-snug">{status.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setStatus(null)}
              className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition cursor-pointer p-0.5"
              aria-label="Dismiss"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {status.canWhatsApp && (
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleWhatsAppRedirect(lastSubmitted || form)}
                className="btn-whatsapp inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white shadow-xs"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>
                  {status.type === 'success'
                    ? 'Also message on WhatsApp'
                    : 'Send via WhatsApp instead'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        <label htmlFor="cf-name" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
          {t('yourName')}
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          required
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="cf-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
          {t('phoneNumber')}
        </label>
        <input
          id="cf-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          required
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
          {t('messageLabel')}
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none resize-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          required
          disabled={submitting}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 active:scale-[0.99] cursor-pointer min-w-36"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {t('submitting')}
            </>
          ) : hasFormspree ? (
            t('submitEnquiry')
          ) : (
            <>
              <WhatsAppIcon className="h-4 w-4" />
              {t('sendViaWhatsApp')}
            </>
          )}
        </button>
        <p className="text-xs text-stone-500">
          Or call: <strong className="font-bold text-stone-800">+91 {shop.primaryPhone}</strong>
        </p>
      </div>

      {!hasFormspree && (
        <p className="text-[11px] text-stone-400 leading-relaxed">
          Clicking the button will open WhatsApp with your message pre-filled.
        </p>
      )}
    </form>
  )
}

