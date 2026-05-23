# XO Xena Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the XO Xena crochet portfolio website — pixel-faithful to the Claude Design mockup at `XO Xena/XO Xena.html`, deployed to Vercel, pushed to `https://github.com/sjuniorm/xoxena.git`.

**Architecture:** Next.js 16 App Router single-page site with anchor navigation. Three locales (en/es/nl) via `next-intl` with locale-prefixed routes. Custom Orders form posts to a Server Action that emails Xena via Resend. The shop section from the mockup is intentionally omitted but the visual system stays compatible so it can drop in later.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, next-intl, Resend, Zod, next/font (Caveat, Quicksand, DM Mono).

**Working directory:** `/Users/junior/Library/CloudStorage/OneDrive-BUZZAlarmasS.L/Junior projects/XO Xena` — has spaces, always quote paths in shell commands.

**Spec:** [`docs/superpowers/specs/2026-05-23-xo-xena-website-design.md`](../specs/2026-05-23-xo-xena-website-design.md)

**Visual reference:** [`XO Xena/XO Xena.html`](../../../XO%20Xena/XO%20Xena.html) — open this in a browser during every visual task and compare. **This is the visual contract.**

---

## File Structure

```
.
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Locale provider, fonts, html/body
│   │   └── page.tsx            # Composes all sections
│   ├── actions/
│   │   └── send-order.ts       # Server action → Resend
│   ├── globals.css             # Palette CSS vars, paper texture, base reset
│   └── layout.tsx              # Root layout (just <html>)
├── components/
│   ├── Nav.tsx
│   ├── LanguageSwitcher.tsx
│   ├── Hero.tsx
│   ├── Marquee.tsx
│   ├── About.tsx
│   ├── Gallery.tsx
│   ├── WavyDivider.tsx
│   ├── CustomOrders.tsx
│   ├── OrderForm.tsx           # client component
│   ├── Footer.tsx
│   └── SmoothScroll.tsx        # client component
├── lib/
│   ├── contact.ts              # env-var-backed contact links
│   └── i18n.ts                 # next-intl config
├── messages/
│   ├── en.json
│   ├── es.json
│   └── nl.json
├── public/
│   └── logo.png                # XO Xena logo
├── docs/
│   ├── superpowers/{specs,plans}/...
│   └── mockup/                 # moved here from "XO Xena/"
├── middleware.ts               # next-intl locale routing
├── next.config.ts
├── tailwind.config.ts          # or v4 css-first config
├── tsconfig.json
├── .env.example
├── .gitignore
└── package.json                # name: "xoxena"
```

---

## Phase 1 — Project bootstrap

### Task 1: Scaffold Next.js app in the working directory

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/...`, `.gitignore`, `eslint.config.mjs`, `postcss.config.mjs`

- [ ] **Step 1: Run create-next-app in the current directory**

```bash
cd "/Users/junior/Library/CloudStorage/OneDrive-BUZZAlarmasS.L/Junior projects/XO Xena"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack --yes
```

Expected: scaffolds Next.js 16+ with TypeScript, Tailwind 4, App Router, no src dir, `@/` alias. Existing files (the mockup folder, the screenshot, `docs/`) are left untouched.

If create-next-app refuses because the directory is not empty, run with `--force`:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack --yes --force
```

- [ ] **Step 2: Rename package and lock Node version**

Edit `package.json`:

```json
{
  "name": "xoxena",
  "version": "0.1.0",
  "private": true,
  "engines": {
    "node": ">=20.0.0"
  }
}
```

Keep the existing `scripts`, `dependencies`, `devDependencies` blocks.

- [ ] **Step 3: Verify the scaffold runs**

```bash
npm run dev
```

Expected: dev server starts on `http://localhost:3000`. Open it; you should see the default Next.js welcome page. Stop the server (Ctrl+C).

- [ ] **Step 4: Commit the scaffold**

Initialize git first if it isn't already:

```bash
git init
git add -A
git status
```

Confirm no `node_modules/` or `.next/` appears in staged files (the generated `.gitignore` should exclude them). If they do, stop and inspect `.gitignore`.

```bash
git commit -m "chore: scaffold Next.js + Tailwind + TypeScript"
```

### Task 2: Move the mockup into docs/ and add the logo

**Files:**
- Move: `XO Xena/XO Xena.html` → `docs/mockup/index.html`
- Move: `XO Xena/assets/logo.png` → `public/logo.png` (also keep a copy in `docs/mockup/assets/logo.png` so the mockup still renders)
- Delete: `XO Xena/uploads/` (it's a dupe of the screenshot in the root)
- Delete: top-level `Screenshot 2026-05-22 at 08.59.34.png`

- [ ] **Step 1: Create new locations**

```bash
mkdir -p "docs/mockup/assets"
mkdir -p "public"
```

- [ ] **Step 2: Move files**

```bash
mv "XO Xena/XO Xena.html" "docs/mockup/index.html"
cp "XO Xena/assets/logo.png" "public/logo.png"
mv "XO Xena/assets/logo.png" "docs/mockup/assets/logo.png"
rm -rf "XO Xena"
rm "Screenshot 2026-05-22 at 08.59.34.png"
```

- [ ] **Step 3: Sanity check**

```bash
ls public/logo.png && ls docs/mockup/index.html && ls docs/mockup/assets/logo.png
```

Expected: all three paths exist.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: move mockup to docs/, put logo in public/"
```

### Task 3: Install runtime dependencies

**Files:** `package.json`, `package-lock.json`

- [ ] **Step 1: Install**

```bash
npm install next-intl resend zod
```

- [ ] **Step 2: Verify they are in `dependencies`**

```bash
grep -E '"(next-intl|resend|zod)"' package.json
```

Expected: three lines, each showing a recent version.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-intl, resend, zod"
```

---

## Phase 2 — Foundation (i18n, fonts, palette)

### Task 4: Configure next-intl routing

**Files:**
- Create: `lib/i18n.ts`, `middleware.ts`, `i18n/routing.ts`, `i18n/request.ts`
- Modify: `next.config.ts`

This follows the standard next-intl App Router setup with `[locale]` segment.

- [ ] **Step 1: Create the routing config**

Create `i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "nl"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

- [ ] **Step 2: Create the request config**

Create `i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create the navigation helpers**

Create `lib/i18n.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Create the middleware**

Create `middleware.ts` at the project root:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Wire next-intl plugin in next.config.ts**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: configure next-intl with en/es/nl locales"
```

### Task 5: Create the [locale] route group and minimal translations

**Files:**
- Move: `app/layout.tsx` content → `app/[locale]/layout.tsx`
- Delete: `app/page.tsx`
- Create: `app/[locale]/page.tsx`, `messages/en.json`, `messages/es.json`, `messages/nl.json`
- Modify: `app/layout.tsx` (becomes a thin root)

- [ ] **Step 1: Create messages with a single stub key**

Create `messages/en.json`:

```json
{
  "hero": {
    "headline": "Hi, I'm Xena"
  }
}
```

Create `messages/es.json`:

```json
{
  "hero": {
    "headline": "Hola, soy Xena"
  }
}
```

Create `messages/nl.json`:

```json
{
  "hero": {
    "headline": "Hoi, ik ben Xena"
  }
}
```

- [ ] **Step 2: Replace app/layout.tsx with a thin root**

Overwrite `app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 3: Create app/[locale]/layout.tsx**

Create `app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Delete old root page and create locale page**

```bash
rm app/page.tsx
```

Create `app/[locale]/page.tsx`:

```tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("hero");
  return (
    <main>
      <h1>{t("headline")}</h1>
    </main>
  );
}
```

- [ ] **Step 5: Smoke-test the three locales**

```bash
npm run dev
```

Visit `http://localhost:3000/en`, `/es`, `/nl`. Each should render the translated headline. Visiting `/` should redirect to `/en`. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add [locale] route with stub home page"
```

### Task 6: Configure fonts via next/font

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Add fonts to the locale layout**

Replace `app/[locale]/layout.tsx` with:

```tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Caveat, Quicksand, DM_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${caveat.variable} ${quicksand.variable} ${dmMono.variable}`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat: load Caveat, Quicksand, DM Mono via next/font"
```

### Task 7: Globals — palette, paper texture, base styles

**Files:**
- Overwrite: `app/globals.css`

This is the heart of the visual system. Copy values directly from the mockup.

- [ ] **Step 1: Overwrite app/globals.css**

```css
@import "tailwindcss";

@theme {
  --color-cream: #FDF5EC;
  --color-cream-2: #F8EADB;
  --color-cream-3: #F2DFC9;
  --color-coral: #E08A8A;
  --color-coral-dark: #C46B6B;
  --color-rose: #F5C0C0;
  --color-peach: #F8D2B0;
  --color-mint: #C4DFCB;
  --color-sky: #C7D8E6;
  --color-lavender: #D8C9E0;
  --color-butter: #F4E1A8;
  --color-brown: #5C4438;
  --color-brown-2: #8C6A57;
  --color-brown-soft: #B89380;

  --font-display: var(--font-caveat);
  --font-body: var(--font-quicksand);
  --font-mono: var(--font-dm-mono);

  --shadow-soft: 0 8px 24px -10px rgba(92, 68, 56, 0.22);
  --shadow-lg: 0 18px 40px -16px rgba(92, 68, 56, 0.28);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body), system-ui, sans-serif;
  background: var(--color-cream);
  color: var(--color-brown);
  font-size: 17px;
  line-height: 1.55;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(circle at 12% 18%, rgba(224, 138, 138, 0.04) 0, transparent 60%),
    radial-gradient(circle at 88% 72%, rgba(196, 223, 203, 0.05) 0, transparent 55%),
    radial-gradient(circle at 50% 110%, rgba(248, 210, 176, 0.06) 0, transparent 50%);
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.35;
  background-image:
    radial-gradient(circle, rgba(140, 106, 87, 0.18) 0.5px, transparent 1px),
    radial-gradient(circle, rgba(140, 106, 87, 0.14) 0.5px, transparent 1px);
  background-size: 140px 140px, 90px 90px;
  background-position: 0 0, 45px 60px;
}

main {
  position: relative;
  z-index: 1;
}

h1,
h2,
h3 {
  font-family: var(--font-display), cursive;
  font-weight: 700;
  color: var(--color-coral-dark);
  margin: 0;
  letter-spacing: 0.5px;
  line-height: 1;
}

h2 {
  font-size: clamp(42px, 5vw, 64px);
}

h3 {
  font-size: 28px;
}

p {
  margin: 0 0 1em 0;
}

.eyebrow {
  font-family: var(--font-mono), monospace;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 11px;
  color: var(--color-brown-soft);
  margin-bottom: 14px;
}

/* Reusable button styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 999px;
  padding: 14px 26px;
  font-family: var(--font-body), sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-primary {
  background: var(--color-coral);
  color: white;
  box-shadow: 0 5px 0 var(--color-coral-dark);
}

.btn-primary:hover {
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 var(--color-coral-dark);
}

.btn-ghost {
  background: white;
  color: var(--color-brown);
  border: 1.5px dashed var(--color-brown-soft);
}

.btn-ghost:hover {
  background: var(--color-cream-2);
}

/* Wavy divider */
.wavy {
  width: 100%;
  height: 16px;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 16' preserveAspectRatio='none'><path d='M0 8 Q 15 0 30 8 T 60 8 T 90 8 T 120 8' stroke='%23E08A8A' stroke-width='2' fill='none' stroke-linecap='round'/></svg>") center / 120px 16px repeat-x;
  margin: 0 auto;
  max-width: 200px;
  opacity: 0.55;
}

/* Floaty animation reused by yarn balls */
@keyframes floaty {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-12px) rotate(4deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes scroll-x {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

- [ ] **Step 2: Visual smoke test**

```bash
npm run dev
```

Open `http://localhost:3000/en`. The page should now show cream background, brown text, and "Hi, I'm Xena" in the handwritten Caveat font. Subtle dots/speckles should be visible on the background. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: palette, paper texture, base typography from mockup"
```

### Task 8: Contact + env scaffolding

**Files:**
- Create: `lib/contact.ts`, `.env.example`, `.env.local`

- [ ] **Step 1: Create lib/contact.ts**

```ts
export const contact = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "#",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "#",
};
```

- [ ] **Step 2: Create .env.example**

```bash
# Resend (server-only)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=orders@xoxena.com
CONTACT_EMAIL=hello@xoxena.com

# Public contact links (used in the footer)
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/xoxena
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/34000000000
NEXT_PUBLIC_CONTACT_EMAIL=mailto:hello@xoxena.com
```

Save as `.env.example`.

- [ ] **Step 3: Create .env.local with placeholders so dev works**

Copy `.env.example` to `.env.local`. The site will run with the placeholder values; the form just won't actually send until Resend is configured.

```bash
cp .env.example .env.local
```

- [ ] **Step 4: Ensure .env.local is gitignored**

`.gitignore` should already contain `.env*`. Verify:

```bash
grep -E '^\.env' .gitignore
```

Expected output includes `.env*` or similar.

- [ ] **Step 5: Commit**

```bash
git add lib/contact.ts .env.example
git commit -m "feat: contact lib + env scaffolding"
```

---

## Phase 3 — Components (visual)

For each component task: build the component, mount it on the home page (replacing the stub from Task 5 incrementally), run `npm run dev`, and visually compare to the corresponding section in `docs/mockup/index.html`. **You should have the mockup open in a browser tab the entire time.**

### Task 9: LanguageSwitcher component

**Files:**
- Create: `components/LanguageSwitcher.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/lib/i18n";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "nl", label: "NL" },
] as const;

export function LanguageSwitcher() {
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex gap-1 items-center bg-white rounded-full p-1 border border-dashed border-[var(--color-brown-soft)]">
      {LOCALES.map((l) => {
        const active = l.code === current;
        return (
          <Link
            key={l.code}
            href={pathname}
            locale={l.code}
            className={
              "px-3 py-1 rounded-full text-xs font-semibold font-[var(--font-body)] transition-colors " +
              (active
                ? "bg-[var(--color-coral)] text-white"
                : "text-[var(--color-brown)] hover:bg-[var(--color-cream-2)]")
            }
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/LanguageSwitcher.tsx
git commit -m "feat: language switcher"
```

### Task 10: Nav component

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/[locale]/page.tsx`

Translation keys used (will be added in Task 19):
- `nav.about`, `nav.gallery`, `nav.custom`

- [ ] **Step 1: Add the keys to messages/en.json**

Add to `messages/en.json`:

```json
{
  "nav": {
    "about": "About",
    "gallery": "Made with Love",
    "custom": "Custom Orders"
  },
  "hero": {
    "headline": "Hi, I'm Xena"
  }
}
```

(Spanish + Dutch will be filled later in Task 19. For now keep them showing English fallbacks for the nav — duplicate the `nav` block into `es.json` and `nl.json` with English values; we'll translate in Task 19.)

- [ ] **Step 2: Create the component**

```tsx
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(253,245,236,0.82)] border-b border-dashed border-[rgba(184,147,128,0.35)]">
      <div className="max-w-[1180px] mx-auto px-7 py-3.5 flex items-center justify-between gap-7">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-[var(--font-display)] text-[28px] text-[var(--color-coral-dark)] no-underline"
        >
          <span>XO</span>
          <span className="text-[var(--color-coral)]">♡</span>
          <span>Xena</span>
        </a>
        <div className="hidden md:flex gap-7 items-center">
          <NavLink href="#about">{t("about")}</NavLink>
          <NavLink href="#gallery">{t("gallery")}</NavLink>
          <NavLink href="#custom">{t("custom")}</NavLink>
        </div>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[var(--color-brown)] no-underline font-medium text-[15px] py-1 px-0.5 hover:text-[var(--color-coral-dark)]"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 3: Mount it on the page**

Overwrite `app/[locale]/page.tsx`:

```tsx
import { Nav } from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <div style={{ height: "200vh", padding: 40 }}>
          (sections coming soon)
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Compare nav at `http://localhost:3000/en` to the nav in `docs/mockup/index.html`. The brand mark, dashed bottom border, blur, link spacing, and the EN/ES/NL switcher (where the cart was) should match. Switch to `/es`, `/nl` and confirm the active pill changes. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: sticky nav with language switcher"
```

### Task 11: Hero component

**Files:**
- Create: `components/Hero.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/en.json` (add hero keys)

Add to `messages/en.json` under `hero`:

```json
"eyebrow": "Crochet Creations · Made in Small Batches",
"headline": "Hi, I'm",
"name": "Xena",
"tagline": "Cozy little things,",
"taglineUnderlined": "stitched with love.",
"copy": "Hand-crocheted softies, accessories & keepsakes — each one made one stitch at a time from my little corner of the world. Pick a piece from the gallery, or dream up something just for you.",
"ctaPrimary": "See her creations →",
"ctaGhost": "♡ Order something custom"
```

Mirror keys into `es.json` and `nl.json` with English fallback values for now.

- [ ] **Step 1: Create the component**

```tsx
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[60px] pb-[30px] grid md:grid-cols-[1.05fr_1fr] gap-[50px] items-center relative">
      <div>
        <div className="inline-flex items-center gap-2.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-[var(--color-brown-soft)] bg-white px-4 py-2 rounded-full border border-dashed border-[var(--color-brown-soft)] mb-6">
          <span className="w-[7px] h-[7px] rounded-full bg-[var(--color-coral)]" />
          {t("eyebrow")}
        </div>
        <h1 className="font-[var(--font-display)] text-[clamp(64px,8vw,108px)] leading-[0.95] text-[var(--color-coral-dark)] mb-3">
          {t("headline")}
          <br />
          {t("name")}
          <span className="inline-block text-[var(--color-coral)] -rotate-6 text-[0.85em] ml-1">
            ♡
          </span>
        </h1>
        <div className="font-[var(--font-display)] text-[38px] text-[var(--color-brown-2)] leading-none mb-[22px]">
          {t("tagline")}{" "}
          <span className="relative inline-block">
            {t("taglineUnderlined")}
            <span
              className="absolute left-0 right-0 -bottom-1 h-2 bg-no-repeat bg-[length:100%_100%]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8'><path d='M2 5 Q 25 1 50 4 T 98 5' stroke='%23E08A8A' stroke-width='2.5' fill='none' stroke-linecap='round'/></svg>\")",
              }}
            />
          </span>
        </div>
        <p className="text-[17px] text-[var(--color-brown)] max-w-[460px] mb-7">
          {t("copy")}
        </p>
        <div className="flex gap-3.5 flex-wrap">
          <a href="#gallery" className="btn btn-primary">
            {t("ctaPrimary")}
          </a>
          <a href="#custom" className="btn btn-ghost">
            {t("ctaGhost")}
          </a>
        </div>
      </div>
      <div className="relative flex items-center justify-center min-h-[480px]">
        <div className="relative w-full max-w-[460px] aspect-square bg-white rounded-full p-3.5 -rotate-2 shadow-[0_18px_40px_-16px_rgba(92,68,56,0.28)]">
          <div className="absolute inset-0 rounded-full border border-dashed border-[var(--color-coral)] opacity-50 scale-[1.06]" />
          <Image
            src="/logo.png"
            alt="XO Xena — Homemade with Love"
            width={460}
            height={460}
            className="w-full h-full rounded-full object-cover"
            priority
          />
        </div>
        <Yarn className="w-[90px] h-[90px] top-[4%] -right-2.5 bg-[var(--color-mint)] [animation:floaty_8s_ease-in-out_infinite]" />
        <Yarn className="w-[60px] h-[60px] bottom-[18%] -left-2.5 bg-[var(--color-sky)] [animation:floaty_7s_ease-in-out_-2s_infinite]" />
        <Yarn className="w-[70px] h-[70px] top-[38%] right-[18px] bg-[var(--color-butter)] [animation:floaty_9s_ease-in-out_-4s_infinite]" />
        <Yarn className="w-[50px] h-[50px] bottom-[4%] right-[30%] bg-[var(--color-lavender)] [animation:floaty_6s_ease-in-out_-1s_infinite]" />
        <Sparkle className="top-[6%] left-[4%]" />
        <Sparkle className="bottom-[12%] right-[6%] [animation-delay:-1.5s]" />
        <Sparkle className="top-1/2 -left-[2%] [animation-delay:-0.7s]" />
      </div>
    </section>
  );
}

function Yarn({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "absolute rounded-full shadow-[inset_-6px_-8px_0_rgba(0,0,0,0.04),0_8px_24px_-10px_rgba(92,68,56,0.22)] " +
        className
      }
    >
      <div className="absolute inset-[8%] rounded-full border border-dashed border-white/60" />
      <div className="absolute inset-[20%] rounded-full border border-dashed border-white/60 rotate-45" />
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "absolute font-[var(--font-display)] text-[var(--color-coral)] text-2xl pointer-events-none [animation:twinkle_3s_ease-in-out_infinite] " +
        className
      }
    >
      ✦
    </span>
  );
}
```

- [ ] **Step 2: Mount it on the page**

Replace `app/[locale]/page.tsx` with:

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <div style={{ height: "100vh" }} />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000/en` and compare side-by-side with the mockup. Headline size, line breaks, tagline underline squiggle, logo card rotation, four floating yarn balls with their colors, three sparkles. Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: hero section"
```

### Task 12: Marquee component

**Files:**
- Create: `components/Marquee.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/{en,es,nl}.json`

Add to `messages/en.json`:

```json
"marquee": {
  "items": ["made with love", "one stitch at a time", "tiny batches, big hugs", "pastel things only"]
}
```

(Mirror to es.json/nl.json with English values for now.)

- [ ] **Step 1: Create the component**

```tsx
import { useTranslations } from "next-intl";

export function Marquee() {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];
  const line = items.join(" ♡ ");

  return (
    <div className="bg-[var(--color-coral)] text-[var(--color-cream)] py-3.5 overflow-hidden relative mt-10 -rotate-[1.2deg] border-y border-[var(--color-coral-dark)]">
      <div className="flex gap-10 whitespace-nowrap [animation:scroll-x_30s_linear_infinite] font-[var(--font-display)] text-[28px]">
        <span className="inline-flex items-center gap-10">{line} ♡</span>
        <span className="inline-flex items-center gap-10" aria-hidden>
          {line} ♡
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount on page**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <div style={{ height: "60vh" }} />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check + commit**

```bash
npm run dev
```

Confirm the coral band is slightly rotated and scrolls continuously left. Stop server, then:

```bash
git add -A
git commit -m "feat: marquee section"
```

### Task 13: WavyDivider component

**Files:**
- Create: `components/WavyDivider.tsx`

- [ ] **Step 1: Create it**

```tsx
export function WavyDivider() {
  return <div className="wavy" role="presentation" />;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/WavyDivider.tsx
git commit -m "feat: wavy divider"
```

### Task 14: About component

**Files:**
- Create: `components/About.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/en.json` (+ es/nl mirrors)

Add to `messages/en.json`:

```json
"about": {
  "eyebrow": "Meet the Maker",
  "heading": "Yarn, tea, and a whole lot of heart.",
  "p1": "I started crocheting on a rainy afternoon, and somehow never put the hook down. What began as a hobby turned into a tiny studio of softies, scrunchies, and keepsakes — every piece designed slowly, by hand, in pastel palettes I can't help but reach for.",
  "p2": "If you find something here that makes you smile, that's exactly the idea. ♡",
  "signature": "— xx Xena",
  "portraitLabel": "photo of xena · drop file",
  "fact1Number": "3 yrs",
  "fact1Label": "stitching",
  "fact2Number": "200+",
  "fact2Label": "pieces made",
  "fact3Number": "100%",
  "fact3Label": "homemade"
}
```

- [ ] **Step 1: Create the component**

```tsx
import { useTranslations } from "next-intl";

export function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="bg-[linear-gradient(180deg,transparent_0%,var(--color-cream-2)_30%,var(--color-cream-2)_70%,transparent_100%)]"
    >
      <div className="max-w-[1180px] mx-auto px-7 py-20">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-[60px] items-center">
          <Portrait label={t("portraitLabel")} />
          <div>
            <div className="eyebrow">{t("eyebrow")}</div>
            <h2 className="mb-5">{t("heading")}</h2>
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <div className="font-[var(--font-display)] text-4xl text-[var(--color-coral)] mt-3">
              {t("signature")}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-7">
              <Fact n={t("fact1Number")} l={t("fact1Label")} />
              <Fact n={t("fact2Number")} l={t("fact2Label")} />
              <Fact n={t("fact3Number")} l={t("fact3Label")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Portrait({ label }: { label: string }) {
  return (
    <div
      className="relative aspect-[4/5] rounded-[6px] -rotate-3 shadow-[0_18px_40px_-16px_rgba(92,68,56,0.28)] flex items-end justify-center p-5 text-[var(--color-coral-dark)]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(224,138,138,0.12) 0 6px, transparent 6px 14px)",
        backgroundColor: "var(--color-rose)",
      }}
    >
      <span className="absolute -top-4 left-[30%] w-[110px] h-7 bg-white/65 -rotate-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" />
      <span className="absolute -bottom-3.5 right-[22%] w-[90px] h-[26px] rotate-[4deg] shadow-[0_2px_6px_rgba(0,0,0,0.08)] bg-[var(--color-peach)]/85" />
      <span className="font-[var(--font-mono)] text-[11px] tracking-[0.15em] uppercase bg-white px-3.5 py-2 rounded text-[var(--color-brown-soft)]">
        {label}
      </span>
    </div>
  );
}

function Fact({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-white rounded-[14px] py-4 px-4 text-center shadow-[0_8px_24px_-10px_rgba(92,68,56,0.22)] border border-dashed border-[rgba(184,147,128,0.4)]">
      <div className="font-[var(--font-display)] text-[38px] text-[var(--color-coral-dark)] leading-none">
        {n}
      </div>
      <div className="text-[12px] text-[var(--color-brown-soft)] mt-1.5 tracking-[0.1em] uppercase font-[var(--font-mono)]">
        {l}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount on page**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { WavyDivider } from "@/components/WavyDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <WavyDivider />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check + commit**

```bash
npm run dev
```

Compare portrait card rotation, washi-tape strips, fact cards. Stop server, then:

```bash
git add -A
git commit -m "feat: about section"
```

### Task 15: Gallery component

**Files:**
- Create: `components/Gallery.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/en.json` (+ es/nl mirrors)

Add to `messages/en.json`:

```json
"gallery": {
  "eyebrow": "— a peek inside the basket —",
  "heading": "Made with Love",
  "sub": "A little gallery of finished pieces. Snapshots from the studio, the desk, and the windowsill.",
  "items": [
    { "placeholder": "peach bear plushie · pic", "caption": "peach the bear" },
    { "placeholder": "mint cardigan flat-lay · pic", "caption": "spring cardigan" },
    { "placeholder": "lavender bag · pic", "caption": "tote no. 3" },
    { "placeholder": "sky scrunchie set · pic", "caption": "cloud trio" },
    { "placeholder": "rose heart pillow · pic", "caption": "a tiny heart" },
    { "placeholder": "butter bunny softie · pic", "caption": "honey bunny" }
  ]
}
```

- [ ] **Step 1: Create the component**

```tsx
import { useTranslations } from "next-intl";

const ITEM_STYLES = [
  { card: "bg-white -rotate-2 col-span-4", swatch: "bg-[var(--color-peach)]" },
  { card: "bg-[var(--color-cream-2)] rotate-[1.5deg] col-span-5", swatch: "bg-[var(--color-mint)]" },
  { card: "bg-white -rotate-1 col-span-3", swatch: "bg-[var(--color-lavender)]" },
  { card: "bg-[var(--color-rose)] rotate-2 col-span-3", swatch: "bg-[var(--color-sky)]" },
  { card: "bg-white -rotate-[1.5deg] col-span-5", swatch: "bg-[var(--color-rose)]" },
  { card: "bg-[var(--color-cream-2)] rotate-1 col-span-4", swatch: "bg-[var(--color-butter)]" },
];

export function Gallery() {
  const t = useTranslations("gallery");
  const items = t.raw("items") as { placeholder: string; caption: string }[];

  return (
    <section id="gallery">
      <div className="max-w-[1180px] mx-auto px-7 py-20">
        <div className="text-center mb-[50px]">
          <div className="eyebrow mb-2">{t("eyebrow")}</div>
          <h2 className="mb-2.5">{t("heading")}</h2>
          <p className="text-[var(--color-brown-2)] text-base max-w-[520px] mx-auto">
            {t("sub")}
          </p>
        </div>
        <div className="grid grid-cols-12 gap-[22px]">
          {items.map((item, i) => (
            <Photo
              key={i}
              cardClass={ITEM_STYLES[i].card}
              swatchClass={ITEM_STYLES[i].swatch}
              placeholder={item.placeholder}
              caption={item.caption}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Photo({
  cardClass,
  swatchClass,
  placeholder,
  caption,
}: {
  cardClass: string;
  swatchClass: string;
  placeholder: string;
  caption: string;
}) {
  return (
    <div
      className={
        "relative rounded-[6px] overflow-hidden shadow-[0_8px_24px_-10px_rgba(92,68,56,0.22)] pt-2.5 px-2.5 pb-9 transition-transform duration-200 hover:-translate-y-1 sm:col-span-6 col-span-12 " +
        cardClass
      }
    >
      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-[4deg] w-20 h-[22px] bg-white/75 border border-dashed border-[rgba(184,147,128,0.4)] z-10" />
      <div
        className={
          "aspect-square rounded-[4px] flex items-center justify-center relative " +
          swatchClass
        }
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.45) 0 4px, transparent 4px 12px)",
        }}
      >
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] bg-white/85 px-2.5 py-1.5 rounded-[3px] text-[var(--color-brown-soft)] text-center">
          {placeholder}
        </span>
      </div>
      <div className="font-[var(--font-display)] text-[22px] text-[var(--color-brown-2)] text-center mt-2 leading-none">
        {caption}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount on page**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { WavyDivider } from "@/components/WavyDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <WavyDivider />
        <Gallery />
        <WavyDivider />
      </main>
    </>
  );
}
```

- [ ] **Step 3: Visual check + commit**

```bash
npm run dev
```

Verify 6 photo cards with different rotations and swatches, mockup-matching layout. On narrow screens (DevTools < 880px), cards should stack into 2 columns; under 520px, 1 column. Stop server, then:

```bash
git add -A
git commit -m "feat: gallery section"
```

### Task 16: Footer component

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/en.json` (+ mirrors)

Add to `messages/en.json`:

```json
"footer": {
  "brand": "XO Xena",
  "tag": "Homemade with love · Crochet creations from a little corner of the world.",
  "wanderHeading": "Wander",
  "sayHiHeading": "Say hi",
  "shippingLink": "shipping & care",
  "copyright": "© 2026 XO Xena · Made by hand, sent with love.",
  "footerNote": "♡ one stitch at a time ♡"
}
```

- [ ] **Step 1: Create the component**

```tsx
import { useTranslations } from "next-intl";
import { contact } from "@/lib/contact";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="mt-10 bg-[var(--color-brown)] text-[var(--color-cream)] px-7 pt-[60px] pb-[30px] relative">
      <span
        className="absolute -top-4 left-0 right-0 h-4 bg-repeat-x"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 16' preserveAspectRatio='none'><path d='M0 16 Q 10 0 20 16 Q 30 0 40 16 Z' fill='%235C4438'/></svg>\")",
          backgroundSize: "40px 16px",
        }}
      />
      <div className="max-w-[1180px] mx-auto grid md:grid-cols-[1.4fr_1fr_1fr] grid-cols-1 gap-10">
        <div>
          <div className="font-[var(--font-display)] text-[38px] text-[var(--color-rose)] leading-tight">
            {t("brand")}
          </div>
          <div className="font-[var(--font-body)] text-sm text-[var(--color-cream-3)] mt-2">
            {t("tag")}
          </div>
        </div>
        <FooterCol heading={t("wanderHeading")}>
          <FooterLink href="#about">{tn("about")}</FooterLink>
          <FooterLink href="#gallery">{tn("gallery")}</FooterLink>
          <FooterLink href="#custom">{tn("custom")}</FooterLink>
        </FooterCol>
        <FooterCol heading={t("sayHiHeading")}>
          <FooterLink href={contact.instagram}>instagram</FooterLink>
          <FooterLink href={contact.whatsapp}>whatsapp</FooterLink>
          <FooterLink href={contact.email}>email</FooterLink>
          <FooterLink href="#">{t("shippingLink")}</FooterLink>
        </FooterCol>
      </div>
      <div className="max-w-[1180px] mx-auto mt-10 pt-6 border-t border-dashed border-white/15 flex justify-between flex-wrap gap-2.5 text-xs text-[var(--color-cream-3)]">
        <div>{t("copyright")}</div>
        <div>{t("footerNote")}</div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-rose)] m-0 mb-3.5">
        {heading}
      </h4>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="block text-[var(--color-cream-2)] no-underline text-sm mb-2 hover:text-[var(--color-rose)]"
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Mount on page**

Add `<Footer />` after the last `<WavyDivider />`:

```tsx
import { Footer } from "@/components/Footer";
// …
<Footer />
```

- [ ] **Step 3: Visual check + commit**

Confirm footer brand color (rose on brown), zigzag top edge, three columns on desktop / stacked on mobile. Commit:

```bash
git add -A
git commit -m "feat: footer section"
```

---

## Phase 4 — Custom Orders form + Server Action

### Task 17: send-order server action

**Files:**
- Create: `app/actions/send-order.ts`

- [ ] **Step 1: Implement the server action**

```ts
"use server";

import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  type: z.string().min(1),
  palette: z.array(z.string()).min(1, "Pick at least one colour"),
  budget: z.string().min(1),
  idea: z.string().max(2000).optional().default(""),
});

export type SendOrderResult =
  | { ok: true }
  | { ok: false; error: string };

export async function sendOrder(formData: FormData): Promise<SendOrderResult> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    type: formData.get("type"),
    palette: formData.getAll("palette").map((v) => String(v)),
    budget: formData.get("budget"),
    idea: formData.get("idea") || "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || !from || !to) {
    return {
      ok: false,
      error: "Email is not configured yet. Please try again later.",
    };
  }

  const { name, email, type, palette, budget, idea } = parsed.data;

  const html = `
    <h2 style="font-family: serif; color: #C46B6B;">New custom order request 🪡</h2>
    <p><strong>Name:</strong> ${escape(name)}</p>
    <p><strong>Email:</strong> ${escape(email)}</p>
    <p><strong>What:</strong> ${escape(type)}</p>
    <p><strong>Palette:</strong> ${palette.map(escape).join(", ")}</p>
    <p><strong>Budget:</strong> ${escape(budget)}</p>
    <p><strong>Idea:</strong></p>
    <blockquote style="border-left: 3px solid #E08A8A; padding-left: 12px; color: #5C4438;">
      ${escape(idea).replace(/\n/g, "<br>")}
    </blockquote>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `🧶 New custom order from ${name}`,
    html,
  });

  if (error) {
    return { ok: false, error: "We couldn't send your note — please try again." };
  }

  return { ok: true };
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

- [ ] **Step 2: Commit**

```bash
git add app/actions/send-order.ts
git commit -m "feat: send-order server action with Resend + Zod"
```

### Task 18: OrderForm + CustomOrders components

**Files:**
- Create: `components/OrderForm.tsx`, `components/CustomOrders.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/en.json` (+ mirrors)

Add to `messages/en.json`:

```json
"custom": {
  "eyebrow": "— Made just for you —",
  "heading1": "Dream it,",
  "heading2": "I'll stitch it.",
  "copy": "Got something specific in mind? A bear in your best friend's favourite colour, a baby blanket for a new arrival, a matching scrunchie set? Tell me about it below and I'll get back to you with a sketch & quote within a few days.",
  "checklist1": "Plushies, hats, bags, scrunchies, blankets — bring your idea.",
  "checklist2": "I'll send a little sketch + colour palette before stitching.",
  "checklist3": "Most pieces ship in 2–4 weeks (it's all by hand!).",
  "checklist4": "Worldwide shipping, packaged with care.",
  "formIntro": "Tell me about your idea",
  "name": "Your name",
  "namePh": "e.g. Sophie",
  "email": "Email",
  "emailPh": "you@somewhere.com",
  "whatLabel": "What would you like?",
  "typePlushie": "Plushie",
  "typeHat": "Hat / beanie",
  "typeBag": "Bag / tote",
  "typeBlanket": "Blanket",
  "typeScrunchie": "Scrunchie set",
  "typeOther": "Something else",
  "paletteLabel": "Pick your palette (any number)",
  "pRose": "rose",
  "pMint": "mint",
  "pSky": "sky",
  "pPeach": "peach",
  "pButter": "butter",
  "pLavender": "lavender",
  "pCream": "cream",
  "budgetLabel": "Rough budget",
  "budget1": "Under €40",
  "budget2": "€40–80",
  "budget3": "€80–150",
  "budget4": "€150+",
  "budget5": "not sure yet ♡",
  "ideaLabel": "Tell me about it",
  "ideaPh": "A little bear that looks like my dog Mochi…",
  "priceHint": "free sketch + quote ♡",
  "submit": "Send my idea →",
  "successHeading": "Yay, your note is on its way!",
  "successCopy": "I'll write back within 2–3 days with a little sketch & quote. Until then, thank you so much for thinking of me. ♡"
}
```

- [ ] **Step 1: Create OrderForm.tsx**

```tsx
"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { sendOrder } from "@/app/actions/send-order";

const TYPE_KEYS = [
  "typePlushie",
  "typeHat",
  "typeBag",
  "typeBlanket",
  "typeScrunchie",
  "typeOther",
] as const;

const PALETTE_KEYS = [
  { id: "rose", label: "pRose", color: "var(--color-rose)" },
  { id: "mint", label: "pMint", color: "var(--color-mint)" },
  { id: "sky", label: "pSky", color: "var(--color-sky)" },
  { id: "peach", label: "pPeach", color: "var(--color-peach)" },
  { id: "butter", label: "pButter", color: "var(--color-butter)" },
  { id: "lavender", label: "pLavender", color: "var(--color-lavender)" },
  { id: "cream", label: "pCream", color: "var(--color-cream-2)" },
] as const;

const BUDGET_KEYS = ["budget1", "budget2", "budget3", "budget4", "budget5"] as const;

export function OrderForm() {
  const t = useTranslations("custom");
  const [type, setType] = useState<(typeof TYPE_KEYS)[number]>("typePlushie");
  const [palette, setPalette] = useState<Set<string>>(new Set(["rose"]));
  const [budget, setBudget] = useState<(typeof BUDGET_KEYS)[number]>("budget2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function togglePalette(id: string) {
    setPalette((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("type", t(type));
    palette.forEach((p) => fd.append("palette", p));
    fd.set("budget", t(budget));
    fd.set("idea", idea);

    startTransition(async () => {
      const result = await sendOrder(fd);
      if (result.ok) setSent(true);
      else setError(result.error);
    });
  }

  if (sent) {
    return (
      <div className="text-center px-2.5 py-10">
        <div className="text-7xl">♡</div>
        <h3 className="font-[var(--font-display)] text-[42px] text-[var(--color-coral-dark)] mb-2.5">
          {t("successHeading")}
        </h3>
        <p className="text-[var(--color-brown-2)]">{t("successCopy")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="eyebrow mb-3.5 relative z-10">{t("formIntro")}</div>

      <Field label={t("name")}>
        <input
          type="text"
          required
          placeholder={t("namePh")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={t("email")}>
        <input
          type="email"
          required
          placeholder={t("emailPh")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={t("whatLabel")}>
        <div className="flex flex-wrap gap-2 relative z-10">
          {TYPE_KEYS.map((k) => (
            <Chip key={k} on={type === k} onClick={() => setType(k)}>
              {t(k)}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label={t("paletteLabel")}>
        <div className="flex flex-wrap gap-2 relative z-10">
          {PALETTE_KEYS.map((p) => {
            const on = palette.has(p.id);
            return (
              <Chip key={p.id} on={on} onClick={() => togglePalette(p.id)}>
                {!on && (
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
                    style={{
                      background: p.color,
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  />
                )}
                {t(p.label)}
              </Chip>
            );
          })}
        </div>
      </Field>

      <Field label={t("budgetLabel")}>
        <select
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value as (typeof BUDGET_KEYS)[number])
          }
          className={inputClass}
        >
          {BUDGET_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(k)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("ideaLabel")}>
        <textarea
          placeholder={t("ideaPh")}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className={inputClass + " resize-y min-h-[90px]"}
        />
      </Field>

      {error && (
        <div className="text-sm text-[var(--color-coral-dark)] mb-3">{error}</div>
      )}

      <div className="flex items-center justify-between mt-5.5 gap-3.5 flex-wrap">
        <div className="font-[var(--font-display)] text-[var(--color-brown-2)] text-[22px]">
          {t("priceHint")}
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "…" : t("submit")}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full border-[1.5px] border-[var(--color-cream-3)] bg-[var(--color-cream)] rounded-[12px] py-3 px-3.5 font-[var(--font-body)] text-[15px] text-[var(--color-brown)] outline-none transition focus:border-[var(--color-coral)] focus:bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 relative">
      <label className="block font-[var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-[var(--color-brown-soft)] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "border-[1.5px] rounded-full px-3.5 py-1.5 text-[13px] font-semibold font-[var(--font-body)] cursor-pointer transition-all " +
        (on
          ? "bg-[var(--color-coral)] text-white border-[var(--color-coral)]"
          : "bg-[var(--color-cream)] text-[var(--color-brown)] border-[var(--color-cream-3)] hover:border-[var(--color-coral)]")
      }
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create CustomOrders.tsx**

```tsx
import { useTranslations } from "next-intl";
import { OrderForm } from "./OrderForm";

export function CustomOrders() {
  const t = useTranslations("custom");

  return (
    <section id="custom">
      <div className="max-w-[1180px] mx-auto px-7 py-20">
        <div className="grid md:grid-cols-2 gap-[60px] items-center">
          <div>
            <div className="eyebrow">{t("eyebrow")}</div>
            <h2 className="mb-4.5">
              {t("heading1")}
              <br />
              {t("heading2")}
            </h2>
            <p className="text-[var(--color-brown)] text-[17px]">{t("copy")}</p>
            <ul className="list-none p-0 m-0 mt-4.5">
              {(["checklist1", "checklist2", "checklist3", "checklist4"] as const).map(
                (k) => (
                  <li
                    key={k}
                    className="py-2 pl-8 relative text-[var(--color-brown)] text-[15px]"
                  >
                    <span className="absolute left-1 top-[6px] text-[var(--color-coral)] text-[16px]">
                      ♡
                    </span>
                    {t(k)}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="relative bg-white rounded-[26px] p-9 shadow-[0_18px_40px_-16px_rgba(92,68,56,0.28)] border-[1.5px] border-dashed border-[rgba(224,138,138,0.4)]">
            <span className="absolute inset-2 border border-dashed border-[rgba(184,147,128,0.25)] rounded-[20px] pointer-events-none" />
            <OrderForm />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount on page**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { CustomOrders } from "@/components/CustomOrders";
import { Footer } from "@/components/Footer";
import { WavyDivider } from "@/components/WavyDivider";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <WavyDivider />
        <Gallery />
        <WavyDivider />
        <CustomOrders />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open `/en`. Confirm the entire single-page layout matches the mockup: hero → marquee → about → wavy → gallery → wavy → custom orders → footer. Try filling the form and submitting; with placeholder env vars you should see the "Email is not configured yet" message — that's expected until Resend is wired in production.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: custom orders section + form with server action"
```

---

## Phase 5 — Polish

### Task 19: Translate ES and NL message files

**Files:**
- Modify: `messages/es.json`, `messages/nl.json`

The user is happy with English as the default. For ES and NL, replicate the structure of `en.json` and translate the values. Below are full translations.

- [ ] **Step 1: Overwrite messages/es.json**

```json
{
  "nav": {
    "about": "Sobre mí",
    "gallery": "Hecho con amor",
    "custom": "Encargos"
  },
  "hero": {
    "eyebrow": "Creaciones de ganchillo · Hechas en pequeñas tandas",
    "headline": "Hola, soy",
    "name": "Xena",
    "tagline": "Pequeñas cosas acogedoras,",
    "taglineUnderlined": "tejidas con amor.",
    "copy": "Peluches, accesorios y recuerditos hechos a ganchillo — uno a uno, punto a punto, desde mi pequeño rincón del mundo. Elige una pieza de la galería o imagina algo solo para ti.",
    "ctaPrimary": "Ver sus creaciones →",
    "ctaGhost": "♡ Encargar algo a medida"
  },
  "marquee": {
    "items": ["hecho con amor", "punto a punto", "tandas pequeñas, abrazos grandes", "solo cosas pastel"]
  },
  "about": {
    "eyebrow": "Conoce a la creadora",
    "heading": "Hilo, té y mucho corazón.",
    "p1": "Empecé a hacer ganchillo una tarde lluviosa y, de algún modo, ya no he soltado la aguja. Lo que empezó como hobby se convirtió en un pequeño estudio de peluches, scrunchies y recuerdos — cada pieza diseñada despacio, a mano, en paletas pastel a las que no puedo resistirme.",
    "p2": "Si encuentras algo aquí que te haga sonreír, esa es justo la idea. ♡",
    "signature": "— xx Xena",
    "portraitLabel": "foto de xena · suelta archivo",
    "fact1Number": "3 años",
    "fact1Label": "tejiendo",
    "fact2Number": "200+",
    "fact2Label": "piezas hechas",
    "fact3Number": "100%",
    "fact3Label": "hecho a mano"
  },
  "gallery": {
    "eyebrow": "— un vistazo dentro de la cesta —",
    "heading": "Hecho con amor",
    "sub": "Una pequeña galería de piezas terminadas. Instantáneas del estudio, del escritorio y de la ventana.",
    "items": [
      { "placeholder": "osito melocotón · foto", "caption": "osito melocotón" },
      { "placeholder": "cárdigan menta · foto", "caption": "cárdigan de primavera" },
      { "placeholder": "bolso lavanda · foto", "caption": "tote nº 3" },
      { "placeholder": "scrunchies cielo · foto", "caption": "trío nube" },
      { "placeholder": "cojín corazón rosa · foto", "caption": "un corazoncito" },
      { "placeholder": "conejito mantequilla · foto", "caption": "conejito miel" }
    ]
  },
  "custom": {
    "eyebrow": "— hecho solo para ti —",
    "heading1": "Imagínalo,",
    "heading2": "yo lo tejo.",
    "copy": "¿Tienes algo concreto en mente? ¿Un oso en el color favorito de tu mejor amiga, una mantita para un bebé, un set de scrunchies a juego? Cuéntamelo aquí y te responderé con un boceto y presupuesto en unos días.",
    "checklist1": "Peluches, gorros, bolsos, scrunchies, mantas — trae tu idea.",
    "checklist2": "Te enviaré un boceto y paleta antes de empezar.",
    "checklist3": "La mayoría de piezas llegan en 2–4 semanas (¡todo a mano!).",
    "checklist4": "Envíos a todo el mundo, empaquetado con cariño.",
    "formIntro": "Cuéntame tu idea",
    "name": "Tu nombre",
    "namePh": "p. ej. Sofía",
    "email": "Email",
    "emailPh": "tu@correo.com",
    "whatLabel": "¿Qué te gustaría?",
    "typePlushie": "Peluche",
    "typeHat": "Gorro",
    "typeBag": "Bolso",
    "typeBlanket": "Manta",
    "typeScrunchie": "Set de scrunchies",
    "typeOther": "Otra cosa",
    "paletteLabel": "Elige tu paleta (las que quieras)",
    "pRose": "rosa",
    "pMint": "menta",
    "pSky": "cielo",
    "pPeach": "melocotón",
    "pButter": "mantequilla",
    "pLavender": "lavanda",
    "pCream": "crema",
    "budgetLabel": "Presupuesto orientativo",
    "budget1": "Menos de €40",
    "budget2": "€40–80",
    "budget3": "€80–150",
    "budget4": "€150+",
    "budget5": "todavía no lo sé ♡",
    "ideaLabel": "Cuéntamelo",
    "ideaPh": "Un osito que se parezca a mi perro Mochi…",
    "priceHint": "boceto y presupuesto gratis ♡",
    "submit": "Enviar mi idea →",
    "successHeading": "¡Yupi, tu mensaje está en camino!",
    "successCopy": "Te responderé en 2–3 días con un boceto y presupuesto. Mientras tanto, ¡gracias por pensar en mí! ♡"
  },
  "footer": {
    "brand": "XO Xena",
    "tag": "Hecho con amor · creaciones de ganchillo desde un pequeño rincón del mundo.",
    "wanderHeading": "Pasea",
    "sayHiHeading": "Saluda",
    "shippingLink": "envíos y cuidados",
    "copyright": "© 2026 XO Xena · hecho a mano, enviado con amor.",
    "footerNote": "♡ punto a punto ♡"
  }
}
```

- [ ] **Step 2: Overwrite messages/nl.json**

```json
{
  "nav": {
    "about": "Over",
    "gallery": "Met liefde gemaakt",
    "custom": "Op maat"
  },
  "hero": {
    "eyebrow": "Haakcreaties · Met de hand gemaakt",
    "headline": "Hoi, ik ben",
    "name": "Xena",
    "tagline": "Lieve kleine dingen,",
    "taglineUnderlined": "met liefde gehaakt.",
    "copy": "Met de hand gehaakte knuffels, accessoires en aandenkens — stuk voor stuk gemaakt vanuit mijn kleine hoekje van de wereld. Kies iets uit de galerij of laat iets speciaals voor jou maken.",
    "ctaPrimary": "Bekijk haar werk →",
    "ctaGhost": "♡ Iets op maat bestellen"
  },
  "marquee": {
    "items": ["met liefde gemaakt", "steek voor steek", "kleine batches, grote knuffels", "alleen pastelkleuren"]
  },
  "about": {
    "eyebrow": "Maak kennis met Xena",
    "heading": "Wol, thee en heel veel hart.",
    "p1": "Op een regenachtige middag begon ik te haken en sindsdien is de haaknaald nooit meer uit mijn hand geweest. Wat als hobby begon, werd een klein atelier vol knuffels, scrunchies en aandenkens — elk stuk langzaam ontworpen, met de hand, in pasteltinten waar ik niet vanaf kan blijven.",
    "p2": "Als iets je hier laat glimlachen, dan is dat precies de bedoeling. ♡",
    "signature": "— xx Xena",
    "portraitLabel": "foto van xena · sleep bestand",
    "fact1Number": "3 jaar",
    "fact1Label": "haken",
    "fact2Number": "200+",
    "fact2Label": "stuks gemaakt",
    "fact3Number": "100%",
    "fact3Label": "handgemaakt"
  },
  "gallery": {
    "eyebrow": "— een kijkje in het mandje —",
    "heading": "Met liefde gemaakt",
    "sub": "Een kleine galerij van afgewerkte stukjes. Foto's uit het atelier, van het bureau en de vensterbank.",
    "items": [
      { "placeholder": "perzik beertje · foto", "caption": "perzik de beer" },
      { "placeholder": "munt vestje · foto", "caption": "lentevest" },
      { "placeholder": "lavendel tas · foto", "caption": "tote nr. 3" },
      { "placeholder": "lucht scrunchies · foto", "caption": "wolkjes trio" },
      { "placeholder": "roze hart kussen · foto", "caption": "een klein hartje" },
      { "placeholder": "boter konijntje · foto", "caption": "honingkonijntje" }
    ]
  },
  "custom": {
    "eyebrow": "— speciaal voor jou —",
    "heading1": "Droom het,",
    "heading2": "ik haak het.",
    "copy": "Iets specifieks in gedachten? Een beertje in de lievelingskleur van je beste vriendin, een dekentje voor een pasgeborene, een setje bijpassende scrunchies? Vertel het me hieronder en ik kom binnen een paar dagen terug met een schets en prijs.",
    "checklist1": "Knuffels, mutsen, tassen, scrunchies, dekens — kom maar op met je idee.",
    "checklist2": "Ik stuur een schetsje + kleurenpalet voor ik begin.",
    "checklist3": "De meeste stukken worden in 2–4 weken verzonden (alles met de hand!).",
    "checklist4": "Wereldwijde verzending, met zorg verpakt.",
    "formIntro": "Vertel me over je idee",
    "name": "Je naam",
    "namePh": "bijv. Sophie",
    "email": "E-mail",
    "emailPh": "jij@ergens.com",
    "whatLabel": "Wat wil je graag?",
    "typePlushie": "Knuffel",
    "typeHat": "Muts",
    "typeBag": "Tas",
    "typeBlanket": "Deken",
    "typeScrunchie": "Scrunchie-set",
    "typeOther": "Iets anders",
    "paletteLabel": "Kies je palet (zoveel als je wilt)",
    "pRose": "roos",
    "pMint": "munt",
    "pSky": "lucht",
    "pPeach": "perzik",
    "pButter": "boter",
    "pLavender": "lavendel",
    "pCream": "crème",
    "budgetLabel": "Globaal budget",
    "budget1": "Onder €40",
    "budget2": "€40–80",
    "budget3": "€80–150",
    "budget4": "€150+",
    "budget5": "nog niet zeker ♡",
    "ideaLabel": "Vertel het me",
    "ideaPh": "Een klein beertje dat lijkt op mijn hondje Mochi…",
    "priceHint": "gratis schets + prijs ♡",
    "submit": "Stuur mijn idee →",
    "successHeading": "Joepie, je berichtje is onderweg!",
    "successCopy": "Ik laat binnen 2–3 dagen iets weten met een schetsje en prijs. Bedankt voor het denken aan mij! ♡"
  },
  "footer": {
    "brand": "XO Xena",
    "tag": "Met liefde gemaakt · haakcreaties uit een klein hoekje van de wereld.",
    "wanderHeading": "Dwaal rond",
    "sayHiHeading": "Zeg hallo",
    "shippingLink": "verzending & onderhoud",
    "copyright": "© 2026 XO Xena · met de hand gemaakt, met liefde verzonden.",
    "footerNote": "♡ steek voor steek ♡"
  }
}
```

- [ ] **Step 3: Visual check all locales**

```bash
npm run dev
```

Visit `/en`, `/es`, `/nl`. Every visible string should be translated; layout should stay identical (no overflow, no clipped text). Stop server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: full ES + NL translations"
```

### Task 20: Smooth scroll behaviour

**Files:**
- Create: `components/SmoothScroll.tsx`
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement)?.closest('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: (target as HTMLElement).offsetTop - 60,
        behavior: "smooth",
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
```

- [ ] **Step 2: Mount in layout**

In `app/[locale]/layout.tsx`, import and place inside the body:

```tsx
import { SmoothScroll } from "@/components/SmoothScroll";
// …
<body>
  <SmoothScroll />
  <NextIntlClientProvider>{children}</NextIntlClientProvider>
</body>
```

- [ ] **Step 3: Verify and commit**

```bash
npm run dev
```

Click nav links — they should smoothly scroll to each section. Stop server, then:

```bash
git add -A
git commit -m "feat: smooth in-page scroll"
```

### Task 21: Build + Lighthouse sanity check

**Files:** none

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: build completes without errors. Address any TypeScript or build errors before continuing.

- [ ] **Step 2: Local production smoke test**

```bash
npm run start
```

Open `http://localhost:3000`. Verify the redirect to `/en` works. Click through `/es`, `/nl`. Stop server.

- [ ] **Step 3: Commit any fixes**

If you made fixes:

```bash
git add -A
git commit -m "fix: build issues from production smoke test"
```

If no fixes needed, skip this step.

---

## Phase 6 — Deploy

### Task 22: Connect GitHub remote and push

**Files:** none

- [ ] **Step 1: Set the remote**

```bash
git remote add origin https://github.com/sjuniorm/xoxena.git
git remote -v
```

Expected output shows `origin https://github.com/sjuniorm/xoxena.git (fetch)` and `(push)`.

- [ ] **Step 2: Rename branch to main if needed**

```bash
git branch -M main
```

- [ ] **Step 3: Push**

```bash
git push -u origin main
```

If the remote repo isn't empty and contains an initial README/LICENSE, you'll see a non-fast-forward error. In that case, **stop and ask the user** how to proceed — do not force-push.

### Task 23: Deploy to Vercel

This task can be done via the Vercel dashboard or the CLI. The CLI version is below; the user can also import the repo on vercel.com.

- [ ] **Step 1: Install Vercel CLI (if not installed)**

```bash
npm install -g vercel
```

- [ ] **Step 2: Link the project**

```bash
vercel link
```

Follow prompts to link to the user's Vercel account, create a new project named `xoxena`.

- [ ] **Step 3: Add environment variables**

For each of the following, run `vercel env add <NAME> production` and paste a placeholder value (the user will fill in real values later via the Vercel dashboard):

- `RESEND_API_KEY` — placeholder `re_placeholder`
- `RESEND_FROM_EMAIL` — placeholder `orders@xoxena.com`
- `CONTACT_EMAIL` — placeholder `hello@xoxena.com`
- `NEXT_PUBLIC_INSTAGRAM_URL` — `https://instagram.com/xoxena`
- `NEXT_PUBLIC_WHATSAPP_URL` — `https://wa.me/34000000000`
- `NEXT_PUBLIC_CONTACT_EMAIL` — `mailto:hello@xoxena.com`

Also add the same to `preview` and `development` (or just to all environments).

- [ ] **Step 4: Deploy preview**

```bash
vercel
```

Note the preview URL. Visit it and confirm `/`, `/en`, `/es`, `/nl` all render.

- [ ] **Step 5: Deploy production**

```bash
vercel --prod
```

Note the production URL. Visit it and verify the same. Stop the moment you've confirmed it works.

- [ ] **Step 6: Final commit (if Vercel created any project files)**

```bash
git status
```

If `.vercel/` was created, it should already be in the default `.gitignore`. If anything else was added (e.g., a `vercel.json` you intentionally created), commit it:

```bash
git add -A
git commit -m "chore: vercel project config"
git push
```

---

## Self-Review

**Spec coverage check:**
- Visual fidelity to mockup → Tasks 7, 11–18 build every section to match
- Multi-language (en/es/nl) → Tasks 4, 5, 19
- Custom Orders form → email Xena via Resend → Tasks 17, 18
- Shop omitted but architecture preserves the option → No shop code introduced; palette and components stay generic
- Vercel deploy + GitHub push → Tasks 22, 23
- Environment variables for contact/email → Task 8

**No placeholders:** every step contains the actual code, command, or content needed.

**Type consistency:** `SendOrderResult` from the server action matches what `OrderForm` consumes via `result.ok`. `routing` from `i18n/routing.ts` is imported consistently. CSS variables (`--color-*`, `--font-*`) are defined once in `app/globals.css` and reused everywhere.
