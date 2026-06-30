# WDGreenhill Design Notes

## Design Direction

**Concept:** "A 45-year-old specialist business that has finally caught up to 2026." Authoritative, technical, deeply experienced — but visually bold and modern. Not corporate-bland, not startup-generic.

**Aesthetic reference points:** Editorial magazine meets precision instrument catalogue. Think Monocle meets a 1970s Yamaha parts catalogue, rendered in 2026.

---

## Colour Palette

| Token | Value | Use |
|---|---|---|
| Primary (Indigo) | `hsl(245, 85%, 58%)` ≈ `#4F46E5` | Buttons, links, active states, section accents |
| Secondary (Amber) | `hsl(38, 93%, 50%)` ≈ `#F59E0B` | CTAs, highlights, labels, eyebrows |
| Accent (Magenta) | `hsl(330, 80%, 55%)` ≈ `#D93892` | Wildcard — hover states, badge variants (use sparingly) |
| Foreground | `hsl(240, 10%, 4%)` ≈ `#0A0A0B` | Body text, headings |
| Background | `hsl(50, 20%, 98%)` ≈ `#FAFAF7` | Page background — warm off-white, not pure white |
| Muted | `hsl(240, 5%, 94%)` | Secondary backgrounds, table headers |
| Border | `hsl(240, 6%, 88%)` | Card borders, dividers |

**Palette rationale:** The indigo reads as technical/precise; the amber provides warmth and accessibility as a CTA colour (strong contrast on dark backgrounds); the warm off-white background avoids clinical sterility. Magenta is used once or twice to surprise.

---

## Typography

### Display: Fraunces
- Google Fonts variable font with `SOFT` and `WONK` axes
- Used for: H1–H3 headings, the logo wordmark, section headings, pull quotes
- Variable axes: default settings (adjust `WONK` for personality on hero text if desired)
- CSS variable: `--font-fraunces`

### Body: Geist Sans
- Clean geometric sans-serif (Vercel's typeface)
- Used for: body copy, nav, buttons, labels, small text
- CSS variable: `--font-geist-sans`

### Mono: Geist Mono
- Used sparingly for: SKU/part numbers, price display in some contexts
- CSS variable: `--font-geist-mono`

**Pairing rationale:** Fraunces has optical warmth and a bookish quality that references the 45 years of paper manuals in our archive. Geist Sans is clean, legible, and technical without being cold.

---

## Motion Principles

All animations are gated behind `@media (prefers-reduced-motion: reduce)` — if the user has reduced motion enabled, all transitions are set to 0.01ms.

| Element | Animation | Notes |
|---|---|---|
| Hero | Static (full-bleed dark bg with grid texture) | No parallax for accessibility; can add Framer Motion parallax via `useScroll` hook if desired |
| Section reveals | CSS `animate-fade-up` on scroll via `IntersectionObserver` in `AnimatedCounter` | Pattern can be extended to other elements |
| Brand marquee | CSS `animate-marquee` — 30s linear infinite | Pauses on hover optional enhancement |
| Product cards | `hover:-translate-y-1 hover:shadow-xl` | CSS only, no JS |
| Cart drawer | Framer Motion `spring` — stiffness 300, damping 30 | Feels snappy, not floaty |
| Nav links | CSS `::after` pseudo-element width transition | The underline grows from left on hover |
| Header | `bg-transparent → bg-white/95 backdrop-blur` on scroll | Pure CSS transition; scroll listener in `SiteHeader.tsx` |
| Stat counters | JS `requestAnimationFrame` with ease-out cubic | Triggers once on first IntersectionObserver entry |

---

## Layout Principles

- **Max content width:** `max-w-7xl` (1280px) with `px-6` gutters
- **Asymmetry:** Hero text left-aligned, numbers centred, testimonials grid — variety prevents monotony
- **Hero typography:** `clamp(3rem, 10vw, 8rem)` — scales fluidly, never wraps awkwardly at any viewport
- **Spacing scale:** generous — sections breathe at `py-24`, cards at `p-8`
- **Sticky header:** transparent over dark hero sections, solid with blur when scrolled. Handled by scroll listener + Tailwind class toggling

---

## Decorative Elements

### Piano-key divider
```css
.piano-keys-divider {
  background: repeating-linear-gradient(
    90deg,
    var(--foreground) 0px 12px,
    transparent 12px 18px
  );
  opacity: 0.1;
}
```
Used as section dividers. References piano keys without being literal.

### Piano-key footer bar
```css
background: repeating-linear-gradient(
  90deg,
  #1a1a2e 0px 14px,    /* black key */
  #fff 14px 16px,       /* white highlight */
  #1a1a2e 16px 30px    /* gap */
)
```
Applied as a 3px top bar on the footer — nods to the keyboard at the bottom of the page.

### Hero grid texture
Thin indigo grid lines at 5% opacity over the dark hero. References technical graph paper / circuit board.

---

## Component Notes

### `SiteHeader`
- Two-row: top bar (contact info) collapses to single-row at mobile
- Top bar background changes from `hsl(240,10%,4%)` (transparent hero) to `hsl(245,85%,58%)` (scrolled) — subtle shift
- Cart badge: amber `#F59E0B` with count

### `ProductCard`
- White card with 1px border. On hover: `-translate-y-1` + `shadow-xl` with indigo tint
- Out-of-stock items show "Enquire" button (outline variant) instead of "Add to Cart"
- SKU in monospace, price in bold display

### `CartDrawer`
- Framer Motion `AnimatePresence` wraps both backdrop and drawer panel
- Backdrop: opacity fade. Drawer: spring from right edge
- Body scroll locked while open via `document.body.style.overflow = 'hidden'`

### `AnimatedCounter`
- `IntersectionObserver` triggers once when element enters viewport at 30% threshold
- Ease-out cubic: `1 - (1 - progress)³`
- `hasAnimated` ref prevents re-triggering on scroll-back

---

## Accessibility Notes

- All interactive elements have focus rings (`focus-visible:ring-2 focus-visible:ring-ring`)
- Semantic HTML throughout: `<nav aria-label>`, `<main>`, `<section aria-labelledby>`, `<article>` for product cards
- Cart drawer: `role="dialog" aria-modal="true"` with body scroll lock
- Breadcrumbs: `aria-label="Breadcrumb"` with `aria-current="page"` on last item
- Stats section uses `<dl>/<dt>/<dd>` with `<dt class="sr-only">` for counter labels
- Testimonials use `<figure>/<blockquote>/<figcaption>`
- Colour contrast: primary indigo on white passes AA at all text sizes; amber on dark backgrounds passes AA

---

## TODO / Future Enhancements

- [ ] Real product photography — replace placeholder images
- [ ] CMS integration (Sanity or Payload) — data files are structured for easy swap
- [ ] Customer accounts + order history
- [ ] Stock level real-time sync
- [ ] Stripe webhook → order database (currently just console.log)
- [ ] Email provider wiring (Resend) in API routes
- [ ] Image optimisation pipeline for product photos
- [ ] Analytics (Plausible or GA4)
- [ ] Review/confirm: opening hours, VAT number, company registration number
