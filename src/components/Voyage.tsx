"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animate, utils } from "animejs";
import { Boat, Waves } from "./Sea";

type Port = { id: string; label: string; at: number };

/**
 * The voyage: a strip of sea along the foot of the screen. The ship's place on it is how far
 * down the page you are; it docks at a port for each section, pitches harder the faster you
 * scroll, turns round when you scroll back up, and leaves a wake. The waves run faster with
 * the ship. Ports are links, so the strip doubles as a map of the page.
 */
export function Voyage() {
  const pathname = usePathname();
  const shipRef = useRef<HTMLDivElement>(null);
  const hullRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLDivElement>(null);
  const [ports, setPorts] = useState<Port[]>([]);
  const [current, setCurrent] = useState(0);

  // Ports: one per section marked data-port, placed by where the section sits in the page.
  useEffect(() => {
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const found = Array.from(document.querySelectorAll<HTMLElement>("[data-port]")).map((el, i) => {
        if (!el.id) el.id = `port-${i}`;
        return { id: el.id, label: el.dataset.port ?? "", at: Math.min(1, Math.max(0, (el.offsetTop - window.innerHeight * 0.35) / max)) };
      });
      if (found.length) found[0].at = 0;
      setPorts(found);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [pathname]);

  // The ship follows the scroll.
  useEffect(() => {
    const ship = shipRef.current;
    const hull = hullRef.current;
    const sea = seaRef.current;
    if (!ship || !hull || !sea) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let heading = 1;
    let frame = 0;

    const bob = still
      ? null
      : animate(hull, { y: [-1.5, 1.5], duration: 1400, alternate: true, loop: true, ease: "inOutSine" });

    const update = () => {
      frame = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = utils.clamp(window.scrollY / max, 0, 1);
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const speed = dy / Math.max(16, now - lastT); // px per ms
      lastY = window.scrollY;
      lastT = now;
      if (Math.abs(dy) > 2) heading = dy > 0 ? 1 : -1;

      ship.style.setProperty("--x", progress.toString());
      ship.dataset.heading = heading > 0 ? "east" : "west";
      if (!still) {
        // pitch into the swell, more the faster we go; the wake stretches with speed
        const pitch = utils.clamp(speed * 6, -9, 9);
        animate(ship.querySelector(".voyage__pitch")!, { rotate: -pitch * heading, duration: 600, ease: "outQuad", composition: "replace" });
        animate(ship.querySelector(".voyage__wake")!, { scaleX: utils.clamp(0.4 + Math.abs(speed) * 1.4, 0.4, 2.6), opacity: utils.clamp(0.35 + Math.abs(speed), 0.35, 0.9), duration: 500, ease: "outQuad", composition: "replace" });
        sea.style.setProperty("--sea-speed", `${utils.clamp(14 - Math.abs(speed) * 30, 3, 14)}s`);
      }
      // the port we're at
      let idx = 0;
      document.querySelectorAll<HTMLElement>("[data-port]").forEach((el, i) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.5) idx = i;
      });
      setCurrent(idx);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // settle the wake and the sea when scrolling stops
    let idle: ReturnType<typeof setTimeout>;
    const onScrollEnd = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        lastT = performance.now();
        if (!still) {
          animate(ship.querySelector(".voyage__pitch")!, { rotate: 0, duration: 1200, ease: "outElastic(1, .5)", composition: "replace" });
          animate(ship.querySelector(".voyage__wake")!, { scaleX: 0.4, opacity: 0.35, duration: 900, ease: "outQuad", composition: "replace" });
          sea.style.setProperty("--sea-speed", "14s");
        }
      }, 160);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScrollEnd, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      bob?.revert();
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScrollEnd);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <nav className="voyage" aria-label="Page sections" ref={seaRef}>
      <Waves className="voyage__waves" />
      <ol className="voyage__ports">
        {ports.map((port, i) => (
          <li key={port.id} style={{ "--at": port.at } as React.CSSProperties} data-reached={i <= current || undefined} data-current={i === current || undefined}>
            <a href={`#${port.id}`} aria-current={i === current ? "location" : undefined}>
              <span className="voyage__buoy" aria-hidden="true" />
              <span className="voyage__label">{port.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="voyage__ship" ref={shipRef} aria-hidden="true">
        <div className="voyage__flip">
          <span className="voyage__wake" />
          <div className="voyage__pitch">
            <div ref={hullRef}>
              <Boat className="voyage__boat" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
