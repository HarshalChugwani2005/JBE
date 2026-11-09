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
- **Usage in components:** `const { t, tCategory, lang } = useLanguage()`.
  - `t('key')`: translated string, falling back to English.
  - `t('key', { name: 'ZIPSY' })`: replaces `{name}` placeholders.
  - `t('modelCount', { count })`: uses `modelCount_one` / `modelCount_other` when the language defines them.
  - `tCategory(slug, fallback)`: localized category name from `categoryLabels`.
- **Category names:** `categoryLabel` in [src/data/products.js](src/data/products.js) stays the English source of truth. Display names come from `categoryLabels` in translations.js.
- **WhatsApp messages** are templated in [src/i18n/whatsappMessages.js](src/i18n/whatsappMessages.js).
- **Page metadata** (titles, descriptions, JSON-LD) is built by [src/i18n/seo.js](src/i18n/seo.js). Both the runtime `<SEO>` component and the static-SEO script use it, so the pre-rendered tags match the client-side ones.

## Catalog scripts

| Command | What it does |
| --- | --- |
| `npm run catalog:sync` | Syncs the catalog from a published Google Sheet (set `CATALOG_SHEET_URL`). Incoming rows are validated before the local catalog is overwritten. The expected columns are listed at the top of `scripts/sync-catalog.js`. |
| `npm run catalog:export-wa` | Exports the catalog to `public/whatsapp-catalog.csv` (and `dist/` when built) for import into WhatsApp Business / Meta Commerce Manager. |
| `npm run sitemap` | Regenerates `public/sitemap.xml` from the catalog. |
| `npm run icons:pwa` | Regenerates the PWA icons. |

## UI conventions

- **Page headings:** use `<PageHeader>` (one `<h1>` per page).
- **Empty and status states:** use `<EmptyState>` (`as="h1"` for full status pages such as 404).
- **Breadcrumbs:** use `<Breadcrumbs>`.
- **Buttons:** use the `btn` class plus one of `btn-primary`, `btn-secondary` or `btn-whatsapp`. They are defined in [src/index.css](src/index.css) and meet WCAG AA contrast with a 44px minimum height.
- **Custom CSS** goes inside `@layer components`, so Tailwind utilities on the same element still apply.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo in Vercel.
3. Set the project root to the repository folder.
4. Vercel will use the existing Vite build settings automatically.
5. If you want the contact form to work, set `VITE_FORMSPREE_URL` or `VITE_FORMSPREE_ID` (see [src/data/site.js](src/data/site.js)).
