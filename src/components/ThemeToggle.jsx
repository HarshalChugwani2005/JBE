import { useTheme } from '../context/useTheme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200/90 bg-stone-50/80 text-stone-700 transition duration-200 hover:border-amber-400 hover:bg-amber-50/90 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 cursor-pointer dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-300 dark:hover:border-amber-400 dark:hover:bg-stone-700"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-sm transition-transform duration-300 transform active:rotate-45" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
