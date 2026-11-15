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
