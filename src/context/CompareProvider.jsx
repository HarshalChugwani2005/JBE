import { useCallback, useEffect, useMemo, useState } from 'react'
import { COMPARE_MAX, findModel, sameEntry, sanitizeCompareList, toggleCompareEntry } from '../utils/compare'
import { slugify } from '../utils/slugify'
import { CompareContext } from './CompareContext.js'
import { useLanguage } from './useLanguage'
import { useToast } from './useToast'

const STORAGE_KEY = 'jbe_compare_v1'

/**
 * The models picked for comparison (one category, up to 3), kept in localStorage.
 * Like the enquiry list it starts empty so pre-rendered HTML and the first browser render match,
 * and the saved list is restored right after mount (`restored` tells pages when it is ready).
 */
export function CompareProvider({ children }) {
  const { t, tCategory } = useLanguage()
  const { showToast } = useToast()
  const [list, setList] = useState([])
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    try {
      setList(sanitizeCompareList(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')))
    } catch {
      // Unreadable storage: start with an empty comparison.
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      // Storage full or blocked: the comparison still works for this visit.
    }
  }, [list, restored])

  const isCompared = useCallback(
    (categorySlug, modelName) => list.some((e) => sameEntry(e, { categorySlug, modelSlug: slugify(modelName) })),
    [list],
  )

  /** Adds / removes a model and tells the visitor what happened. */
  const toggleCompare = useCallback(
    (categorySlug, modelName) => {
      const entry = { categorySlug, modelSlug: slugify(modelName) }
      const found = findModel(categorySlug, entry.modelSlug)
      if (!found) return
      const name = `${found.brand.brand} ${found.model.modelName}`
      const { list: next, outcome } = toggleCompareEntry(list, entry)
      setList(next)
      const messages = {
        added: [t('compareAdded', { name }), 'success'],
        removed: [t('compareRemoved', { name }), 'info'],
        replaced: [t('compareReplaced', { category: tCategory(categorySlug, found.category.categoryLabel) }), 'info'],
        full: [t('compareFull', { max: COMPARE_MAX }), 'info'],
      }
      showToast(...messages[outcome])
    },
    [list, showToast, t, tCategory],
  )

  const removeFromCompare = useCallback((entry) => setList((prev) => prev.filter((e) => !sameEntry(e, entry))), [])
  const clearCompare = useCallback(() => setList([]), [])
  /** Replaces the comparison (used when a shared comparison link is opened). */
  const replaceCompare = useCallback((next) => setList(sanitizeCompareList(next)), [])

  // Resolved catalog entries, in the order they were picked.
  const items = useMemo(
    () => list.map((entry) => ({ ...entry, ...findModel(entry.categorySlug, entry.modelSlug) })).filter((item) => item.model),
    [list],
  )

  const value = useMemo(
    () => ({ list, items, restored, isCompared, toggleCompare, removeFromCompare, clearCompare, replaceCompare }),
    [list, items, restored, isCompared, toggleCompare, removeFromCompare, clearCompare, replaceCompare],
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
