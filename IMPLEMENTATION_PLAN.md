# Implementation Plan — Jai Baba Electronic Website

Consolidated roadmap for turning the current catalog into a polished, fast, and conversion-focused storefront.

## Phase 1 — Fix What’s Broken
- Finish `ProductDetailModal.jsx` so it behaves like a real product viewer.
- Add an image gallery pattern: hero image plus thumbnails when multiple images exist, single image when only one is available.
- Surface model name, brand, key specs, and enquiry actions clearly in the modal.
- Support WhatsApp and call CTAs from the modal using the same contact data used elsewhere in the site.
- Close the modal on backdrop click and `Esc`.
- Add focus trapping and keyboard-friendly controls for accessibility.
- Replace the current image placeholder block in `ProductCard.jsx` with a real `<img>`.
- Keep a graceful fallback only for genuinely missing images, with an icon and "Photo coming soon" state.
- Set up a real image pipeline under `src/assets/images/<category>/`.
- Use a consistent naming convention that matches `products.js`, with `.webp` as the primary format and `.jpg` fallback where needed.
- Prioritize ceiling fans first, since that folder already exists and can unblock the first real gallery pass.

## Phase 2 — Card Polish & Loading States
- Match `ProductCard.jsx` hover and focus behavior to `CategoryCard.jsx`.
- Add translate, shadow, border, and focus-visible ring feedback.
- Add a pure CSS skeleton shimmer while images are loading.
- Animate product images with a subtle scale and opacity transition on hover.
- Make the grid feel more premium without changing the underlying data model.

## Phase 3 — Catalog Search & Filter
- Add a search input and brand filter chips to `/catalog` and `CategoryPage`.
- Keep filtering client-side only, which is appropriate for the current catalog size.
- Persist search and filter state in URL query params so catalog links can be shared.
- Preserve the current route structure while making discovery faster for shoppers.

## Phase 4 — Hero & Typography Pass
- Introduce one accent display font for headings with `@font-face` and `font-display: swap`.
- Add CSS-only hero entrance motion using fade-and-slide behavior with `@starting-style` where supported.
- Give the hero background a subtle animated gradient or texture instead of a flat fill.
- Add scroll-reveal treatment for the category grid and About cards.
- Use `@scroll-timeline` where browser support is acceptable, or a small `IntersectionObserver` hook if broader compatibility is needed.

## Dependencies / Blockers to Watch
- **Product photos for ceiling fans first** — needed to complete the first real modal and card image flow.
- **Then photos for the remaining categories** — can be added incrementally after the ceiling fan pipeline is working.
- **Shop WhatsApp number and phone number** — needed for enquiry CTAs.
- **Brand and model naming consistency** — important for image matching, search filters, and modal data display.

## Phase 5 — Critical Fixes & SEO Foundations

Goal: remove the things quietly capping every other phase — a broken CTA and missing crawl files.

Effort: ~0.5 day · Priority: Do first, blocks nothing else but blocks real users today.

- Split `shop.phone` into `shop.primaryPhone` (single number for `tel:`) and `shop.phoneNumbers` (array for rendering on Contact page).
- Update `getPhoneUrl()` internals to return a `tel:` using `shop.primaryPhone` so call sites need no changes.
- Add `public/robots.txt` (simple allow + sitemap directive).
- Add `public/sitemap.xml` (static for now; regenerate manually or script in Phase 6).
- Confirm `index.html` canonical URL matches production domain (verify after any domain change).
- Smoke-test: `tel:` opens dialer with the primary number; WhatsApp link still works; sitemap validates in Google Search Console.

Definition of done: tapping "Call Us" opens a working dialer; `/robots.txt` and `/sitemap.xml` resolve in production; site submitted to Google Search Console.

## Phase 6 — Content Scalability (Owner Self-Serve)

Goal: the owner can add/edit products without a code deploy.

Effort: ~2–3 days · Priority: High — do before investing more in catalog breadth.

Decision needed from owner first: Google Sheets (lightweight) vs. headless CMS (Sanity). Recommendation: start with Sheets.

6a. Google Sheets path

- Create a shared Google Sheet mirroring the `products.js` schema (category, categoryLabel, brand, tagline, warranty, modelName, specs, colors, image filename, inStock).
- Publish via `opensheet.elk.sh` or a small serverless fetch+cache function.
- Replace static import of `products.js` with a fetch-at-build-time (Vite plugin / prebuild script) so the site remains a static SPA.
- Keep `products.js` as a committed fallback (cached JSON written to disk) so builds don't fail if the Sheet is unreachable.
- Write a one-page "How to add a product" guide for the owner.

6b. Headless CMS path (alternative/future)

- Set up Sanity Studio (or Strapi) with a `product` schema matching `BACKEND_SCHEMA.md`.
- Owner uploads photos directly in the CMS (removes manual `src/assets/images/<category>/` workflow).
- Fetch content at build time via the CMS API + Vite plugin; keep static output.
- Migrate existing `products.js` entries into the CMS with a one-time script.

Definition of done: owner (or a non-developer) can add a new model + photo and see it live after the next scheduled rebuild.

## Phase 7 — Conversion & Growth Features

Goal: convert more browsers into enquiries and extend reach.

Effort: ~3–4 days total, individually shippable. Priority: High-value; do after Phase 6.

- Enquiry cart (~1 day): lightweight cart (React context + `localStorage`) with "Add to enquiry" on cards/modal and a cart drawer; "Send enquiry" opens `wa.me` with the list.
- Stock status flag (~0.5 day): add `inStock: true | false | null` to the schema; badge on card and modal.
- `LocalBusiness` structured data (~0.5 day): add JSON‑LD (name, address, phone, hours, geo) via `SEO.jsx` or `index.html` and validate with Google's Rich Results Test.
- Marathi/Hindi toggle (~1–1.5 days): extract UI copy to `src/i18n/*`, simple `t()` helper, language switcher in `Navbar` persisted in `localStorage` (product data can remain English initially).
- WhatsApp Business Catalog sync (~0.5 day, manual): owner mirrors product list into WhatsApp Business Catalog; optionally link to it from Contact page.

Definition of done: a customer can select 3 products and send one WhatsApp enquiry; stock badges appear; site passes Rich Results Test; UI readable in Marathi.

## Phase 8 — Technical Scalability & Infra

Goal: performance and visibility at scale.

Effort: ~2–3 days · Priority: Medium — schedule after Phase 6.

- Image pipeline migration (~1 day): move photos to Cloudinary/Imgix and update resolver to build CDN URLs with auto-format and responsive `srcset`.
- Analytics & tracking (~0.5 day): add Plausible or GA4 and track `whatsapp_click`, `call_click`, `form_submit`, `enquiry_cart_send`.
- PWA / installable shell (~1 day): `vite-plugin-pwa` for an offline shell and cached data.
- Performance audit (~0.5 day): Lighthouse targets (Performance ≥ 85, SEO/Accessibility ≥ 90) after Phase 6–8.

Definition of done: Lighthouse mobile Performance ≥ 85, SEO/Accessibility ≥ 90; analytics show CTA clicks; site installable on Android.

## Sequencing Summary

Phase | Focus | Effort | Depends on
---|---:|---:|---
5 | Fix phone bug, robots/sitemap | 0.5 day | —
6 | Owner self-serve content (Sheets/CMS) | 2–3 days | Phase 5 (clean SEO base)
7 | Enquiry cart, stock flags, i18n, structured data | 3–4 days | Phase 6 (new data model)
8 | Image CDN, analytics, PWA, perf audit | 2–3 days | Phase 6 (image source decision)

Total: roughly 8–11 working days, shippable incrementally.

## Open Decisions Needed From the Owner

1. Google Sheets vs. headless CMS for Phase 6 (recommend Sheets to start).
2. Real product photography — timeline and who will source/shoot it.
3. Single primary phone number for the `tel:` link.
4. Analytics preference: Plausible vs. GA4.
5. Marathi translation approach — machine first or owner-provided?

---

Update notes: this document continues the existing roadmap (Phases 1–4) and adds the operational and infra phases necessary for growth and owner self-serve capabilities. Each checkbox is an independently shippable increment; I can implement Phase 5 and 6 next if you confirm the decisions requested above.
