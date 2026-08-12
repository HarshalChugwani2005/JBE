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
