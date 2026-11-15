/* eslint-disable @next/next/no-img-element -- Cloudinary does the resizing, so a plain responsive <img> is used. */
import type { Photo as PhotoType } from "@/content";
import { imageSet } from "@/lib/images";

type Props = PhotoType & {
  /** The rendered width, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes: string;
  className?: string;
  /** Crop ratio for Cloudinary, e.g. "4:3". */
  aspect?: string;
  priority?: boolean;
  /** Inside a link that already names the picture, e.g. a card. */
  decorative?: boolean;
  /** Load straight away (for pictures inside 3D scenes, where lazy loading can miss them). */
  eager?: boolean;
};

export function Photo({ image, alt, sizes, className, aspect, priority, decorative, eager }: Props) {
  const { src, srcSet } = imageSet(image, aspect);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={decorative ? "" : alt}
      className={className}
      width={1600}
      height={1067}
      loading={priority || eager ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
