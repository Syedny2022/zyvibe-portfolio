# STRUCTURE.md

Target layout for `Syedny2022/zyvibe-portfolio` after migrating to Cloudflare Workers.

## Tree

```
zyvibe-portfolio/
├─ CLAUDE.md               # Build brief for Claude Code
├─ STRUCTURE.md            # This file
├─ README.md               # Public overview
├─ wrangler.toml           # Cloudflare Workers config
├─ package.json            # Dev dependencies (wrangler)
├─ .gitignore
├─ .github/
│  └─ workflows/
│     └─ deploy.yml       # Auto-deploy on push to main
├─ src/
│  └─ index.js            # Worker entry — serves assets + handles /api/lead
└─ public/                 # Static assets served by Worker
   ├─ index.html           # Main portfolio page
   ├─ og.png               # Social share image (1200×630)
   ├─ robots.txt
   ├─ sitemap.xml
   ├─ _headers             # Workers Assets honors Pages-style headers
   └─ assets/              # Fonts, images, split CSS/JS if needed
```

## Why Workers, not Pages

- Single mental model: static assets **and** server-side logic in one deploy.
- Lead-form POST handler lives in `src/index.js` next to the static site — no separate project.
- Edge-native: zero cold start, zero config for SSL + CDN + DDoS.
- Native support for KV / D1 / R2 if we add session state, lead storage, or OG image generation later.
- Routes bind straight to `zyvibe.me` via `custom_domain = true` — no manual DNS steps.

## Dev commands

```bash
npm install              # installs wrangler locally
npx wrangler dev         # local server at http://localhost:8787
npx wrangler deploy      # push to production
npx wrangler tail        # stream production logs
```

## File purposes

| Path | Purpose |
|---|---|
| `src/index.js` | Worker entry. Default export is `{ fetch(request, env) }`. Static requests go to `env.ASSETS`. `/api/lead` POST → Resend. |
| `public/index.html` | The portfolio page. Rebuilt per §3–§4 of CLAUDE.md. |
| `public/_headers` | Cache-Control + security headers. Workers Assets reads this file at the Pages-syntax level. |
| `wrangler.toml` | Deployment config: routes, assets binding, observability. |
| `.github/workflows/deploy.yml` | CI deploy on every push to main. Needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets. |

## Where NOT to put things

- **No build step.** Keep the portfolio buildless (vanilla HTML + CSS + JS) unless a strong reason emerges. A Vite build adds complexity for a one-page site.
- **No `node_modules`** committed (`.gitignore` handles this).
- **No secrets in `wrangler.toml`.** Use `wrangler secret put <KEY>` for `RESEND_API_KEY`, `HUBSPOT_TOKEN`, etc.
- **No API tokens in CI logs.** The workflow passes them as environment variables only.

## Migration from the current scaffold

The repo currently has (from the prior Claude session, GitHub-Pages-era):
- `index.html` (root) → move to `public/index.html` (and rebuild the visual — see CLAUDE.md §3).
- `robots.txt`, `sitemap.xml`, `_headers` (root) → move to `public/`.
- `CNAME` (root) → delete (Pages-only artifact).
- `README.md` (root) → keep, update to reference CLAUDE.md + STRUCTURE.md.

After the migration, GitHub Pages can be unpublished from the repo Settings page.
