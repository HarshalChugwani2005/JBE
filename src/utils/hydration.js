/**
 * Pages are pre-rendered to HTML at build time and then hydrated in the browser. Content that
 * would normally fade in once JavaScript notices it (product photos, scroll reveals) is shown
 * immediately in that first render, so the pre-rendered HTML is visible before any JS runs and
 * matches the browser's first render. Anything mounted after hydration animates as usual.
 */
let hydrated = false

/** True while rendering on the server and during the browser's first (hydration) render. */
export function isHydrating() {
  return !hydrated
}

/** Called once the app has mounted in the browser (AppShell). */
export function markHydrated() {
  hydrated = true
}
