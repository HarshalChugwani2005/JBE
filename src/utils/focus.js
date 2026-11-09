const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Returns all focusable elements inside a container element.
 * Used by modal and drawer components for focus-trap implementation.
 *
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
export function getFocusableElements(container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR))
}

/**
 * Keeps Tab / Shift+Tab focus cycling inside `container`.
 * Call from a keydown handler; it ignores every other key.
 *
 * @param {KeyboardEvent} event
 * @param {HTMLElement | null} container
 */
export function trapTabKey(event, container) {
  if (event.key !== 'Tab' || !container) return

  const focusableElements = getFocusableElements(container)
  if (focusableElements.length === 0) {
    event.preventDefault()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  const focusIsOutside = !container.contains(document.activeElement)

  if (event.shiftKey && (document.activeElement === firstElement || focusIsOutside)) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && (document.activeElement === lastElement || focusIsOutside)) {
    event.preventDefault()
    firstElement.focus()
  }
}
