import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { imagetools } from 'vite-imagetools'
import { locales } from './src/i18n/allLocales.js'

// A web app manifest has a single description, so it carries the tagline in all three site languages.
const manifestDescription = ['en', 'mr', 'hi'].map((lang) => locales[lang].ui.heroTagline).join(' · ')

/**
 * Emits spa.html — a copy of the built, still-empty index.html — during the client build, so the
 * service worker can precache it as the offline fallback (scripts/prerender.js later fills
 * index.html with the English home page).
 */
function emitAppShell() {
  return {
    name: 'jbe-emit-app-shell',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const indexHtml = bundle['index.html']
      if (indexHtml?.type === 'asset') {
        this.emitFile({ type: 'asset', fileName: 'spa.html', source: indexHtml.source })
      }
    },
  }
}

// The server build (`vite build --ssr src/entry-server.jsx`, used only by scripts/prerender.js
// to turn each page into HTML) skips the PWA plugin and gets a stub for its browser-only module.
export default defineConfig(({ isSsrBuild }) => ({
  resolve: isSsrBuild
    ? { alias: { 'virtual:pwa-register/react': fileURLToPath(new URL('./src/utils/pwaRegisterStub.js', import.meta.url)) } }
    : undefined,
  plugins: [
    react(),
    tailwindcss(),
    imagetools({ removeMetadata: true }),
    !isSsrBuild && emitAppShell(),
    !isSsrBuild && VitePWA({
      // 'prompt': a new version waits until the visitor taps "Refresh" (UpdatePrompt component),
      // instead of reloading the page mid-visit. Registration happens in UpdatePrompt.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png',
        'robots.txt',
      ],
      manifest: {
        name: 'Jai Baba Electronic',
        short_name: 'Jai Baba',
        description: manifestDescription,
        lang: 'en',
        dir: 'ltr',
        theme_color: '#d97706',
        background_color: '#fafaf9',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['shopping', 'business'],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        // Pages are pre-rendered per route and language, so they are not precached (and must not
        // all be answered with index.html, which is now the English home page). Only the empty
        // app shell is precached, as the offline fallback for pages never visited.
        globPatterns: ['**/*.{js,css,ico,svg}', 'spa.html'],
        // Marathi / Hindi strings are cached when first used, not downloaded by every visitor.
        globIgnores: ['**/assets/mr-*.js', '**/assets/hi-*.js'],
        navigateFallback: null,
        runtimeCaching: [
          {
            // Pages: always try the network (fresh, pre-rendered HTML); offline, use the copy from
            // an earlier visit, or the app shell, which renders any page in the browser.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 60 },
              precacheFallback: { fallbackURL: '/spa.html' },
            },
          },
          {
            urlPattern: /\/assets\/(?:mr|hi)-[\w-]+\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'locale-cache',
              expiration: { maxEntries: 6 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|webp|avif|gif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'catalog-images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Self-hosted fonts: cached on first use. Not precached, so English-only visitors
            // never download the Devanagari font in the background.
            urlPattern: /\.woff2$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
}))

