# WD Greenhill & Co — Website

Modern Next.js e-commerce site for WD Greenhill & Co Ltd — Europe's largest independent digital piano, keyboard & organ parts stockist. Official Kawai UK service partner.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + CSS custom properties
- **Fonts:** Fraunces (display) + Geist Sans/Mono via `next/font/google`
- **UI:** Radix UI primitives, lucide-react icons
- **Animation:** Framer Motion
- **Forms:** react-hook-form + Zod
- **Payments:** Stripe Checkout Sessions (server-side)
- **Cart:** Zustand with localStorage persistence
- **Email:** Resend (stub — configure via env var)
- **Deployment:** Vercel

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
# Fill in your values
```

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (test: `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `EMAIL_PROVIDER` | `resend` or leave blank for stub |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | From address for outbound emails |
| `EMAIL_TO` | Destination for contact/support forms |
| `NEXT_PUBLIC_SITE_URL` | Full site URL |

### 3. Dev server

```bash
npm run dev
# http://localhost:3000
# Style guide: http://localhost:3000/dev/styleguide
```

---

## Stripe

**Test card:** `4242 4242 4242 4242`, any future expiry, any CVC.

**Local webhooks:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed signing secret to `STRIPE_WEBHOOK_SECRET`.

---

## Deployment (Vercel)

```bash
npm run build   # verify locally
vercel deploy
```

Set all env vars in Vercel project settings.

---

## Adding Products

Edit [`data/products.ts`](./data/products.ts). Each product needs:

```typescript
{
  sku, title, slug, brand,  // brand must match data/brands.ts slug
  categories,               // must match data/categories.ts slugs
  compatibleModels,         // Kawai model slugs from data/models.ts
  price,                    // GBP ex VAT
  stock,                    // 0 = out of stock
  images, description, specs, featured
}
```

Sitemap and shop pages update automatically.

---

## CMS Migration

All data lives in `/data/*.ts` files with typed interfaces and lookup functions. To swap for Sanity/Payload/Contentful: replace the file internals with async CMS fetches — component signatures don't change.

---

## Project Structure

```
app/           Routes (see site architecture in build spec)
components/
  ui/          Radix primitives
  site/        Header, Footer, CartDrawer, EnquireModal, SectionHeading
  shop/        ProductCard, BrandTile, ModelChip
  motion/      AnimatedCounter
data/          TypeScript content (products, brands, models, manuals, faqs)
lib/           utils, format, stripe, cart-store (Zustand)
```

---

## Client TODOs

- [ ] Confirm opening hours (currently Mon-Fri 9-5)
- [ ] Provide VAT registration number for footer/terms
- [ ] Company registration number
- [ ] Legal review: Terms & Privacy pages (marked "draft")
- [ ] Review FAQ answers (marked `draft: true` in data/faqs.ts)
- [ ] Real product photography to replace placeholders
- [ ] Confirm Kawai model year ranges
- [ ] Wire up email provider (Resend) in API routes
- [ ] Connect Stripe production keys before launch
