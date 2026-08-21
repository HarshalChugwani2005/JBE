import { useLanguage } from '../context/useLanguage'

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
]

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="inline-flex items-center rounded-full border border-stone-200/90 bg-stone-100/70 p-1 text-xs font-bold">
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => setLang(item.code)}
          className={`rounded-full px-2.5 py-1 text-xs transition duration-200 cursor-pointer ${
            lang === item.code
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
          aria-label={`Switch language to ${item.label}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
