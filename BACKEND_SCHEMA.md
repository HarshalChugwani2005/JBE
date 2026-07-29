# Backend / Data Schema — Jai Baba Electronic Website

## 1. Note on "Backend"
This project has **no traditional backend** (no server, no database, no auth) — that was a deliberate decision based on requirements: no online ordering, no self-serve admin panel, owner updates content via the developer as a code change. What follows is the **data schema** that stands in for a backend, plus how the two dynamic pieces (contact form, WhatsApp) are handled without one.

## 2. Product Data Schema (`src/data/products.js`)
Category → Brand → Model → Variants, derived from the ZIPSY ceiling fan catalog example provided.

```json
{
  "category": "ceiling-fans",
  "categoryLabel": "Ceiling Fans",
  "brands": [
    {
      "brand": "ZIPSY",
      "tagline": "100% Copper Winding",
      "warranty": "730 Days Warranty",
      "models": [
        {
          "modelName": "Titan",
          "specs": ["Highest air delivery", "Double ball bearing", "Aerodynamic design", "Superior paint finish"],
          "colors": ["Smoke Brown", "Ivory", "Brown"],
          "image": "titan.jpg"
        },
        {
          "modelName": "Glory",
          "specs": ["405 RPM", "Optimum air delivery even at low voltage", "Long lasting paint finish"],
          "colors": ["Cherry Red"],
          "image": "glory.jpg"
        },
        {
          "modelName": "Bounce",
          "specs": [],
          "colors": ["White", "Beige", "Copper", "Sky Blue", "Bronze"],
          "image": "bounce.jpg"
        },
        {
          "modelName": "Zoro",
          "specs": [],
          "colors": ["Gold", "White", "Grey", "Bronze"],
          "image": "zoro.jpg"
        },
        {
          "modelName": "Wonder",
          "specs": [],
          "colors": [],
          "image": "wonder.jpg"
        },
        {
          "modelName": "Intex Designer (Sona)",
          "specs": ["850 RPM / Hi-Speed", "Dust Free Technology", "Noiseless Operation", "100% Super Enamelled Copper Winding", "Power Saver Motor", "Aerodynamically balanced blades"],
          "colors": ["Boumvita", "Chandi", "Poly"],
          "image": "intex-designer.jpg"
        }
      ]
    }
  ]
}
```

### Field notes
| Field | Type | Notes |
|---|---|---|
| `category` | string (slug) | Used in URL routing |
| `categoryLabel` | string | Display name |
| `brands[].brand` | string | e.g., ZIPSY |
| `brands[].tagline` | string, optional | Marketing line shown on category page |
| `brands[].warranty` | string, optional | Shown as a badge |
| `models[].modelName` | string | |
| `models[].specs` | string[], optional | Empty array allowed — some catalog pages are image-only |
| `models[].colors` | string[], optional | Empty array allowed |
| `models[].image` | string | Filename, resolved against `assets/images/<category>/` |
| **No `price` field anywhere** | — | Deliberate — site is "contact for price" only |

### Placeholder categories (no data yet)
```json
{
  "category": "hot-plates",
  "categoryLabel": "Electric Hot Plates",
  "comingSoon": true,
  "brands": []
}
```
Categories still needing source material: hot plates, mixers, torches, geysers, immersion rods, table fans (regular + rechargeable), electric irons, LED bulbs, Bluetooth speakers, 12V rechargeable batteries, coolers (desert + fiber).

## 3. Contact Form "Backend" (Formspree)
No custom server — form POSTs directly to Formspree's endpoint from the client.

```
POST https://formspree.io/f/<form-id>
Body: { name, phone, message, category (optional) }
→ Formspree emails the submission to the shop owner
```

No data is stored in a database; each submission is delivered as an email/notification only.

## 4. WhatsApp "Integration"
Not an API integration — just a formatted link, no backend involved:
```
https://wa.me/<shop-number>?text=Hi%2C%20I%27m%20interested%20in%20ZIPSY%20Titan%20ceiling%20fan
```
Message text is generated client-side per product (brand + model name).

## 5. If a Real Backend Is Ever Needed (future, not in current scope)
If the owner later wants self-serve editing or online ordering, the natural next step would be:
- Headless CMS (Sanity/Strapi) replacing the static `products.js`, OR
- Firebase Firestore + simple auth for an admin panel
- This is **not** part of the current 1-week build — noted here only so the schema above can be migrated cleanly later without a redesign.
