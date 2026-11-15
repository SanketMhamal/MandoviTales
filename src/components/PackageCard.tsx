import Link from "next/link";
import type { CruisePackage } from "@/content";
import { formatPrice } from "@/lib/format";
import { Photo } from "./Photo";
import { ArrowIcon } from "./icons";
import { InkBandBoat, InkFish, InkSun } from "./Ink";

const DOODLE = { evening: InkSun, day: InkFish, private: InkBandBoat };

type Props = {
  pkg: CruisePackage;
  cta: string;
  featured?: boolean;
};

export function PackageCard({ pkg, cta, featured }: Props) {
  const Doodle = DOODLE[pkg.category];
  return (
    <Link href={`/packages/${pkg.slug}`} className="card" data-featured={featured || undefined}>
      <div className="card__media">
        <Photo
          {...pkg.cover}
          decorative
          aspect={featured ? "3:2" : "4:3"}
          sizes={featured ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        />
        {pkg.badge && <span className="card__badge">{pkg.badge}</span>}
      </div>
      <div className="card__body">
        <div className="card__ink">
          <Doodle />
        </div>
        <p className="card__meta">
          <span>{pkg.duration}</span>
          <span aria-hidden="true">·</span>
          <span>{pkg.departs}</span>
        </p>
        <h3 className="card__title">{pkg.name}</h3>
        <p className="card__summary">{pkg.summary}</p>
        <div className="card__foot">
          <p className="price">
            {pkg.price !== null ? (
              <>
                <span className="price__amount" data-count={pkg.price}>
                  {formatPrice(pkg.price)}
                </span>
                <span className="price__note"> {pkg.priceNote}</span>
              </>
            ) : (
              <span className="price__note">{pkg.priceNote}</span>
            )}
          </p>
          <span className="card__cta">
            {cta}
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}
