/**
 * Image URLs for both sources:
 *  - Cloudinary public IDs ("mandovi-tales/sunset-deck") → responsive Cloudinary URLs
 *  - "stand-in/<id>" keys → local stock photos in /public/images (temporary)
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Widths Cloudinary is asked to generate. */
const CLOUDINARY_WIDTHS = [480, 768, 1080, 1440, 1920, 2560];

/** Local stand-in files: resized widths, plus the width of the unsuffixed file if present. */
const STAND_INS: Record<string, { widths: number[]; full?: number }> = {
  f96460762: { widths: [500, 960, 1280], full: 1920 },
  f64185538: { widths: [500, 960], full: 1280 },
  f126506020: { widths: [500, 960], full: 1280 },
  f53428483: { widths: [500, 960], full: 1280 },
  f31036758: { widths: [500, 960] },
  f96460765: { widths: [500, 960] },
  f107825770: { widths: [500, 960] },
  f81578993: { widths: [500, 960] },
  f99912532: { widths: [500, 960] },
  f57513652: { widths: [500, 960], full: 1280 },
  f88710219: { widths: [500, 960], full: 1280 },
  f110120425: { widths: [500, 960] },
  f105192704: { widths: [500, 960], full: 1280 },
  f95250912: { widths: [500, 960] },
  f150084598: { widths: [500, 960], full: 1280 },
  f49814193: { widths: [500, 960], full: 1280 },
};

export type ImageSet = { src: string; srcSet: string };

export function isStandIn(image: string) {
  return image.startsWith("stand-in/");
}

function cloudinaryUrl(publicId: string, width: number, aspect?: string) {
  const crop = aspect ? `c_fill,g_auto,ar_${aspect}` : "c_limit";
  const transform = `f_auto,q_auto,${crop},w_${width}`;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

/**
 * Returns a src and srcSet for an image key.
 * `aspect` (e.g. "4:5") lets Cloudinary crop around the subject; local files ignore it.
 */
export function imageSet(image: string, aspect?: string): ImageSet {
  if (isStandIn(image)) {
    const id = image.slice("stand-in/".length);
    const entry = STAND_INS[id];
    if (!entry) throw new Error(`Unknown stand-in photo "${image}". Check src/content/site.ts.`);
    const files = entry.widths.map((w) => ({ url: `/images/photo-${id}-${w}.jpg`, w }));
    if (entry.full) files.push({ url: `/images/photo-${id}.jpg`, w: entry.full });
    return {
      src: files[files.length - 1].url,
      srcSet: files.map((f) => `${f.url} ${f.w}w`).join(", "),
    };
  }

  if (!CLOUD_NAME) {
    throw new Error(
      `Photo "${image}" is a Cloudinary ID but NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set. See CLOUDINARY.md.`,
    );
  }
  return {
    src: cloudinaryUrl(image, 1440, aspect),
    srcSet: CLOUDINARY_WIDTHS.map((w) => `${cloudinaryUrl(image, w, aspect)} ${w}w`).join(", "),
  };
}
