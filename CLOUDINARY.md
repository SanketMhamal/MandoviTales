# Putting the client’s photos on Cloudinary

The site already knows how to load photos from Cloudinary. Until it’s set up, it shows temporary stock photos from `public/images` (every `image: "stand-in/…"` in `src/content/site.ts`). Swapping them over takes five steps.

## 1. Create the account

1. Sign up at <https://cloudinary.com/users/register_free>. The free plan is plenty for a site this size.
2. In the Console, open **Settings → Product environment** and copy the **Cloud name** (for example `mandovi-tales`).

## 2. Upload the photos

1. Go to **Media Library → Assets** and create a folder called `mandovi-tales`.
2. Drag the client’s photos into it. Upload the **largest original** you have (2,400 px wide or more). Cloudinary makes the smaller versions automatically.
3. Give each file a short, clear name before uploading. That name becomes its **public ID**:

   | Use on the site | Suggested public ID |
   | --- | --- |
   | Home page hero | `mandovi-tales/hero-sunset` |
   | Sunset Cruise card | `mandovi-tales/sunset-cruise` |
   | Dinner Cruise card | `mandovi-tales/dinner-cruise` |
   | Dolphin Cruise card | `mandovi-tales/dolphin-cruise` |
   | Backwater Day Cruise card | `mandovi-tales/backwater-cruise` |
   | Private Charter card | `mandovi-tales/private-charter` |
   | On board: dance, food, decks | `mandovi-tales/onboard-dance`, `onboard-food`, `onboard-decks` |
   | The route: four stops | `mandovi-tales/route-panjim`, `route-reis-magos`, `route-aguada`, `route-chorao` |
   | Getting to the jetty | `mandovi-tales/jetty` |

   To check a public ID, click the photo in the Media Library; it’s shown under **Public ID**. Leave off the file extension (`.jpg`).

**Shots worth getting from the client:** the boat at the jetty, the upper deck at sunset with guests, the dance troupe mid-step, the dinner buffet laid out, the band, dolphins off Aguada, the mangrove creeks, and the boat dressed for a private party. Landscape, natural light, no filters.

## 3. Tell the site the cloud name

Create a file called `.env.local` in the project folder (next to `package.json`):

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mandovi-tales
```

On the host (Vercel, Netlify and so on), add the same variable under **Project settings → Environment variables**.

## 4. Point the content at the new photos

In `src/content/site.ts`, replace each stand-in key with the public ID:

```ts
// before
cover: { image: "stand-in/f126506020", alt: "Lit boats reflected on the dark Mandovi river at night" },

// after
cover: { image: "mandovi-tales/dinner-cruise", alt: "Guests at the buffet on the lower deck of the dinner cruise" },
```

Rewrite the `alt` text to describe the new photo. You can swap photos one at a time; stand-ins and Cloudinary photos work side by side.

When every stand-in is gone, delete the `credits` line in the `footer` section of `site.ts` and the `public/images` folder.

## 5. Restart and check

```bash
npm run dev
```

Open <http://localhost:8000>. If a public ID is wrong, the photo shows as a broken image; if the cloud name is missing, the page shows an error naming the photo.

## What the site does with each photo

`src/lib/images.ts` turns a public ID into a responsive set of URLs like:

```
https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,c_fill,g_auto,ar_4:3,w_768/mandovi-tales/dinner-cruise
```

- `f_auto`: WebP or AVIF for browsers that support them, JPEG otherwise.
- `q_auto`: the smallest file that still looks right.
- `c_fill,g_auto,ar_4:3`: crops to the frame’s shape, keeping the subject (people, the boat) in view.
- `w_…`: six widths from 480 to 2,560 px; the browser picks the one that fits the screen.

So the client can upload big originals and never resize anything by hand.
