# UI/UX Brief — Jai Baba Electronic Website

## 1. Design Principles
- **Mobile-first**: majority of customers will browse on a phone — design for a 375–414px viewport first, scale up
- **Fast, not flashy**: this is a local shop site, not a brand showcase — prioritize clarity and load speed over animation
- **Trust signals visible**: warranty badges (e.g., "730 Days Warranty"), "100% Copper Winding," wholesale+retail messaging should be easy to spot, since these build buyer confidence
- **One clear action per screen**: every page should make it obvious how to contact the shop

## 2. Visual Direction
- Clean, uncluttered layout — plenty of white space around product images
- Category icons/images should feel practical and product-forward (real photos, not stock icons) — matches the authentic, no-frills feel of the catalog material shared
- Warm, trustworthy color palette — avoid an overly "techy" SaaS look; this is a neighborhood electronics shop, not a startup
- Suggested accent color: a warm amber/orange (electricity, energy) paired with neutral greys/whites; WhatsApp green reserved only for the WhatsApp CTA button (keeps that action recognizable)

## 3. Key Screens
### Home
- Hero: shop name, one-line value prop ("Wholesale & Retail Electronics in Malkapur"), two buttons: "Browse Catalog" (primary) and "WhatsApp Us" (secondary, green)
- Featured category tiles (image + label) — tap to jump into catalog
- Short About blurb
- Mini map + address, linking to full Contact page

### Catalog Landing
- Grid of category cards, consistent image aspect ratio
- Categories without real data yet show a "Coming Soon" badge but remain visible (so the range still looks complete)

### Category Page
- Grouped by brand, brand name as section header with tagline/warranty badge if available (e.g., "ZIPSY — 100% Copper Winding, 730 Days Warranty")
- Models as cards: image, name, small color swatch dots if variants exist

### Product Detail
- Large image up top, color swatches below (tap to preview other variant photos if available)
- Specs as a clean bullet list (not a dense table — most specs are short phrases)
- Two sticky CTAs at the bottom on mobile: "WhatsApp Enquiry" and "Call Now" — always reachable without scrolling back up

### Contact
- Map embed, address, hours
- Enquiry form: minimal fields (Name, Phone, Message, optional category dropdown)
- WhatsApp + Call buttons repeated here too

## 4. Interaction Notes
- WhatsApp button: fixed/floating on all pages (bottom-right, thumb-reachable on mobile)
- Product images: lazy-loaded, tap to enlarge if feasible (simple lightbox, no heavy gallery library needed)
- Forms: inline validation, simple success message on submit (no page reload)

## 5. Accessibility
- Minimum tap target size 44x44px for buttons (important for CTAs like WhatsApp/Call)
- Alt text on every product image (model name + brand)
- Sufficient color contrast for text over images/badges

## 6. Content Tone
- Straightforward, local-shop tone — not corporate. Short product descriptions, no marketing fluff, since "contact for price" already implies a personal/relationship-based buying process rather than an e-commerce transaction.
