# Implementation Plan — Jai Baba Electronic Website

Consolidated day-wise plan. Detailed per-day task files also exist separately (`day1.md`–`day7.md`) for granular tracking.

## Day 1 — Project Setup + Data Modeling
- Initialize React + Vite, install Tailwind CSS
- Set up folder structure (see TRD.md)
- Build `data/products.js` using the schema in `BACKEND_SCHEMA.md`
- Populate ceiling fans (ZIPSY) as the first fully real category
- Add placeholder `comingSoon` entries for all other categories
- Set up React Router route stubs

## Day 2 — Home Page + Catalog Landing
- Build Home (hero, featured categories, about blurb, map preview)
- Build Catalog landing page (category grid, including "coming soon" cards)
- Reusable `CategoryCard` and `Section` components

## Day 3 — Category Page + Product Detail
- Category page: brands → models, grouped and badged (warranty/tagline)
 - Product detail (route): image placeholder, color swatches, specs, WhatsApp + Call CTAs — IMPLEMENTED
 - Graceful handling of models with no specs/colors — IMPLEMENTED

## Day 4 — Contact Page + Form + Map
- Contact page: map embed, address, hours, enquiry form
 - Contact page: map embed, address, hours, enquiry form — IMPLEMENTED
 - Wire form to Formspree (no backend) — IMPLEMENTED (configure `shop.formspreeUrl`)
 - Add global floating WhatsApp button across all pages — ALREADY PRESENT

## Day 5 — Responsive Polish + SEO
- Full responsive pass, mobile-first
- Meta tags, Open Graph tags per page
- Image compression + lazy loading
- Accessibility pass (alt text, tap target sizes, contrast)

## Day 6 — Content Population + Testing
- Add real data for additional categories as source material arrives
- Replace placeholder images with real shop photos
- Cross-device testing (Android Chrome priority, then desktop, then iOS)
- Test WhatsApp links, call links, and form delivery end-to-end

## Day 7 — Deploy + Buffer
- Deploy to Vercel, connect domain if purchased
- Final live-site check of all CTAs, form, and map
- Share live link with shop owner for sign-off
- Buffer time for post-launch fixes

## Dependencies / Blockers to Watch
- **Catalog source material** for remaining categories (hot plates, mixers, torches, geysers, immersion rods, table fans, irons, LED bulbs, Bluetooth speakers, 12V batteries, coolers) — needed before Day 6, ideally trickling in from Day 1 onward
- **Shop WhatsApp number and phone number** — needed by Day 3
- **Domain purchase decision** — needed by Day 7 if a custom domain is wanted at launch
