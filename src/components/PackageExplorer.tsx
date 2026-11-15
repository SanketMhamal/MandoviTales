"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { animate, stagger, utils } from "animejs";
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
  const listRef = useRef<HTMLUListElement>(null);
  const first = useRef(true);

  // When the filter changes, the new set of cards sails in from the right.
  useEffect(() => {
    const list = listRef.current;
    if (!document.documentElement.classList.contains("motion") || !list) return;
    if (first.current) {
      // First time: the cards rise in a wave when the list comes on screen.
      first.current = false;
      const items = Array.from(list.children);
      utils.set(items, { opacity: 0, y: 60, scale: 0.97 });
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          animate(items, { opacity: 1, y: 0, scale: 1, duration: 1200, delay: stagger(110), ease: "outExpo" });
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      io.observe(list);
      return () => io.disconnect();
    }
    animate(list.children, {
      opacity: [0, 1],
      x: [80, 0],
      rotate: [2, 0],
      duration: 900,
      delay: stagger(90),
      ease: "outExpo",
    });
  }, [filter]);

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

      <ul className="cards" data-filter={filter} data-self-animate ref={listRef}>
        {shown.map((pkg, i) => (
          <li key={pkg.slug}>
            <PackageCard pkg={pkg} cta={cardCta} featured={filter === "all" && i < 2} />
          </li>
        ))}
      </ul>
    </>
  );
}
