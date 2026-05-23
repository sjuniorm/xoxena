# XO Xena — Website Design

**Date:** 2026-05-23
**Status:** Approved
**Visual reference:** [`XO Xena/XO Xena.html`](../../../XO%20Xena/XO%20Xena.html) — the Claude Design mockup is the source of truth for all visual decisions.

## Purpose

Build a small, warm, "soft & dreamy" portfolio website for Xena's homemade crochet business **XO Xena — Homemade with love**. The site introduces Xena, showcases her amigurumi work, and routes interested buyers into a custom-order flow that emails her directly. Deployed to Vercel from the `sjuniorm/xoxena` GitHub repo.

## Goals

- Visually faithful to the Claude Design mockup (palette, typography, layout, illustration touches).
- Multi-language: English (default), Spanish, Dutch.
- Working "Custom Orders" form that sends order requests to Xena's email.
- Architected so a real shop (cart + Stripe checkout) can be added later without restructuring the codebase.

## Non-goals (deferred)

- Live shop section (product grid, filters, cart drawer, "add to basket", checkout). The mockup includes it; this build omits it. The visual system and components stay compatible so a `<ShopSection />` can drop in later.
- Stripe / payment processing.
- Real product photography (placeholder swatches with text labels are used).
- Real portrait of Xena (washi-tape placeholder card is used).
- CMS — content lives in code/translations files for now.

## Visual reference

**The mockup at `XO Xena/XO Xena.html` defines the visual.** Don't reinterpret it. The implementation should match the mockup pixel-by-pixel for the sections that ship (everything except the shop section, which is omitted).

That includes:
- Color palette and CSS variables
- Speckled paper texture (`body::before` and `body::after` radial gradients)
- Typography (Caveat for display, Quicksand for body, DM Mono for eyebrows/labels)
- Floating yarn balls, sparkles, marquee, wavy dividers, polaroid-style cards
- Spacing, rotations, dashed borders, washi-tape decorations
- Button styles (coral primary with 5px offset shadow, ghost with dashed border)
- Hover effects and animations (floaty yarn balls, twinkle sparkles, scrolling marquee)

## Tech stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS 4 + CSS variables for the palette in `globals.css`
- **Fonts:** `next/font/google` loading Caveat, Quicksand, DM Mono
- **i18n:** `next-intl` with locale-prefixed routing (`/en`, `/es`, `/nl`)
- **Email:** Resend for the custom order form (sends to Xena's email)
- **Hosting:** Vercel
- **Repo:** https://github.com/sjuniorm/xoxena.git

### Why these choices

- **Next.js on Vercel:** zero-config deploys, free SSL, preview URLs per PR, first-class image optimization for future photo uploads, easy path to add a shop with server actions or Stripe.
- **Tailwind + custom CSS variables:** the mockup uses very specific custom values (rotations, dashed borders, multi-shadow, dotted background patterns). Tailwind handles utility classes; CSS variables defined in `globals.css` make the palette portable. No component library — the mockup's look is too bespoke to benefit from one.
- **next-intl:** mature, well-documented, App Router native, supports static rendering with locale-prefixed routes.
- **Resend:** simple, modern email API with a generous free tier, easy to wire from a server action.

## Site architecture

### Routes

- `/` — redirects to `/en` (or browser locale if Spanish/Dutch)
- `/en` — English single-page site
- `/es` — Spanish single-page site
- `/nl` — Dutch single-page site
- All three are the same page composition; only the translated strings differ.

### Page composition (per locale)

A single scrollable landing page with in-page anchor navigation. Sections in order:

1. **Sticky nav** — logo brand + nav links (`#about`, `#gallery`, `#custom`) + language switcher (EN / ES / NL pills, replaces the cart button slot in the mockup)
2. **Hero** — eyebrow chip, big "Hi, I'm Xena ♡" headline, tagline with squiggle underline, copy paragraph, two CTA buttons (primary: scroll to gallery; ghost: scroll to custom orders), logo card with floating yarn balls and sparkles
3. **Marquee** — rotating coral band, slightly rotated, with looping copy
4. **About** — `#about` — portrait placeholder card (tilted, with washi-tape look) + maker story + signature + 3 fact cards (years stitching, pieces made, 100% homemade)
5. **Wavy divider**
6. **Made with Love (gallery)** — `#gallery` — section heading + 6 polaroid-style cards in the asymmetric 12-column grid from the mockup, each rotated slightly, with placeholder swatches
7. **Wavy divider**
8. **Custom Orders** — `#custom` — two-column: copy + heart-bullet checklist on the left, the form card on the right
9. **Footer** — brand block + "Wander" link column + "Say hi" link column + bottom row

### Components

Each file has one clear purpose:

| File | Responsibility |
|---|---|
| `app/[locale]/layout.tsx` | Locale provider, font loading, html/body, paper texture |
| `app/[locale]/page.tsx` | Composes the section components in order |
| `app/globals.css` | CSS variables for palette, paper texture, base typography reset |
| `components/Nav.tsx` | Sticky nav, brand mark, links, embeds `LanguageSwitcher` |
| `components/LanguageSwitcher.tsx` | EN / ES / NL pill switcher, replaces cart-button slot |
| `components/Hero.tsx` | Hero layout with floating yarn balls and sparkles |
| `components/Marquee.tsx` | Tilted scrolling coral band |
| `components/About.tsx` | Portrait placeholder + about copy + facts grid |
| `components/Gallery.tsx` | Asymmetric polaroid grid (6 placeholder items) |
| `components/WavyDivider.tsx` | Reusable squiggle divider used between sections |
| `components/CustomOrders.tsx` | Two-column layout, mounts `OrderForm` |
| `components/OrderForm.tsx` | Client form (chips, fields, submit), calls server action, shows success state |
| `components/Footer.tsx` | Footer with link columns and bottom row |
| `app/actions/send-order.ts` | Server action that validates input and calls Resend |
| `lib/contact.ts` | Reads `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_WHATSAPP_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` env vars |
| `lib/i18n.ts` | next-intl config (locales, default locale, routing) |
| `messages/en.json` | All English strings |
| `messages/es.json` | All Spanish strings |
| `messages/nl.json` | All Dutch strings |
| `middleware.ts` | next-intl middleware for locale routing |
| `public/logo.png` | The XO Xena logo (from `XO Xena/assets/logo.png`) |

### Component boundaries

- All sections are **server components** by default (they render static markup).
- Client components only where interactivity is needed:
  - `LanguageSwitcher` (uses `useLocale` / link navigation)
  - `OrderForm` (state, submission, success view)
- The smooth-scroll behavior moves from the inline script in the mockup to a small client component that mounts once in the layout.

### Data flow — Custom Orders form

1. User fills the form (name, email, item type chips, palette chips multi-select, budget, idea text).
2. Submitting calls the server action `sendOrder(formData)`.
3. Server action validates input with Zod, then calls Resend with a templated HTML email to `CONTACT_EMAIL`.
4. On success, the client shows the mockup's success view ("Yay, your note is on its way!"). On error, an inline error message inside the form card.

### Environment variables

| Var | Purpose | Required |
|---|---|---|
| `RESEND_API_KEY` | Server-side, sends emails | Yes |
| `CONTACT_EMAIL` | Server-side, recipient of order requests | Yes |
| `RESEND_FROM_EMAIL` | Server-side, "from" address (must be Resend-verified) | Yes |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Footer link, e.g. `https://instagram.com/xoxena` | Optional (falls back to `#`) |
| `NEXT_PUBLIC_WHATSAPP_URL` | Footer link, e.g. `https://wa.me/34XXXXXXXXX` | Optional (falls back to `#`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Footer link, e.g. `mailto:hello@xoxena.com` | Optional (falls back to `#`) |

`.env.example` ships in the repo with placeholders. Real values go into Vercel project settings.

### i18n strategy

- `messages/{en,es,nl}.json` mirror each other key-for-key.
- Keys are grouped by section: `nav.about`, `hero.headline`, `about.fact1.number`, etc.
- The language switcher uses `next-intl`'s `Link` to swap locale while preserving the current anchor.
- Default locale: `en`. Locale detection from `Accept-Language` on `/`.

## Future shop architecture (for context, not built now)

When ready, add:
- `components/ShopSection.tsx` mounted between Gallery and Custom Orders
- `components/Cart.tsx` (drawer) + `components/CartButton.tsx` (in Nav, replaces space currently used by LanguageSwitcher — they will coexist)
- Products in `lib/products.ts` (typed array) → later a CMS
- `app/api/checkout/route.ts` Stripe Checkout Session creator
- Cart state in Zustand or React context, persisted to `localStorage`

Nothing in the current build should prevent any of this. Specifically: do not put cart-related markup or stubs in `Nav.tsx`; do not reserve "checkout" routes; do not introduce a CMS dependency.

## Testing

- Manual: load `/en`, `/es`, `/nl`, scroll through the page, confirm visual parity with the mockup, click the language switcher, submit the form and confirm Xena receives the email in a test inbox.
- Lighthouse: aim for 90+ on all four scores.
- Cross-browser: latest Chrome, Safari, Firefox; mobile Safari and Chrome.
- Responsive breakpoints from the mockup: 880px and 520px. Match the mockup's mobile behavior.

## Open items the user will fill in later

These can ship as placeholders; the user supplies real values via Vercel env vars when ready:
- Xena's email (where order forms route to)
- Instagram handle URL
- WhatsApp number (with country code) URL
- Resend API key + verified sender domain
- Eventually: real product photos and a portrait of Xena
