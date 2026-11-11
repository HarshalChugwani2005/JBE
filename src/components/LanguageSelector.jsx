import { useLanguage } from '../context/useLanguage'

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'mr', label: 'मराठी', name: 'मराठी' },
  { code: 'hi', label: 'हिंदी', name: 'हिंदी' },
]

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage()

  return (
    <div className="inline-flex items-center rounded-full border border-stone-200/90 bg-stone-100/70 p-1 text-xs font-bold" role="group" aria-label={t('language')}>
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLang(item.code)}
          lang={item.code}
          className={`min-h-8 rounded-full px-2.5 py-1 text-xs transition duration-200 cursor-pointer ${
            lang === item.code
              ? 'bg-amber-700 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
          aria-pressed={lang === item.code}
          aria-label={t('switchLanguage', { language: item.name })}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
