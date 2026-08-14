import { useLanguage } from '../context/LanguageContext'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
]

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5 text-xs font-semibold">
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLang(item.code)}
          className={`rounded-md px-2 py-1 transition cursor-pointer ${
            lang === item.code
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
          aria-label={`Switch language to ${item.label}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
