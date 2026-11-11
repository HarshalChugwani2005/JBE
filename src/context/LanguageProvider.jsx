import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LANG, SUPPORTED_LANGS, translate, translateCategory } from '../i18n/format'
import { translateProductText } from '../i18n/productText'
import { LanguageContext } from './LanguageContext.js'

const LANG_STORAGE_KEY = 'jbe_lang_pref'

function readStoredLang() {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    return SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies to this visit.
    }
  }, [lang])

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang])
  const tCategory = useCallback((slug, fallback) => translateCategory(lang, slug, fallback), [lang])
  // Catalog data (specs, colours, taglines, warranty) for display; the stored value stays English.
  const tProduct = useCallback((text) => translateProductText(lang, text), [lang])

  const value = useMemo(() => ({ lang, setLang, t, tCategory, tProduct }), [lang, t, tCategory, tProduct])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
