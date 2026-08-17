import { useEffect, useState } from 'react'
import { translations } from '../i18n/translations'
import { LanguageContext } from './LanguageContext.js'

const LANG_STORAGE_KEY = 'jbe_lang_pref'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
      document.documentElement.lang = lang
    } catch (e) {
      console.error('Failed to save language preference:', e)
    }
  }, [lang])

  const t = (key) => {
    const dict = translations[lang] || translations.en
    return dict[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
