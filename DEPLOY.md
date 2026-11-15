# Deploying to Cloudflare

The site is a static export: `npm run build` writes every page into `out/` as plain files, and Cloudflare serves them from its CDN as static assets. Static asset requests are free on Cloudflare's free plan, and commercial use is allowed. Every push to GitHub rebuilds and redeploys the site automatically.

Repository: <https://github.com/SanketMhamal/MandoviTales>

## One-time setup

### 1. Create the project

1. Log in at <https://dash.cloudflare.com>.
2. Go to **Workers & Pages → Create → Import a repository** and pick `MandoviTales` from GitHub.
3. Fill in the form:

   | Setting | Value |
   | --- | --- |
   | Project name | `mandovitales` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Preview command | `npx wrangler preview` (only used for preview builds) |
   | Enable Preview builds | on |

4. Open **Advanced settings → Build variables** and add:

   | Variable | Value |
   | --- | --- |
   | `NODE_VERSION` | `22` |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | the client's Cloudinary cloud name (add it once the photos are uploaded; see CLOUDINARY.md) |

   These must be **build** variables, not runtime ones: the site reads them while it is being built.

5. Click **Deploy**. The first build takes 2–3 minutes. The site is then live at `https://mandovitales.<your-subdomain>.workers.dev`.

`wrangler.jsonc` in the repository tells `wrangler deploy` to upload the `out/` folder as static assets, serve `/cruises` from `cruises.html`, and answer unknown addresses with the site's 404 page.

### 2. Add the client's domain

1. Buy the domain (Cloudflare Registrar sells at cost, or use any registrar and point its nameservers to Cloudflare).
2. In the project: **Settings → Domains & Routes → Add → Custom domain**, enter `mandovitales.com`, then again for `www.mandovitales.com`. HTTPS is set up automatically.
3. In `src/content/site.ts`, set `brand.url` to the final address (used for link previews on WhatsApp and social media), commit and push.

## Everyday updates

1. Edit `src/content/site.ts` (prices, timings, text, photos).
2. Commit and push to `main`.
3. Cloudflare rebuilds and the live site updates in a minute or two.

Pushing to any other branch makes a **preview** version at its own address, so the client can approve changes before they go live. To undo a bad release, open **Deployments** in the project and roll back to an earlier version.

## What the build does

- `next build` (with `output: "export"` in `next.config.ts`) prerenders `/`, `/cruises` and every `/packages/<slug>` page into `out/`.
- `postbuild` runs `scripts/flatten-prefetch.mjs`, which copies Next's page-prefetch files to the names the browser requests, so they don't 404 on a static host.
- `public/_headers` (copied into `out/`) sets caching (a year for hashed build files, a month for images and textures) and basic security headers.

To check a build locally as it will be served:

```bash
npm run build
```

```bash
npm start
```

Then open <http://localhost:8000>. `npx wrangler deploy --dry-run` checks the deploy without uploading anything.
