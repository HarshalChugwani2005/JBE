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

`npm run build` regenerates the sitemap and OG images, runs `vite build`, then writes pre-rendered `dist/<route>/index.html` files with route-specific metadata and JSON-LD (`scripts/generate-static-seo.js`).

## Tests and lint

```bash
npm test
npm run lint
```

The test suite covers catalog slug resolution, catalog invariants, WhatsApp message templates, and i18n completeness. The i18n tests check that every English key exists in Marathi and Hindi with the same `{placeholders}`, and that every catalog category has a label in each language.

## Languages (i18n)

The site is available in English (`en`), Marathi (`mr`) and Hindi (`hi`).

- **UI strings** live in [src/i18n/translations.js](src/i18n/translations.js). Add a key to all three languages; `npm test` fails if one is missing.
- **Usage in components:** `const { t, tCategory, tProduct, lang } = useLanguage()`.
  - `t('key')`: translated string, falling back to English.
  - `t('key', { name: 'ZIPSY' })`: replaces `{name}` placeholders.
  - `t('modelCount', { count })`: uses `modelCount_one` / `modelCount_other` when the language defines them.
  - `tCategory(slug, fallback)`: localized category name from `categoryLabels`.
  - `tProduct(text)`: Marathi / Hindi display text for a catalog spec, colour, brand tagline or warranty.
- **Category names:** `categoryLabel` in [src/data/products.js](src/data/products.js) stays the English source of truth. Display names come from `categoryLabels` in translations.js.
- **Product text:** specs, colours, taglines and warranty in `products.js` stay English. That is what the shop sees in WhatsApp enquiries, and colour names are matched to product photos. Their translations live in [src/i18n/productText.js](src/i18n/productText.js) as `[English, Marathi, Hindi]` rows. When you add or edit a product, add a row for every new string; `npm test` lists any that are missing. Search matches all three languages.
- **WhatsApp messages** are templated in [src/i18n/whatsappMessages.js](src/i18n/whatsappMessages.js).
- **Page metadata** (titles, descriptions, JSON-LD) is built by [src/i18n/seo.js](src/i18n/seo.js). Both the runtime `<SEO>` component and the static-SEO script use it, so the pre-rendered tags match the client-side ones.

## Catalog scripts

| Command | What it does |
| --- | --- |
| `npm run catalog:sync` | Syncs the catalog from a published Google Sheet (set `CATALOG_SHEET_URL`). Incoming rows are validated before the local catalog is overwritten. The expected columns are listed at the top of `scripts/sync-catalog.js`. Stock is not tracked; an `InStock` column is ignored. |
| `npm run catalog:export-wa` | Exports the catalog to `public/whatsapp-catalog.csv` (and `dist/` when built) for import into WhatsApp Business / Meta Commerce Manager. Every item is listed as `available for order`, because stock is quoted on enquiry. |
| `npm run sitemap` | Regenerates `public/sitemap.xml` from the catalog. |
| `npm run icons:pwa` | Regenerates the PWA icons. |

## UI conventions

- **Page headings:** use `<PageHeader>` (one `<h1>` per page).
- **Empty and status states:** use `<EmptyState>` (`as="h1"` for full status pages such as 404).
- **Breadcrumbs:** use `<Breadcrumbs>`.
- **Buttons:** use the `btn` class plus one of `btn-primary`, `btn-secondary` or `btn-whatsapp`. They are defined in [src/index.css](src/index.css) and meet WCAG AA contrast with a 44px minimum height.
- **Custom CSS** goes inside `@layer components`, so Tailwind utilities on the same element still apply.
- **Fonts** are self-hosted from the `@fontsource-variable/*` packages. The `@font-face` rules at the top of `index.css` declare only the latin subsets plus Devanagari, so English pages never download the Devanagari font. Don't reintroduce a Google Fonts `<link>`: it blocks rendering, and the Content-Security-Policy would block it anyway.
- **Stock:** the site does not show or filter by stock. Availability is part of the WhatsApp enquiry.

## Security headers

`vercel.json` sends a Content-Security-Policy and other security headers on every response. The policy allows only this site, the Google Maps embed and Formspree. If you add a third-party script, font, image host, iframe or API, add its origin to the matching CSP directive, or the browser will block it.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Set the project root to the repository folder.
4. Vercel will use the existing Vite build settings automatically.
5. The contact form opens WhatsApp with the message pre-filled, and is labelled that way. To have it also email the shop, set `VITE_FORMSPREE_URL` or `VITE_FORMSPREE_ID` in Vercel (see [src/data/site.js](src/data/site.js)). The form then switches back to "Send an Enquiry" wording.
6. The live address is `https://jai-baba-electronics.vercel.app`, set as `siteUrl` in `site.js`. If you move to a custom domain, update `siteUrl`, `public/robots.txt` and the URLs in `index.html`, then rebuild to regenerate the sitemap.
