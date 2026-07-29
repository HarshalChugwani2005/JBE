# TRD — Jai Baba Electronic Website

## 1. Tech Stack
| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | React 18 + Vite | Fast dev/build, no SSR needed since content is static and not frequently changing |
| Styling | Tailwind CSS | Fast to build responsive UI, small bundle |
| Routing | React Router v6 | Standard client-side routing for SPA |
| Data layer | Static JS/JSON file (`src/data/products.js`) | No backend needed; owner-controlled updates go through code, not a live DB |
| Form handling | Formspree (or EmailJS) | Free tier, no backend required, delivers submissions to shop owner's email |
| Maps | Google Maps iframe embed | Free, no API key required for basic embed |
| Hosting | Vercel (or Netlify) | Free tier, auto-deploy from Git, HTTPS included |
| Domain | Optional custom domain | ~₹500–800/year; can launch on free subdomain first |
| Version control | Git + GitHub | Needed even for a static project — history, rollback, deploy hooks |

## 2. Architecture
This is a **static single-page application** — no server, no database, no authentication.

```
Browser
  ↓
React SPA (built by Vite, hosted as static files on Vercel)
  ↓
  ├── Renders from local data/products.js (no API call)
  ├── WhatsApp link → wa.me (external, no integration needed)
  ├── Contact form → Formspree API (third-party, handles email delivery)
  └── Google Maps → iframe embed (external, no key needed for embed-only use)
```

## 3. Folder Structure
```
src/
  components/
    Navbar.jsx
    Footer.jsx
    CategoryCard.jsx
    ProductCard.jsx
    ProductDetailModal.jsx
    WhatsAppButton.jsx
    ContactForm.jsx
  pages/
    Home.jsx
    Catalog.jsx
    CategoryPage.jsx
    Contact.jsx
  data/
    products.js
  assets/
    images/
      <category>/
  App.jsx
  main.jsx
```

## 4. Routing
| Route | Page |
|---|---|
| `/` | Home |
| `/catalog` | Catalog landing (category grid) |
| `/catalog/:category` | Category page (brands → models) |
| `/catalog/:category/:model` | Product detail (optional — can also be a modal instead of a route) |
| `/contact` | Contact page |

## 5. Performance Requirements
- Lighthouse mobile score target: 85+ on Performance, 90+ on SEO/Accessibility
- Images: compressed, served in modern formats where possible (WebP), lazy-loaded below the fold
- No unnecessary JS libraries — keep bundle lean given it's a content site, not an app

## 6. SEO Requirements
- Per-page `<title>` and `<meta name="description">`
- Open Graph tags (title, description, image) for WhatsApp link previews
- Semantic HTML (proper heading hierarchy, alt text on all product images)
- `sitemap.xml` and `robots.txt` at deploy time

## 7. Browser/Device Support
- Primary target: mobile Chrome (Android) — assume this is majority of traffic
- Secondary: desktop Chrome/Edge, mobile Safari (iOS)

## 8. Deployment
- Git repo → connected to Vercel → auto-deploy on push to `main`
- Environment: no environment variables needed (no API keys for MVP scope)
