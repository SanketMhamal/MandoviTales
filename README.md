# Mandovi Tales

Website for Mandovi Tales, river cruises on the Mandovi from Panjim, Goa. Visitors browse the cruises and book on WhatsApp; there is no checkout on the site.

Built with Next.js (App Router) and plain CSS.

## Run it

```bash
npm install
npm run dev
```

Open <http://localhost:8000>.

## Editing the content

**Everything a visitor reads lives in one file: [`src/content/site.ts`](src/content/site.ts).** Cruise names, prices, timings, itineraries, FAQs, the WhatsApp number, photos and alt text are all there. Save the file and every page updates, including each cruise’s own page, the footer links and the booking form.

- **Add a cruise:** copy one of the blocks in `packages`, give it a new `slug`, and it appears on the home page, in the filters, in the footer and at `/packages/<slug>`.
- **Change the WhatsApp number:** `booking.whatsappNumber`, digits only with the country code (e.g. `919876543210`).
- **Change a price:** `price: 1800`. The site formats it as ₹1,800.
- Typography is handled for you: times and units stay on one line, straight apostrophes become curly, `...` becomes `…`.

## Photos

The client’s photos load from Cloudinary. See [CLOUDINARY.md](CLOUDINARY.md) for the setup. Until then the site uses stand-in photos from Wikimedia Commons in `public/images`.

## Look and feel

- **Watercolour:** paper grain, washes and painted photo edges come from SVG textures in `public/textures` (`paper.svg`, `wash-*.svg`, `edge-*.svg`), applied in `src/app/watercolour.css`.
- **Ink drawings:** original pen-and-wash illustrations of Goa (band boat, Goan house, church, fisherman, palm, fish, crab, sun, gulls) in `src/components/Ink.tsx`. Wrap one in `data-draw` to have its lines draw themselves on screen; `data-float`, `data-sway`, `data-drift` and `data-spin` add idle motion.
- **On the water:** headings float letter by letter on a swell that grows with scroll speed (`--swell`, set in `Motion.tsx`, used in `src/app/waves.css`); nav letters hop on hover with wavy underlines, a boat sails under the current section, the header ducks away on scroll, and the phone menu comes in like a tide.
- **Type:** Fraunces for headings (soft, with the wonky italic for names), Hanken Grotesk for text, Caveat for short hand-lettered labels.

## Pages

- `/`: home.
- `/cruises`: every cruise with filters and a side-by-side comparison table.
- `/packages/<slug>`: one page per cruise.

## The river journey

The "Down the Mandovi" section flies over a watercolour map of the estuary (`public/images/mandovi-watercolour.webp`), traced and painted from Sentinel-2 cloudless 2016 imagery by EOX (CC BY 4.0; keep its credit line). Its stops, their lines and photos, and the boat's path are under `route` in `src/content/site.ts`; map positions are in map units (2048 × 1280). How the map is made: [scripts/map/README.md](scripts/map/README.md).

## Structure

```
src/
  content/site.ts      ← all content (edit this)
  content/index.ts     typography clean-up applied to the content
  lib/images.ts        Cloudinary / stand-in image URLs
  lib/format.ts        prices and WhatsApp links
  components/          header, cards, booking form, footer…
  app/page.tsx         home page
  app/packages/[slug]  one page per cruise
```

## Deploy

Any Next.js host works. On Vercel: import the repository, add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` under Environment variables, deploy.
