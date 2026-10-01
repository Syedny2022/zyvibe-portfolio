# CLAUDE.md

> Build brief for **Claude Code** working on `Syedny2022/zyvibe-portfolio`.
> Operator: **Moh (Syed Moh)** — solo founder, Zyvibe Network.
> Target: production portfolio at **https://zyvibe.me** — **lead-gen first**, not a prototype.

## 1 — Positioning (overrides the scaffold)

Moh is **not** a freelancer. He is:
- A **one-person engineering studio** (ex-Citibank full-stack, 4 yrs enterprise reps)
- A **multi-brand founder** (Zyvibe Network: zyvibe.com, zyvibe.co, feevibe.com, helthvibe.com, hokvibe.com)
- An **edge-native builder** — Cloudflare Workers, AI agents, Next.js, Supabase, Claude Agent SDK

Framing vibe: *"Future Apple Silicon."* Bold, confident, bleeding-edge. Studio brand, not résumé.

## 2 — Lead-gen is the primary job

This is a conversion page, not a gallery. Every section should move a visitor toward one of these five segments — each with its own CTA:

| Segment | Pain | CTA label |
|---|---|---|
| Startup founders | "I need an MVP yesterday" | **Launch your MVP in 30 days** |
| AI / automation buyers | "My team drowns in manual ops" | **Deploy a working agent, not a demo** |
| Design-forward brands | "Our site is slow and ugly" | **Edge-fast sites that convert** |
| Legacy SaaS owners | "Our stack is held together by duct tape" | **Replace your stack, not patch it** |
| Hiring managers | "We need a senior who ships" | **Hire me as fractional staff eng** |

Global sticky CTA in the header: **“Book an intro call”** (Calendly). Repeat in footer. Hero gets the primary CTA + “See the work.”

**Lead capture form** (bottom + modal): name, email, segment picker, one-line context. Submit → `/api/lead` Worker route (already scaffolded in `src/index.js`) → Resend email to `moh@zyvibe.com` + optional HubSpot push.

## 3 — Visual direction (replace the scaffold palette)

**References attached in chat:**
1. **Ratan Design** — fiery eclipse behind portrait, huge bold display, “INSPIRE” highlight in orange, stat row, pill CTAs.
2. **Fluxora** — glowing orange headband portrait, stat cards (150+, 98%), partner logos, team studio section.

**Palette (swap in; drop the cyan/violet scaffold):**

```
--bg:        #0A0A0A
--surface:   #141414
--text:      #F5F5F5
--text-dim:  #A3A3A3
--accent:    #FF6B1A   /* primary orange */
--accent-2:  #FF3D00   /* hot red-orange, for highlights */
--glow:      radial-gradient(circle, #FF6B1A33, transparent 60%)
```

**Typography:** display font with real weight — **Clash Display**, **Space Grotesk 700**, or **Instrument Serif** for italic accents (like Fluxora's cursive “Machines”). Mono for stat captions.

**Hero:** full-bleed portrait of Moh with an orange eclipse / glow behind him. Massive display headline. Primary CTA pill. Stat row. Partner / brand chip row (Citibank + the five Zyvibe brands).

**Imagery:** reuse **Moh's actual photos** from the earlier portfolio session:
- `IMG_2075.jpeg` — waterfront, white shirt (hero candidate)
- `IMG_3001.jpeg` — Grand Cherokee, black tee (about section)

Claude Code can pull these from the local Pictures / Downloads folder via device access, or Moh will re-attach when prompted.

## 4 — Required sections (in order)

1. **Hero** — portrait + display headline + primary CTA + stat row
2. **Trust strip** — Zyvibe network logos + Citibank badge
3. **What I ship** — the five lead segments as cards with per-segment CTAs
4. **Selected work** — the five Zyvibe properties as case-study cards (pull live GA4 metrics if available)
5. **How it works** — 3-step engagement model (discovery → scope → ship)
6. **About / origin** — Citi → founder arc, personal photo
7. **FAQ** — 6–8 questions, schema-marked (GEO / AEO ammo)
8. **Lead form** — name, email, segment, context
9. **Footer** — global CTA repeat + socials + Zyvibe property links

## 5 — SEO + GEO + AEO + meta

- **GA4:** `G-N0FVGWQKJN` (unified property). GTM container `GT-NNXKN8VR`.
- **Search Console:** add `zyvibe.me` as a URL-prefix property. Submit `/sitemap.xml`.
- **JSON-LD:** `Person`, `WebSite`, `ProfessionalService`, `FAQPage`, `BreadcrumbList`. All in `<head>`.
- **Open Graph + Twitter cards:** regenerate `public/og.png` (1200×630) with orange brand (not scaffold placeholder).
- **GEO / AEO:** write FAQ answers in direct-answer style so LLM crawlers can lift them cleanly. First paragraph of every section should answer who / what / why in one sentence.
- **Canonical:** `https://zyvibe.me/`.
- **robots.txt:** allow all. Sitemap link already in place.
- **Cloudflare Web Analytics:** add the beacon script in `<head>`.

## 6 — Deployment: Cloudflare Workers (not Pages, not GH Pages)

Config lives in `wrangler.toml` at repo root. Deploy pipeline:

```bash
npm install              # pulls wrangler locally
npx wrangler login       # one-time, opens browser
npx wrangler deploy      # builds + pushes to Cloudflare
```

The `[assets]` block tells Workers to serve `./public/` as static assets via the `ASSETS` binding. `src/index.js` is the Worker entry — forwards to `env.ASSETS.fetch(request)` for static files, handles `/api/lead` POST for the form.

**Custom domain binding:** `wrangler.toml` has `custom_domain = true` on the `zyvibe.me` and `www.zyvibe.me` routes. On first `wrangler deploy`, Cloudflare auto-provisions the hostname and SSL cert. **This replaces the GitHub Pages flow.** The `CNAME` file at repo root and the GitHub Pages site should be removed once Workers is live.

**GitHub Actions auto-deploy:** `.github/workflows/deploy.yml` uses `cloudflare/wrangler-action@v3` so every push to `main` deploys. Secrets needed in GitHub repo Settings → Secrets:
- `CLOUDFLARE_API_TOKEN` — create at <https://dash.cloudflare.com/profile/api-tokens> with scopes: Workers Scripts:Edit, Workers Routes:Edit, Account:Read, Zone:Read.
- `CLOUDFLARE_ACCOUNT_ID` — `e1cb3924f7241d365db4c35482820735`.

Worker secrets (for `/api/lead`), set via `wrangler secret put`:
- `RESEND_API_KEY`
- `HUBSPOT_TOKEN` (optional — lead push to CRM)
- `CF_TURNSTILE_SECRET` (optional — anti-spam)

## 7 — Access inventory (what Claude Code can reach)

Via **Composio** (connected to Moh's account):
- GitHub (`Syedny2022`) — repo r/w ✅
- Cloudflare — zone read ✅ / DNS edit ❌ (token scope limited; upgrade via Composio dashboard)
- Google Analytics 4 ✅
- Google Search Console ✅
- Google Drive / Docs / Sheets / Calendar / Tasks ✅
- Slack ✅ · Notion ✅ · HubSpot ✅ · Supabase ✅ · Vercel ✅ · Resend ✅
- Also listed in Composio: Discord, Facebook, Instagram, Meta Ads, Make, Stripe, Gumroad, Whop, YouTube, Square, OpenRouter, Tavily

Via **claude-in-chrome** extension: full browser automation on Moh's Chrome.

Via **Claude Code desktop**: local filesystem + shell. Use this to pull photo files from Moh's Pictures folder, run `wrangler dev` for local preview, run `wrangler deploy` to ship.

## 8 — Build order (recommended)

1. `wrangler login` on Moh's machine (one-time).
2. Delete `CNAME` from repo root (switching off Pages).
3. Reorganize: move `index.html`, `robots.txt`, `sitemap.xml`, `_headers` into `public/`.
4. **Replace `public/index.html` with the real build** — fiery palette, Moh's photo, five lead-segment CTAs. See §3 – §4.
5. Add branded `public/og.png` (1200×630).
6. Wire GA4 + GTM scripts in `<head>`.
7. Add JSON-LD block (Person, WebSite, ProfessionalService, FAQPage, BreadcrumbList).
8. Build the lead-capture form; wire POST to `/api/lead` (already scaffolded).
9. `wrangler secret put RESEND_API_KEY` on Moh's machine.
10. `wrangler deploy` → verify `https://zyvibe.me/` serves correctly.
11. Add `zyvibe.me` to Google Search Console; submit sitemap.
12. Add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets to GitHub repo → CI deploys on every push.
13. In GitHub repo Settings → Pages → Unpublish (shut down the old Pages host).

## 9 — Historical context (what's already in the repo)

The current root-level `index.html` is a scaffold from the previous Claude session — cyan / violet palette, five project cards, placeholder stats. **Replace it.** Keep the SEO baseline structure (JSON-LD block, OG tags) as a starting template, but all visual + copy must be rebuilt per §3–§4.

See `STRUCTURE.md` for the target repo layout.
