"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Boat, Waves } from "./Sea";

type Port = { id: string; label: string; at: number };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * The voyage: a strip of sea along the foot of the screen. The ship's place on it is how far
 * down the page you are; it docks at a port for each section, pitches harder the faster you
 * scroll, turns round when you scroll back up, and leaves a wake. Ports are links, so the
 * strip doubles as a map of the page.
 *
 * Everything moves in one requestAnimationFrame loop that only writes transforms: no layout
 * reads while scrolling and no animation restarts, so it stays smooth on phones.
 */
export function Voyage() {
  const pathname = usePathname();
  const shipRef = useRef<HTMLDivElement>(null);
  const seaRef = useRef<HTMLElement>(null);
  const portsRef = useRef<Port[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [current, setCurrent] = useState(0);

  // Ports: one per section marked data-port, placed by where the section sits in the page.
  // Measured on load and when the page really changes size, never while scrolling.
  useEffect(() => {
    let lastHeight = 0;
    let lastWidth = 0;
    let timer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const height = document.documentElement.scrollHeight;
      const width = window.innerWidth;
      // phones resize the viewport as the address bar slides; ignore those small changes
      if (Math.abs(height - lastHeight) < 40 && width === lastWidth) return;
      lastHeight = height;
      lastWidth = width;
      const max = Math.max(1, height - window.innerHeight);
      const found = Array.from(document.querySelectorAll<HTMLElement>("[data-port]")).map((el, i) => {
        if (!el.id) el.id = `port-${i}`;
        const top = el.getBoundingClientRect().top + window.scrollY;
        return { id: el.id, label: el.dataset.port ?? "", at: clamp((top - window.innerHeight * 0.35) / max, 0, 1) };
      });
      if (found.length) found[0].at = 0;
      portsRef.current = found;
      setPorts(found);
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 200);
    };
    measure();
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [pathname]);

  // The ship, its wake and the waves.
  useEffect(() => {
    const ship = shipRef.current;
    const sea = seaRef.current;
    if (!ship || !sea) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pitchEl = ship.querySelector<HTMLElement>(".voyage__pitch")!;
    const hullEl = ship.querySelector<HTMLElement>(".voyage__hull")!;
    const wakeEl = ship.querySelector<HTMLElement>(".voyage__wake")!;
    const layers = Array.from(sea.querySelectorAll<SVGElement>(".voyage__waves .waves__layer"));
    // each layer drifts at its own pace; the scroll adds a push
    const drift = [-0.018, 0.03, 0.045]; // px per ms
    const push = [0.12, 0.25, 0.4];
    const wave = layers.map(() => 0);

    let stripWidth = sea.clientWidth;
    let shipWidth = ship.offsetWidth;
    let period = layers[0] ? layers[0].getBoundingClientRect().width / 4 : 200;
    const resize = () => {
      stripWidth = sea.clientWidth;
      shipWidth = ship.offsetWidth;
      period = layers[0] ? layers[0].getBoundingClientRect().width / 4 : period;
    };

    let x = -1;
    let pitch = 0;
    let wake = 0.4;
    let heading = 1;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let speed = 0; // smoothed px per ms
    let portIdx = -1;
    let frame = 0;

    const loop = (now: number) => {
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      speed += (dy / Math.max(dt, 1) - speed) * 0.2;
      if (Math.abs(dy) > 1) heading = dy > 0 ? 1 : -1;

      // where the ship should be
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = clamp(y / max, 0, 1);
      const pad = Math.min(40, Math.max(16, stripWidth * 0.03));
      const target = pad + progress * (stripWidth - 2 * pad - shipWidth);
      x = x < 0 || still ? target : x + (target - x) * 0.18;

      // pitch into the swell, more the faster we go; the wake stretches with speed
      const pitchTarget = still ? 0 : clamp(speed * 6, -9, 9) * -heading;
      pitch += (pitchTarget - pitch) * 0.12;
      const wakeTarget = clamp(0.4 + Math.abs(speed) * 1.4, 0.4, 2.6);
      wake += (wakeTarget - wake) * 0.1;
      const bob = still ? 0 : Math.sin(now / 700) * 1.6;
      const roll = still ? 0 : Math.sin(now / 1100) * 1.5;

      ship.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      ship.dataset.heading = heading > 0 ? "east" : "west";
      pitchEl.style.transform = `rotate(${(pitch + roll).toFixed(2)}deg)`;
      hullEl.style.transform = `translate3d(0, ${bob.toFixed(2)}px, 0)`;
      wakeEl.style.transform = `scaleX(${wake.toFixed(3)})`;
      wakeEl.style.opacity = clamp(0.35 + Math.abs(speed), 0.35, 0.9).toFixed(2);

      if (!still) {
        layers.forEach((layer, i) => {
          wave[i] = (wave[i] + drift[i] * dt + Math.abs(dy) * push[i]) % period;
          const offset = drift[i] < 0 ? -(period - wave[i]) : -wave[i];
          layer.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
        });
      }

      // which port we're at, from the page position alone
      const list = portsRef.current;
      let idx = 0;
      for (let i = 0; i < list.length; i++) if (progress + 0.02 >= list[i].at) idx = i;
      if (idx !== portIdx) {
        portIdx = idx;
        setCurrent(idx);
      }

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
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
            <div className="voyage__hull">
              <Boat className="voyage__boat" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
