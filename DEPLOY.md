# Deploying to Cloudflare Pages

The site is a static export: `npm run build` writes every page into `out/` as plain files, and Cloudflare Pages serves them from its CDN. The free plan allows commercial sites. Every push to GitHub rebuilds and redeploys the site automatically.

## One-time setup

### 1. Put the code on GitHub

Create a repository on GitHub (private is fine), then from this folder:

```bash
git remote add origin https://github.com/<your-account>/mandovi-tales.git
```

```bash
git push -u origin main
```

### 2. Connect it to Cloudflare Pages

1. Sign up or log in at <https://dash.cloudflare.com> (the free plan is enough).
2. Go to **Workers & Pages → Create → Pages → Connect to Git**. If the screen offers a Worker first, choose the **Pages** tab.
3. Authorise GitHub and pick the `mandovi-tales` repository.
4. Fill in the build settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `Next.js (Static HTML Export)` |
   | Build command | `npm run build` |
   | Build output directory | `out` |
   | Root directory | *(leave empty)* |

5. Under **Environment variables**, add:

   | Variable | Value |
   | --- | --- |
   | `NODE_VERSION` | `22` |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | the client's Cloudinary cloud name (add it once the photos are uploaded; see CLOUDINARY.md) |

6. Click **Save and Deploy**. The first build takes 2–3 minutes. The site is then live at `https://<project-name>.pages.dev`.

### 3. Add the client's domain

1. Buy the domain (Cloudflare Registrar sells at cost, or use any registrar).
2. In the Pages project: **Custom domains → Set up a custom domain**, enter `mandovitales.com` (and `www.mandovitales.com`).
3. If the domain's DNS is on Cloudflare, the records are added for you. If not, Cloudflare shows the CNAME record to add at the registrar. HTTPS is set up automatically.
4. In `src/content/site.ts`, set `brand.url` to the final address (it is used for link previews on WhatsApp and social media), commit and push.

## Everyday updates

1. Edit `src/content/site.ts` (prices, timings, text, photos).
2. Commit and push to `main`.
3. Cloudflare rebuilds and the live site updates in a minute or two.

Pushing to any other branch creates a **preview** at its own `*.pages.dev` address, so the client can approve changes before they go live. To undo a bad release, open **Deployments** in the Pages project and choose **Rollback** on an earlier one.

## What the build does

- `next build` (with `output: "export"` in `next.config.ts`) prerenders `/`, `/cruises` and every `/packages/<slug>` page into `out/`.
- `postbuild` runs `scripts/flatten-prefetch.mjs`, which copies Next's page-prefetch files to the names the browser requests, so they don't 404 on a static host.
- `public/_headers` sets caching (a year for hashed build files, a month for images and textures) and basic security headers on Cloudflare.

To check a build locally exactly as Cloudflare will serve it:

```bash
npm run build
```

```bash
npm start
```

Then open <http://localhost:8000>.
