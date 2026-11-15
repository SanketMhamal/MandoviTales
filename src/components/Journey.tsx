"use client";

/* eslint-disable @next/next/no-img-element -- the map is a local SVG, crisp at any size. */
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { site } from "@/content";
import { Photo } from "./Photo";

const MAP = { src: "/images/mandovi-map.svg", thumb: "/images/mandovi-map.svg", w: 2048, h: 1280 };
const SCALE = 2.2; // ground pixels per map pixel
const TILT = 60; // degrees the ground leans back
const LOOK_AHEAD = 0.035;

type Pt = [number, number];

/** A polyline with lookups by fraction of its length. */
function makePath(points: Pt[]) {
  const pts = points.map(([x, y]) => [x * SCALE, y * SCALE] as Pt);
  const lens = [0];
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = lens[lens.length - 1];
  const at = (u: number): Pt => {
    const d = Math.min(Math.max(u, 0), 1) * total;
    let i = 1;
    while (i < lens.length - 1 && lens[i] < d) i++;
    const t = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
  };
  /** The fraction of the path nearest to a map point. */
  const nearest = ([x, y]: Pt) => {
    let best = 0;
    let bestD = Infinity;
    for (let k = 0; k <= 400; k++) {
      const [px, py] = at(k / 400);
      const dd = (px - x * SCALE) ** 2 + (py - y * SCALE) ** 2;
      if (dd < bestD) {
        bestD = dd;
        best = k / 400;
      }
    }
    return best;
  };
  return { at, nearest };
}

/** Angle that turns the direction of travel to "into the screen". */
function headingAt(path: ReturnType<typeof makePath>, u: number) {
  const [ax, ay] = path.at(u - 0.01);
  const [bx, by] = path.at(u + LOOK_AHEAD);
  return -Math.PI / 2 - Math.atan2(by - ay, bx - ax);
}

/**
 * "Down the Mandovi": the section holds on screen while the camera flies down the river over an
 * illustrated map of the estuary, traced from satellite imagery. Photos stand up on the map at each stop, come out of the
 * mist, pass by and fall behind; each stop's lines fade in on the left. Without motion it is
 * the map with the stops listed under it.
 */
export function Journey() {
  const { title, intro, path: route, stops, mapAlt, mapCredit } = site.route;
  const sectionRef = useRef<HTMLElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ground = groundRef.current;
    if (!section || !ground || !document.documentElement.classList.contains("motion")) return;

    const path = makePath(route);
    const stopU = stops.map((s) => path.nearest(s.at));
    const boards = Array.from(ground.querySelectorAll<HTMLElement>(".bb"));
    const texts = Array.from(section.querySelectorAll<HTMLElement>(".jt"));
    const dot = section.querySelector<SVGCircleElement>(".journey__dot");
    const trail = section.querySelector<SVGPolylineElement>(".journey__trail");
    const boat = section.querySelector<HTMLElement>(".journey__boat-hull");
    const boardPos = boards.map((b) => [Number(b.dataset.x), Number(b.dataset.y)] as Pt);

    let target = 0;
    let current = 0;
    let heading = headingAt(path, 0);
    let active = -1;
    let frame = 0;

    const bob = boat ? animate(boat, { y: [-3, 3], rotate: [-2, 2], duration: 1800, alternate: true, loop: true, ease: "inOutSine" }) : null;

    const showStop = (i: number) => {
      if (i === active) return;
      active = i;
      texts.forEach((t, k) => t.toggleAttribute("data-active", k === i));
      const el = texts[i];
      if (el) {
        animate(el.querySelectorAll(".jt__name, .jt__line"), { opacity: [0, 1], y: [18, 0], filter: ["blur(6px)", "blur(0px)"], duration: 900, delay: stagger(110), ease: "outQuart" });
      }
    };

    const render = () => {
      frame = 0;
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.00005) current = target;

      const [x, y] = path.at(current);
      // turn smoothly towards the new heading, the short way round
      let want = headingAt(path, current);
      while (want - heading > Math.PI) want -= 2 * Math.PI;
      while (want - heading < -Math.PI) want += 2 * Math.PI;
      heading += (want - heading) * 0.08;

      const w = section.clientWidth;
      const h = window.innerHeight;
      ground.style.transform = `translate3d(${w / 2}px, ${h * 0.76}px, 0) rotateX(${TILT}deg) rotateZ(${heading}rad) translate3d(${-x}px, ${-y}px, 0)`;

      const cos = Math.cos(heading);
      const sin = Math.sin(heading);
      boards.forEach((b, k) => {
        const dx = boardPos[k][0] - x;
        const dy = boardPos[k][1] - y;
        const ahead = -(dx * sin + dy * cos); // distance in front of the boat
        // fades in out of the mist, holds, then falls away behind the boat
        const fog = Math.min(1, Math.max(0, (2800 - ahead) / 1100));
        const passed = Math.min(1, Math.max(0, (ahead + 260) / 260));
        b.style.opacity = String(Math.min(fog, passed));
        b.style.transform = `rotateZ(${-heading}rad) rotateX(${-TILT}deg)`;
      });

      // stop on screen: the nearest one within reach
      let near = -1;
      let nearD = 0.08;
      stopU.forEach((u, i) => {
        const d = Math.abs(u - current + 0.02);
        if (d < nearD) {
          nearD = d;
          near = i;
        }
      });
      if (near === -1 && current < stopU[0]) near = 0;
      if (near !== -1) showStop(near);

      if (dot) {
        dot.setAttribute("cx", String(x / SCALE));
        dot.setAttribute("cy", String(y / SCALE));
      }
      if (trail) trail.style.strokeDashoffset = String(1 - current);

      if (current !== target) frame = requestAnimationFrame(render);
    };

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const run = Math.max(1, r.height - window.innerHeight);
      target = Math.min(1, Math.max(0, -r.top / run));
      if (!frame) frame = requestAnimationFrame(render);
    };

    onScroll();
    current = target;
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      bob?.revert();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [route, stops]);

  const polyline = route.map(([x, y]) => `${x},${y}`).join(" ");

  return (
    <section
      id="route"
      ref={sectionRef}
      className="journey"
      aria-labelledby="route-title"
      data-port="The river"
      style={{ "--stops": stops.length } as React.CSSProperties}
    >
      <div className="journey__stage">
        {/* The ground: satellite map with photos standing at each stop */}
        <div className="journey__world" aria-hidden="true">
          <div ref={groundRef} className="journey__ground" style={{ width: MAP.w * SCALE, height: MAP.h * SCALE }}>
            <img className="journey__map" src={MAP.src} alt="" width={MAP.w * SCALE} height={MAP.h * SCALE} decoding="async" />
            <svg className="journey__river" viewBox={`0 0 ${MAP.w} ${MAP.h}`} width={MAP.w * SCALE} height={MAP.h * SCALE}>
              <polyline points={polyline} />
            </svg>
            {stops.flatMap((stop, i) =>
              stop.photos.map((photo, k) => {
                const spread = (k - (stop.photos.length - 1) / 2) * 380;
                const x = stop.at[0] * SCALE + spread;
                const y = stop.at[1] * SCALE - k * 90;
                return (
                  <div key={`${i}-${k}`} className="bb" data-x={x} data-y={y} style={{ left: x, top: y }}>
                    <div className="bb__card" data-tilt={k % 2 ? "r" : "l"}>
                      <Photo {...photo} decorative eager aspect="4:3" sizes="360px" />
                    </div>
                    {k === 0 && (
                      <span className="bb__label">
                        <span className="bb__pin" />
                        {stop.name}
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className="journey__mist" aria-hidden="true" />

        {/* The boat, seen from astern, with its wake */}
        <div className="journey__boat" aria-hidden="true">
          <span className="journey__wake" />
          <div className="journey__boat-hull">
            <svg viewBox="0 0 80 64" width="80" height="64">
              <path d="M36 4h8v12h-8z" fill="#a84b23" />
              <path d="M16 16h48l-2 14H18z" fill="#fbf8f2" />
              <g fill="#12262b">
                <rect x="21" y="20" width="6" height="4" rx="1" />
                <rect x="31" y="20" width="6" height="4" rx="1" />
                <rect x="43" y="20" width="6" height="4" rx="1" />
                <rect x="53" y="20" width="6" height="4" rx="1" />
              </g>
              <path d="M8 30h64l-4 16H12z" fill="#fbf8f2" />
              <path d="M8 30h64v3H8z" fill="#a84b23" />
              <path d="M12 46h56l-6 10H18z" fill="#12262b" />
            </svg>
          </div>
        </div>

        <div className="wrap journey__overlay">
          <header className="journey__head">
            <h2 id="route-title" className="journey__title">
              {title}
            </h2>
            <p className="journey__intro">{intro}</p>
          </header>
          <ol className="journey__text">
            {stops.map((stop, i) => (
              <li key={stop.name} className="jt" data-active={i === 0 || undefined}>
                <p className="jt__count">
                  {String(i + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
                </p>
                <h3 className="jt__name">{stop.name}</h3>
                <p className="jt__lines">
                  {stop.lines.map((line) => (
                    <span key={line} className="jt__line">
                      {line}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Where we are on the whole estuary */}
        <div className="journey__minimap" aria-hidden="true">
          <img src={MAP.thumb} alt="" width={480} height={300} loading="lazy" decoding="async" />
          <svg viewBox={`0 0 ${MAP.w} ${MAP.h}`}>
            <polyline className="journey__route" points={polyline} />
            <polyline className="journey__trail" points={polyline} pathLength={1} />
            <circle className="journey__dot" r="34" cx={route[0][0]} cy={route[0][1]} />
          </svg>
        </div>

        <p className="journey__credit">{mapCredit}</p>
      </div>

      {/* Without motion: the map and the stops as a list */}
      <div className="wrap journey__static">
        <h2 className="h2">{title}</h2>
        <img src={MAP.src} alt={mapAlt} width={MAP.w} height={MAP.h} loading="lazy" decoding="async" className="journey__static-map" />
        <ol className="journey__static-list">
          {stops.map((stop) => (
            <li key={stop.name}>
              <div className="journey__static-photo">
                <Photo {...stop.photos[0]} aspect="4:3" sizes="(min-width: 1024px) 30vw, 100vw" />
              </div>
              <h3 className="h3">{stop.name}</h3>
              <p>{stop.lines.join(" ")}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
