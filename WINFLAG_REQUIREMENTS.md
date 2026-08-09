Prepared by: Ashok

# WINFLAG — Website & Product Requirements

---

## 1. Business Overview

**WINFLAG** is an India-based B2B bulk flag supplier. It serves any group, organisation, or individual that needs custom-printed flags or banners in volume — event organisers, political campaigns, corporates, sports clubs, educational institutions, religious trusts, or individuals marking a national occasion. The brand is category-neutral: it serves all occasions equally and does not align with any religion, political party, or sports team.

### Core value proposition
- Bulk orders (MOQ 50 units) with fast turnaround (3–7 days standard, 48 hrs express)
- Custom printing of any design supplied by the customer
- Pan-India delivery with GST-compliant invoicing
- Transparent online quoting and order tracking

### Occasions served (non-exhaustive)
- Civic & government events (Republic Day, Independence Day, state days)
- Political rallies & election campaigns
- Corporate product launches, trade shows, conferences
- Sports clubs & fan groups (any sport)
- Cultural & community festivals
- Educational institutions & college fests
- Religious gatherings of any faith
- Weddings & milestone celebrations

---

## 2. Market Research Summary

### Industry context
The Indian promotional and event supplies market is valued at approximately ₹4,500 crore and growing at 12–15% annually. Flags, banners, and outdoor displays are a consistent high-volume subcategory. Political election seasons, IPL, and national holidays create cyclical demand spikes of 3–10× baseline. Corporate and wedding segments provide stable year-round revenue.

### Customer segments
| Segment | Typical order size | Key driver |
|---|---|---|
| Political parties / campaigns | 10,000–500,000 units | Election schedule |
| Event management companies | 200–5,000 units | Client brief |
| Corporate marketing teams | 100–2,000 units | Brand visibility |
| Sports fan clubs | 50–500 units | Match calendar |
| Religious / cultural trusts | 500–10,000 units | Festival calendar |
| Government departments | 1,000–50,000 units | Procurement cycle |

### Competitor gaps
Most bulk flag suppliers in India operate offline (Indiamart listings, WhatsApp-only ordering). Very few offer a professional online ordering flow, real-time quote submission, order tracking, or GST invoices downloadable on demand. WINFLAG differentiates on digital experience, speed, and reliability.

---

## 3. Brand Identity

### Name
**WINFLAG** (always written in uppercase)

### Tagline
*Flags for Every Occasion. Bulk. Fast. India-wide.*

### Brand personality
Professional, reliable, inclusive. Suitable for any customer regardless of political affiliation, religion, or sports allegiance. Clean and trustworthy — not flashy or partisan.

### Colour palette
| Token | Hex | Use |
|---|---|---|
| `wf-blue` | `#2563EB` | Primary CTA buttons, links, active states, logo |
| `wf-blue-dark` | `#1D4ED8` | Hover states, pressed buttons |
| `wf-blue-light` | `#3B82F6` | Accent highlights, subtle tints |
| `wf-green` | `#1A7A4A` | Success states, delivery confirmed |
| `charcoal` | `#1C1C1C` | Body text, headings |
| White | `#FFFFFF` | Backgrounds, card surfaces |
| Gray-50 | `#F9FAFB` | Section backgrounds |

### Typography
Inter (Google Fonts) — weights 400 (body), 600 (sub-headings), 800 (display headings).

### Logo description
See Section 9 for the AI image-generation prompt.

---

## 4. Website Architecture

### Page map
```
/ ─────────────────── Home
/products ─────────── Product catalogue
/products/:slug ───── Product detail
/gallery ──────────── Photo gallery (filter by occasion)
/quote ────────────── 4-step quote wizard
/track ────────────── Order tracker (by order number)
/faq ──────────────── FAQ
/contact ──────────── Contact & enquiry form
/blog ─────────────── Blog index
/blog/:slug ───────── Blog post
/login ────────────── Customer login
/register ─────────── Customer registration

/admin ─────────────── Admin dashboard (role-gated)
/admin/products ─────── Product CRUD
/admin/orders ───────── Order management
/admin/quotes ───────── Quote inbox
/admin/content ──────── CMS — edit any page's text & images
/admin/media ────────── Media library (upload / delete)
/admin/blog ─────────── Blog post editor
```

### Tech stack
| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 10 Web API (Clean Architecture) |
| ORM | Entity Framework Core 10 + SQLite |
| Auth | ASP.NET Core Identity + JWT Bearer tokens |
| Frontend | React 19, Vite, TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand v5 (auth persist), TanStack Query v5 (server state) |
| Forms | React Hook Form + Zod |
| File upload | React Dropzone |
| Icons | Lucide React |

---

## 5. Page-by-Page Specifications

### 5.1 Home (`/`)

**Hero section**
- Full-viewport gradient background in the WINFLAG blue palette (dark-to-mid blue)
- H1: "Flags for Every Occasion. Bulk. Fast. India-wide."
- Sub-copy: 3–7 days delivery, MOQ 50 units, GST Invoice
- Primary CTA: "Get an Instant Quote" → `/quote`
- Secondary CTA: WhatsApp link

**Trust bar** (below hero, charcoal background)
- 4 proof points: MOQ 50+, 48-Hr Express, GST Invoice, Pan-India delivery

**Product categories grid**
- Pulled from API, colourful gradient cards
- "View All Products" link

**How It Works** (4 steps)
1. Submit requirement → 2. Get quote → 3. Approve & pay → 4. Delivery

**Testimonials carousel**
- 3-per-page carousel, 5-star rated, pulled from CMS

**Gallery teaser**
- 6 preview images with "View Full Gallery" CTA

**Footer CTA**
- "Ready to order? Get your quote now" section before footer

---

### 5.2 Products (`/products`)
- Search bar + category pill filters
- Grid of product cards: image, name, category badge, price from ₹X/unit, MOQ
- "View Details" button per card

### 5.3 Product Detail (`/products/:slug`)
- Image, name, description, variants (size/material)
- Pricing table by quantity tier
- "Request Quote for This Product" CTA → prefills quote form
- Tab section: Specifications, Materials, FAQs

### 5.4 Gallery (`/gallery`)
- Masonry/grid photo layout
- Filters: All / Political / Corporate / Sports / National / Cultural / Religious
- Lightbox on image click

### 5.5 Quote Wizard (`/quote`)
4-step flow with progress indicator:
1. **Flag details** — type, size, material, quantity
2. **Design upload** — drag-and-drop artwork file
3. **Delivery** — address, standard vs. express, delivery date
4. **Contact** — name, phone, email, GSTIN (optional)

Confirmation screen with reference number.

### 5.6 Order Tracker (`/track`)
- Input: order number
- Timeline display: Pending → Confirmed → In Production → QC → Dispatched → Delivered
- Estimated delivery date shown

### 5.7 FAQ (`/faq`)
- Accordion by category: Ordering, Design, Delivery, Billing
- Data pulled from CMS/database

### 5.8 Contact (`/contact`)
- Form: name, email, phone, subject, message
- Address, phone, email, business hours
- WhatsApp button

### 5.9 Blog
- Index: card grid with featured image, title, excerpt, date, author
- Post: full article with rich text, back-to-blog navigation

### 5.10 Login / Register
- Standard email + password forms
- JWT token stored in localStorage via Zustand persist store

---

## 6. Admin Panel Specifications

All admin routes are behind role-gated middleware (`Admin` role required).

### 6.1 Dashboard
- Stats cards: Total Orders, Pending Orders, New Quotes, Total Products
- Revenue display
- Recent orders table (last 5)
- Recent quotes (last 5)

### 6.2 Products CRUD
- List table with search
- Add / Edit modal: Name, Slug, Description, Base Price, MOQ, Category, Image URL, Active toggle
- Delete with confirmation

### 6.3 Orders
- Table: order number, customer, status badge, amount, date
- Status update modal (all 7 statuses)
- View order detail with line items

### 6.4 Quotes Inbox
- List of quote requests
- "Set Price" action → sends quoted price, moves status to Quoted
- Status flow: New → Reviewed → Quoted → Converted / Closed

### 6.5 Content CMS
This is the core admin capability enabling any page's text and images to be changed without a code deployment.

- Page selector dropdown (Home, About, Gallery, etc.)
- Loads all sections for the selected page
- Each section card: Title, Subtitle, Body, Image URL, CTA Text, CTA Link fields
- "Open Media Library" button inserts an uploaded image URL
- Save → `PUT /api/content/page/{pageKey}/{section}`

### 6.6 Media Library
- Drag-and-drop image upload zone (PNG, JPG, WebP, SVG, GIF)
- Grid of all uploaded assets with file name, size, upload date
- Click image → copies URL to clipboard
- Delete with confirmation

### 6.7 Blog Editor
- List view with publish/draft toggle
- Create / edit post: Title, Slug, Excerpt, Author, Featured Image URL, full content (textarea)

---

## 7. API Endpoints Summary

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register customer |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/products` | List products (filter by category, search) |
| GET | `/api/products/:slug` | Product detail |
| GET | `/api/products/categories` | List categories |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |
| GET | `/api/orders` | List orders (Admin: all; Customer: own) |
| POST | `/api/orders` | Place order |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |
| GET | `/api/content/page/:pageKey` | Get all sections for a page |
| PUT | `/api/content/page/:pageKey/:section` | Upsert section content (Admin) |
| GET | `/api/content/testimonials` | Get testimonials |
| GET | `/api/content/gallery` | Get gallery items |
| GET | `/api/content/faqs` | Get FAQs |
| GET | `/api/content/quotes` | List quote requests (Admin) |
| POST | `/api/content/quotes` | Submit quote request |
| PUT | `/api/content/quotes/:id` | Update quote (Admin) |
| GET | `/api/media` | List media assets |
| POST | `/api/media/upload` | Upload file |
| DELETE | `/api/media/:id` | Delete media asset |

---

## 8. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Page load < 2 s on 4G mobile (Lighthouse score > 80) |
| Responsiveness | Mobile-first; fully functional 320 px–1440 px |
| SEO | Meta title + description per page; semantic HTML; OG tags |
| Security | JWT with 7-day expiry; bcrypt password hashing; input validation on all endpoints |
| GST compliance | 18% GST applied to all orders; GST invoice downloadable as PDF |
| Accessibility | ARIA labels on interactive elements; keyboard navigable |
| i18n readiness | All display strings via CMS; no hard-coded English phrases that block translation |

---

## 9. Logo Generation Prompt

Use the following prompt in any AI image generator (Midjourney, DALL·E 3, Ideogram, Adobe Firefly, Stable Diffusion) to generate the WINFLAG logo.

**Concept:** The logo mark is inspired by the *dhvaja* — the ancient triangular pennant flag of Arjuna from the Mahabharata. This is not a literal replica; it borrows only the distinctive silhouette: a long, tapering triangular pennant mounted on a slender vertical pole, with a gentle wave or curve in the body of the flag suggesting motion. The interior of the flag is completely plain — no icons, no symbols, no text inside the flag shape. Pure solid blue. The shape alone communicates "flag" instantly and timelessly.

---

**Primary prompt:**

> A minimal, professional logo for a company called "WINFLAG". The logo mark is a single triangular pennant flag — long, tapering to a sharp point on the right — mounted on a slim vertical pole on the left. The flag silhouette is inspired by the classical Indian dhvaja pennant shape: elongated and slightly curved, evoking gentle movement in the wind. The interior of the flag is completely empty — solid fill only, no icons, no patterns, no symbols inside. The entire mark is rendered in a single deep royal blue (#1E40AF) or vivid mid-blue (#2563EB) against a pure white background. Below or beside the flag mark, the wordmark "WINFLAG" appears in a clean, bold geometric sans-serif typeface in the same blue. No gradients, no shadows, no decorative elements. Flat vector style. The result is timeless, universal, and works equally for corporate clients, government departments, sports clubs, and civic organisations.

---

**Variation prompts** (for alternatives):

> *Option A — Curved pennant:* A long triangular pennant flag shape on a pole, with a slight S-curve along the top edge suggesting wind movement. Solid deep blue (#1E40AF), empty interior, white background. Wordmark "WINFLAG" in bold navy below.

> *Option B — Stacked composition:* The triangular pennant mark centred above the wordmark "WINFLAG", both in the same vivid blue (#2563EB). The flag tapers steeply — nearly a right-angle triangle — giving it a dynamic, forward-leaning silhouette. No pole, just the flag shape floating above the text.

> *Option C — Minimal wordmark only:* The wordmark "WINFLAG" in bold dark-blue geometric sans-serif, where the letter "F" extends a small rightward horizontal bar at the top that tapers into a tiny triangular pennant point — a subtle flag reference embedded in the type. Single colour, no separate icon.

---

**Shape reference to describe to the generator:**
> The flag silhouette should resemble a long, narrow triangle — like a medieval pennant or a naval burgee — mounted on a vertical staff. The width-to-length ratio should be approximately 1:3 or 1:4 (tall and thin). The flag may have a slight gentle curve along its length. No split tail (not a swallowtail). No emblem, no embroidery pattern, no pictogram inside — the flag face is a solid single colour only.

---

**Style reference keywords:** dhvaja, pennant, triangular flag, flat design, single colour, deep blue, geometric sans-serif, minimal, scalable, SVG-ready, B2B corporate, timeless

---

## 10. Admin Credentials (Development)

| Field | Value |
|---|---|
| Admin email | admin@winflag.in |
| Admin password | Admin@123 |
| API base | http://localhost:5000 |
| Frontend | http://localhost:5173 |
| Start command | `.\start-dev.ps1` from project root |
