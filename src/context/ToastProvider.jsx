import { useCallback, useState } from 'react'
import { ToastContext } from './ToastContext'
import { CheckIcon, InfoIcon } from '../components/Icons'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-stone-700 bg-stone-900 px-4 py-2.5 text-xs font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-2"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {toast.type === 'success' ? <CheckIcon className="h-3 w-3" /> : <InfoIcon className="h-3 w-3" />}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
