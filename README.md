# Jai Baba Electronic

Marketing/catalog website for Jai Baba Electronic, Malkapur. It is enquiry-only: there are no prices, and every call to action leads to WhatsApp, a phone call or the contact form.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

`npm run build` does the following:

1. Regenerates the sitemap and OG images.
2. Builds the browser app (`vite build`).
3. Builds a server bundle (`vite build --ssr src/entry-server.jsx --outDir dist-ssr`).
4. Pre-renders every page in every language to static HTML (`scripts/prerender.js`): `dist/index.html`, `dist/catalog/…`, `dist/mr/…`, `dist/hi/…`.

Each pre-rendered page contains the real content, plus its own title, description, Open Graph tags, canonical URL, `hreflang` alternates and JSON-LD. The browser then *hydrates* it. `dist/spa.html` is the empty app shell, served for unknown URLs (`vercel.json` rewrite) and used by the service worker when offline.

### Pre-rendering rules

The browser's first render must produce exactly the pre-rendered HTML, or React discards it and logs a hydration error.

- **Browser-only values:** don't read `window`, `localStorage`, `navigator` or the screen size while rendering. Read them in `useEffect`; the enquiry list, offline state and search shortcut label all work this way.
- **Phone vs desktop layout:** use CSS breakpoints (`lg:hidden` / `hidden lg:block`), not JavaScript.
- **Filters in the URL** (`?q=`, `?brand=`, …) apply right after hydration (`useCatalogParams`), because pages are pre-rendered without a query string.
- **Portals:** components that render into `<body>` (the product pop-up) only render after mount.
- **First paint:** product photos and scroll reveals are shown immediately in the pre-rendered page (`src/utils/hydration.js`). Anything that mounts later animates as usual.

## Tests and lint

```bash
npm test
npm run lint
```

The test suite covers catalog slug resolution, catalog invariants, WhatsApp message templates, and i18n completeness. The i18n tests check that every English key exists in Marathi and Hindi with the same `{placeholders}`, and that every catalog category has a label in each language.

## Languages (i18n)

The site is available in English (`en`), Marathi (`mr`) and Hindi (`hi`). **The language is part of the URL:**

| Language | Example URL |
| --- | --- |
| English | `/catalog/ceiling-fans` |
| Marathi | `/mr/catalog/ceiling-fans` |
| Hindi | `/hi/catalog/ceiling-fans` |

Each language version is its own crawlable page, with `hreflang` links between them. The language switcher moves to the same page in the other language and remembers the choice. A later visit to an English URL then redirects to that language.

- **UI strings** live in [src/i18n/locales/](src/i18n/locales/): `en.js`, `mr.js` and `hi.js`. Add a key to all three; `npm test` fails if one is missing. English is bundled with the app. Marathi and Hindi are separate files, loaded only when that language is opened ([src/i18n/registry.js](src/i18n/registry.js)).
- **Links:** write routes without a prefix and wrap them in `href()`, e.g. `<Link to={href('/catalog')}>`. On Marathi pages this becomes `/mr/catalog`.
- **Usage in components:** `const { t, tCategory, tProduct, href, lang } = useLanguage()`.
  - `t('key')`: translated string, falling back to English.
  - `t('key', { name: 'ZIPSY' })`: replaces `{name}` placeholders.
  - `t('modelCount', { count })`: uses `modelCount_one` / `modelCount_other` when the language defines them.
  - `tCategory(slug, fallback)`: localized category name from `categoryLabels`.
  - `tProduct(text)`: Marathi / Hindi display text for a catalog spec, colour, brand tagline or warranty.
- **Category names:** `categoryLabel` in [src/data/products.js](src/data/products.js) stays the English source of truth. Display names come from [src/i18n/categoryLabels.js](src/i18n/categoryLabels.js).
- **Product text:** specs, colours, taglines and warranty in `products.js` stay English. That is what the shop sees in WhatsApp enquiries, and colour names are matched to product photos. Their translations are the `products` map in `locales/mr.js` and `locales/hi.js`, keyed by the English text. When you add or edit a product, add an entry for every new string to both files; `npm test` lists any that are missing.
- **WhatsApp messages** are templated in [src/i18n/whatsappMessages.js](src/i18n/whatsappMessages.js).
- **Page metadata** (titles, descriptions, JSON-LD) is built by [src/i18n/seo.js](src/i18n/seo.js). Both the runtime `<SEO>` component and `scripts/prerender.js` use it, so the pre-rendered tags match the client-side ones.

## Catalog scripts

| Command | What it does |
| --- | --- |
| `npm run catalog:sync` | Syncs the catalog from a published Google Sheet (set `CATALOG_SHEET_URL`). Incoming rows are validated before the local catalog is overwritten. The expected columns are listed at the top of `scripts/sync-catalog.js`. Stock is not tracked; an `InStock` column is ignored. |
| `npm run catalog:export-wa` | Exports the catalog to `public/whatsapp-catalog.csv` (and `dist/` when built) for import into WhatsApp Business / Meta Commerce Manager. Every item is listed as `available for order`, because stock is quoted on enquiry. |
| `npm run sitemap` | Regenerates `public/sitemap.xml` from the catalog: every page in all three languages, with `hreflang` alternates. |
| `npm run icons:pwa` | Regenerates the PWA icons. |

## UI conventions

- **Page headings:** use `<PageHeader>` (one `<h1>` per page).
- **Empty and status states:** use `<EmptyState>` (`as="h1"` for full status pages such as 404).
- **Breadcrumbs:** use `<Breadcrumbs>`.
- **Buttons:** use the `btn` class plus one of `btn-primary`, `btn-secondary` or `btn-whatsapp`. They are defined in [src/index.css](src/index.css) and meet WCAG AA contrast with a 44px minimum height.
- **Custom CSS** goes inside `@layer components`, so Tailwind utilities on the same element still apply.
- **Fonts** are self-hosted from the `@fontsource-variable/*` packages. The `@font-face` rules at the top of `index.css` declare only the latin subsets plus Devanagari, so English pages never download the Devanagari font. Don't reintroduce a Google Fonts `<link>`: it blocks rendering, and the Content-Security-Policy would block it anyway.
- **Stock:** the site does not show or filter by stock. Availability is part of the WhatsApp enquiry.
- **Site updates:** after a deploy, returning visitors see a "New version available — Refresh" message (`UpdatePrompt`). The page never reloads on its own.

## Security headers

`vercel.json` sends a Content-Security-Policy and other security headers on every response. The policy allows only this site, the Google Maps embed, Formspree, Google Analytics and Sentry. Analytics and Sentry are only contacted when their environment variables are set. If you add a third-party script, font, image host, iframe or API, add its origin to the matching CSP directive, or the browser will block it.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Set the project root to the repository folder.
4. Vercel will use the existing Vite build settings automatically.
5. The contact form opens WhatsApp with the message pre-filled, and is labelled that way. To have it also email the shop, set `VITE_FORMSPREE_URL` or `VITE_FORMSPREE_ID` in Vercel (see [src/data/site.js](src/data/site.js)). The form then switches back to "Send an Enquiry" wording.
6. The live address is `https://jai-baba-electronics.vercel.app`, set as `siteUrl` in `site.js`. If you move to a custom domain, update `siteUrl`, `public/robots.txt` and the URLs in `index.html`, then rebuild to regenerate the sitemap.
7. **Optional services** (Vercel → Project → Settings → Environment Variables, then redeploy). Both are off when empty:
   - `VITE_GA_MEASUREMENT_ID`: Google Analytics 4 (free). WhatsApp and call clicks, enquiry-list actions and contact-form results are sent as GA4 events. Vercel's own custom events are only recorded on the Pro plan.
   - `VITE_SENTRY_DSN`: Sentry crash reporting (free tier). Page crashes and uncaught errors are reported, a few per page view at most. Only the error, the page URL, the browser and the site language are sent.
