# App Flow — Jai Baba Electronic Website

## 1. Primary User Flow (Retail Customer)
```
Land on Home
   ↓
Browse "Featured Categories" OR click "View Catalog"
   ↓
Catalog page → pick a category (e.g., Ceiling Fans)
   ↓
Category page → see brands (e.g., ZIPSY) → models listed as cards
   ↓
Tap a model → Product Detail (image, color options, specs, warranty)
   ↓
Tap "Enquire on WhatsApp" (pre-filled: "Hi, I'm interested in ZIPSY Titan ceiling fan")
   ↓
Redirected to WhatsApp app/web with message ready to send
```

## 2. Alternate Flow — Direct Contact (no browsing)
```
Land on Home or any page
   ↓
Tap floating WhatsApp button (always visible)
   OR
Tap "Call Shop" 
   OR
Go to Contact page → fill enquiry form → submit
   ↓
Submission delivered to shop owner via Formspree → email/notification
```

## 3. Wholesale Buyer Flow
```
Land on Home
   ↓
Read "About" section confirming wholesale + retail
   ↓
Browse catalog same as retail customer
   ↓
Enquire via WhatsApp/call, mentioning bulk requirement in the message
```
(No separate wholesale portal — same catalog, customer specifies bulk intent in their message.)

## 4. Owner Content-Update Flow (not self-serve in-app)
```
Owner has new product photos/catalog PDF
   ↓
Sends to developer (WhatsApp/email)
   ↓
Developer extracts data → adds to data/products.js following schema
   ↓
Push to Git → Vercel auto-deploys → live within minutes
```

## 5. Navigation Map
```
Home
 ├── Catalog
 │    ├── Category (Ceiling Fans)
 │    │    └── Product Detail
 │    ├── Category (Coolers)
 │    ├── Category (Kitchen Appliances)
 │    └── ... (other categories)
 └── Contact
      ├── Map
      ├── Form
      └── WhatsApp / Call CTA
```
