import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { translate, translateCategory } from '../i18n/format'
import { langFromPath, stripLang, withLang } from '../i18n/paths'
import { translateProductText } from '../i18n/productText'
import { DEFAULT_LANG, SUPPORTED_LANGS, isLocaleLoaded, loadLocale } from '../i18n/registry'
import { LanguageContext } from './LanguageContext.js'

const LANG_STORAGE_KEY = 'jbe_lang_pref'

function readStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    return SUPPORTED_LANGS.includes(stored) ? stored : null
  } catch {
    return null
  }
}

function storeLang(lang) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  } catch {
    // Storage can be unavailable (private mode); the URL still carries the language.
  }
}

/**
 * The language comes from the URL (/mr/…, /hi/…, unprefixed = English), so every language
 * has its own crawlable, shareable address. Must be rendered inside the router.
 */
export function LanguageProvider({ children }) {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()
  const urlLang = langFromPath(pathname)

  // The language actually rendered: the URL language once its strings are in memory.
  // main.jsx preloads the URL language before the first render, so this normally equals urlLang.
  const [lang, setRenderedLang] = useState(() => (isLocaleLoaded(urlLang) ? urlLang : DEFAULT_LANG))

  useEffect(() => {
    let cancelled = false
    loadLocale(urlLang).then(() => {
      if (!cancelled) setRenderedLang(urlLang)
    })
    return () => {
      cancelled = true
    }
  }, [urlLang])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // First visit to an English URL: honour a Marathi / Hindi choice saved on an earlier visit.
  const checkedSavedChoice = useRef(false)
  useEffect(() => {
    if (checkedSavedChoice.current) return
    checkedSavedChoice.current = true
    const saved = readStoredLang()
    if (saved && saved !== DEFAULT_LANG && urlLang === DEFAULT_LANG) {
      loadLocale(saved).then(() => navigate(withLang(saved, stripLang(pathname)) + search + hash, { replace: true }))
    }
  }, [urlLang, pathname, search, hash, navigate])

  /** Switch language: load its strings first, then open the same page under the new prefix. */
  const setLang = useCallback(
    async (next) => {
      storeLang(next)
      await loadLocale(next)
      navigate(withLang(next, stripLang(pathname)) + search + hash)
    },
    [navigate, pathname, search, hash],
  )

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang])
  const tCategory = useCallback((slug, fallback) => translateCategory(lang, slug, fallback), [lang])
  // Catalog data (specs, colours, taglines, warranty) for display; the stored value stays English.
  const tProduct = useCallback((text) => translateProductText(lang, text), [lang])
  /** Internal link in the current URL language: href('/catalog') → '/mr/catalog' on Marathi pages. */
  const href = useCallback((path) => withLang(urlLang, path), [urlLang])

  const value = useMemo(
    () => ({ lang, setLang, t, tCategory, tProduct, href }),
    [lang, setLang, t, tCategory, tProduct, href],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
