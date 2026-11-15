"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { site } from "@/content";
import { PackageCard } from "./PackageCard";

/** The chosen filter lives in the URL (?cruises=evening) so it can be shared and survives Back. */
export function PackageExplorer() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = params.get("cruises") ?? "all";
  const filter = site.cruisesSection.filters.some((f) => f.id === requested) ? requested : "all";

  return (
    <PackageExplorerView
      filter={filter}
      onSelect={(id) => {
        const query = id === "all" ? "" : `?cruises=${id}`;
        router.replace(`${pathname}${query}#cruises`, { scroll: false });
      }}
    />
  );
}

export function PackageExplorerView({ filter, onSelect }: { filter: string; onSelect?: (id: string) => void }) {
  const { filters, cardCta } = site.cruisesSection;
  const shown = filter === "all" ? site.packages : site.packages.filter((p) => p.category === filter);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter cruises">
        {filters.map((f) => {
          const count = f.id === "all" ? site.packages.length : site.packages.filter((p) => p.category === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              className="chip"
              aria-pressed={filter === f.id}
              onClick={() => onSelect?.(f.id)}
            >
              {f.label}
              <span className="chip__count">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} {shown.length === 1 ? "cruise" : "cruises"} shown
      </p>

      <ul className="cards" data-filter={filter}>
        {shown.map((pkg, i) => (
          <li key={pkg.slug}>
            <PackageCard pkg={pkg} cta={cardCta} featured={filter === "all" && i < 2} />
          </li>
        ))}
      </ul>
    </>
  );
}
