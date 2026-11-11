import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/useLanguage'
import { buildContactMessage } from '../i18n/whatsappMessages'
import { getWhatsAppUrl, shop } from '../data/site'
import { trackFormSubmit } from '../utils/analytics'
import { WhatsAppIcon, CheckCircleIcon, InfoIcon, CloseIcon } from './Icons'

const hasFormspree = Boolean(shop.formspreeUrl?.trim())
const EMPTY_FORM = { name: '', phone: '', message: '' }
const FIELD_ORDER = ['name', 'phone', 'message']

const fieldClass = (invalid) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-500 outline-none focus:ring-1 ${
    invalid
      ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
      : 'border-stone-200 focus:border-amber-600 focus:ring-amber-600'
  }`

/** Returns { field: translationKey } for every invalid field. */
function validate({ name, phone, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'fieldRequired'
  if (!phone.trim()) errors.phone = 'fieldRequired'
  // Standard 10-digit Indian mobile number
  else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) errors.phone = 'invalidPhone'
  if (!message.trim()) errors.message = 'fieldRequired'
  return errors
}

export default function ContactForm() {
  const { t, lang } = useLanguage()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({}) // { name?: key, phone?: key, message?: key }
  const [status, setStatus] = useState(null) // { type: 'success'|'error', message: string, canWhatsApp?: boolean }
  const [submitting, setSubmitting] = useState(false)
  const [lastSubmitted, setLastSubmitted] = useState(null)
  const clearTimerRef = useRef(null)
  const fieldRefs = { name: useRef(null), phone: useRef(null), message: useRef(null) }

  // Auto-clear success banner after 8 s
  useEffect(() => {
    if (status?.type === 'success') {
      clearTimerRef.current = setTimeout(() => setStatus(null), 8000)
    }
    return () => clearTimeout(clearTimerRef.current)
  }, [status])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    // Clear a field's error as soon as the visitor edits it.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleWhatsAppRedirect = (data = form) => {
    trackFormSubmit('whatsapp_redirect')
    window.open(getWhatsAppUrl(buildContactMessage(lang, data)), '_blank', 'noopener,noreferrer')
  }

  const submitToFormspree = async (e) => {
    e.preventDefault()
    setStatus(null)

    const validationErrors = validate(form)
    setErrors(validationErrors)
    const firstInvalid = FIELD_ORDER.find((field) => validationErrors[field])
    if (firstInvalid) {
      fieldRefs[firstInvalid].current?.focus()
      return
    }

    const clean = { name: form.name.trim(), phone: form.phone.trim(), message: form.message.trim() }

    const endpoint = shop.formspreeUrl?.trim()
    if (!endpoint) {
      // Direct WhatsApp compose fallback
      handleWhatsAppRedirect(clean)
      setStatus({ type: 'success', message: t('contactWhatsAppOpening') })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(clean),
      })

      if (res.ok) {
        trackFormSubmit('success')
        setLastSubmitted(clean)
        setStatus({ type: 'success', message: t('submissionSuccess'), canWhatsApp: true })
        setForm(EMPTY_FORM)
      } else {
        trackFormSubmit('failure')
        setStatus({ type: 'error', message: t('contactFormServiceError'), canWhatsApp: true })
      }
    } catch {
      trackFormSubmit('failure')
      setStatus({ type: 'error', message: t('contactNetworkError'), canWhatsApp: true })
    } finally {
      setSubmitting(false)
    }
  }

  /** Props that wire a field to its visible error message for assistive tech. */
  const errorProps = (field) =>
    errors[field] ? { 'aria-invalid': true, 'aria-describedby': `cf-${field}-error` } : { 'aria-invalid': false }

  const errorMessage = (field) =>
    errors[field] && (
      <p id={`cf-${field}-error`} className="mt-1 text-xs font-semibold text-red-700">
        {t(errors[field])}
      </p>
    )

  return (
    <form
      onSubmit={submitToFormspree}
      noValidate
      className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7 shadow-xs"
    >
      <div>
        <h2 className="font-heading text-lg font-bold text-stone-900">{t('sendEnquiry')}</h2>
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
              className="-m-2 ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center opacity-70 hover:opacity-100 transition cursor-pointer"
              aria-label={t('dismiss')}
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {status.canWhatsApp && (
            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleWhatsAppRedirect(lastSubmitted || form)}
                className="btn btn-whatsapp px-4 text-xs"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>{status.type === 'success' ? t('alsoOnWhatsApp') : t('sendViaWhatsAppInstead')}</span>
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
          ref={fieldRefs.name}
          id="cf-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          placeholder={t('contactNamePlaceholder')}
          className={fieldClass(errors.name)}
          required
          disabled={submitting}
          {...errorProps('name')}
        />
        {errorMessage('name')}
      </div>

      <div>
        <label htmlFor="cf-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
          {t('phoneNumber')}
        </label>
        <input
          ref={fieldRefs.phone}
          id="cf-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={t('contactPhonePlaceholder')}
          className={fieldClass(errors.phone)}
          required
          disabled={submitting}
          {...errorProps('phone')}
        />
        {errorMessage('phone')}
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
          {t('messageLabel')}
        </label>
        <textarea
          ref={fieldRefs.message}
          id="cf-message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className={`${fieldClass(errors.message)} resize-none`}
          required
          disabled={submitting}
          {...errorProps('message')}
        />
        {errorMessage('message')}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn btn-primary min-w-36 px-6">
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
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
        <p className="text-xs text-stone-600">
          {t('orCall')} <strong className="font-bold text-stone-800">+91 {shop.primaryPhone}</strong>
        </p>
      </div>

      {!hasFormspree && (
        <p className="text-[11px] text-stone-600 leading-relaxed">{t('whatsappPrefillHint')}</p>
      )}
    </form>
  )
}
