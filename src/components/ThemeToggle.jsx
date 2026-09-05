import { useTheme } from '../context/useTheme'
import { MoonIcon, SunIcon } from './Icons'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition duration-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 cursor-pointer dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-amber-400 dark:hover:bg-stone-700"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="transition-transform duration-200 transform active:rotate-45" aria-hidden="true">
        {isDark ? <SunIcon className="h-4 w-4 text-amber-500" /> : <MoonIcon className="h-4 w-4 text-stone-600" />}
      </span>
    </button>
  )
}
