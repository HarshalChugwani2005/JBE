/**
 * Stand-in for `virtual:pwa-register/react` in the server (pre-render) build, where the PWA
 * plugin does not run. UpdatePrompt is never rendered on the server; this only lets it bundle.
 */
export function useRegisterSW() {
  return {
    needRefresh: [false, () => {}],
    offlineReady: [false, () => {}],
    updateServiceWorker: async () => {},
  }
}
