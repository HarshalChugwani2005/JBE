# PRD — Jai Baba Electronic Website

## 1. Overview
**Product**: Marketing/catalog website for Jai Baba Electronic, a wholesale + retail electronics shop.
**Location**: Buldana Road, Malkapur.
**Goal**: Give the shop online visibility and let customers browse the product range and reach out — no online ordering or payment.

## 2. Problem Statement
The shop currently has no online presence. Customers can't browse what's in stock before visiting or calling, and the shop has no way to show up in local search results.

## 3. Target Users
- **Retail customers**: individuals in/near Malkapur looking for a specific appliance (fan, cooler, iron, etc.)
- **Wholesale buyers**: shops/dealers looking to bulk-order from Jai Baba Electronic
- **Shop owner**: needs to update product listings occasionally, no technical background assumed

## 4. Goals
- Showcase full product catalog by category, brand, and model
- Make it effortless to contact the shop (WhatsApp, call, form)
- Rank for local searches ("electronics shop Malkapur", "wholesale fans Malkapur")
- Zero ongoing cost to run

## 5. Non-Goals (explicitly out of scope)
- No online payment or checkout
- No user accounts/login
- No real-time inventory or stock counts
- No admin dashboard/CMS — owner will not edit content directly; content is updated as a code change when new catalog material is provided

## 6. Key Features
| Feature | Priority |
|---|---|
| Category-based product catalog (image, model, specs, colors) | Must have |
| Brand grouping within category | Must have |
| WhatsApp enquiry (pre-filled message per product) | Must have |
| Call now (`tel:`) button | Must have |
| Contact form (Formspree/EmailJS, no backend) | Must have |
| Google Maps embed | Must have |
| Mobile-first responsive design | Must have |
| Basic local SEO (meta tags, OG tags) | Must have |
| "Coming soon" placeholder for categories without data yet | Should have |
| Multi-language (Marathi/Hindi) | Won't have (v1) |

## 7. Success Criteria
- Site live within 1 week
- All 11+ product categories represented (even if some are placeholder)
- Every product detail view has a working WhatsApp/call CTA
- Site fully usable on a mobile screen (primary usage channel)

## 8. Constraints
- Timeline: 1 week
- No prices displayed anywhere ("contact for price")
- Owner updates content only when new catalog material (photos/PDFs) is provided to the developer — not self-serve
