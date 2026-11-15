"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { animate, createDrawable, createScope, createTimeline, onScroll, splitText, stagger, utils } from "animejs";
import type { TextSplitter } from "animejs";
import { formatPrice } from "@/lib/format";

/**
 * The page's motion layer, built on anime.js. Markup opts in with data attributes:
 *
 *   data-split        heading: words rise out of masks when it comes on screen
 *   data-split="chars" letters assemble one by one
 *   data-reveal       fades and rises once on screen; children stagger with data-reveal="stagger"
 *   data-develop      photo develops like a print: grey and soft, then colour, settling from a zoom
 *   data-parallax     photo drifts inside its frame as the page scrolls (value = strength)
 *   data-count        number counts up from zero the first time it is seen
 *   data-magnetic     button leans toward the pointer
 *   data-highlight    statement whose words turn to ink as it crosses the screen
 *   data-chapters     pinned photo story (see Chapters.tsx)
 *   data-river        route line that draws itself with a boat sailing along it
 *   data-timeline     package itinerary line that draws as you scroll
 *
 * Nothing runs under prefers-reduced-motion: every element simply rests in place.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion")) return;

    const splitters: TextSplitter[] = [];
    const observers: IntersectionObserver[] = [];
    const cleanups: (() => void)[] = [];

    /** Runs `play` once, the first time `el` is 15% on screen. */
    const once = (el: Element, play: () => void, margin = "0px 0px -12% 0px") => {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              io.disconnect();
              play();
            }
          }
        },
        { rootMargin: margin, threshold: 0.01 },
      );
      io.observe(el);
      observers.push(io);
    };

    /**
     * Splits a heading into letters that can float: each letter gets its place in the line (--i),
     * so the CSS swell travels along it like a wave. The letters rise out of the water first.
     */
    const float = (el: HTMLElement) => {
      const split = splitText(el, { words: { class: "ww" }, chars: { class: "wc" } });
      splitters.push(split);
      (split.chars as HTMLElement[]).forEach((c, i) => c.style.setProperty("--i", String(i)));
      return split.chars as HTMLElement[];
    };
    const rise = (chars: HTMLElement[], host: HTMLElement, delay = 0) =>
      animate(chars, {
        y: ["0.65em", "0em"],
        opacity: [0, 1],
        rotate: () => [utils.random(-14, 14), 0],
        duration: 1300,
        delay: stagger(22, { start: delay }),
        ease: "outBack(1.6)",
        onComplete: () => host.classList.add("wave-on"),
      });

    const scope = createScope({ root: document.body }).add(() => {
      /* ── Scroll progress bar ─────────────────────────────────────── */
      const bar = document.querySelector<HTMLElement>(".progress");
      if (bar) {
        animate(bar, {
          scaleX: [0, 1],
          ease: "linear",
          autoplay: onScroll({ target: document.body, enter: "top top", leave: "bottom bottom", sync: true }),
        });
      }

      /* ── Hero ────────────────────────────────────────────────────── */
      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) {
        const title = hero.querySelector<HTMLElement>(".hero__title");
        utils.set(hero.querySelectorAll(".hero__eyebrow, .hero__lede, .hero__actions, .hero__fact, .scroll-cue"), { opacity: 0 });
        const intro = createTimeline({ defaults: { ease: "outExpo" } });
        if (title) {
          const chars = float(title);
          utils.set(chars, { opacity: 0 });
          rise(chars, title, 200);
        }
        intro
          .add(hero.querySelectorAll(".hero__eyebrow, .hero__lede, .hero__actions, .hero__fact, .scroll-cue"), {
            opacity: [0, 1],
            y: [24, 0],
            duration: 1100,
            delay: stagger(90),
          }, 550)
          .add(hero.querySelectorAll(".hero__bg"), { scale: [1.18, 1.04], duration: 2600, ease: "outQuart" }, 0);

        // As the hero scrolls away: the photo sinks and grows, the words lift and fade
        animate(hero.querySelectorAll(".hero__bg"), {
          y: ["0%", "18%"],
          scale: [1.04, 1.16],
          ease: "linear",
          autoplay: onScroll({ target: hero, enter: "top top", leave: "top bottom", sync: true }),
        });
        animate(hero.querySelectorAll(".hero__content"), {
          y: [0, -90],
          opacity: [1, 0],
          ease: "linear",
          autoplay: onScroll({ target: hero, enter: "top top", leave: "center top", sync: true }),
        });
      }

      /* ── Package hero ────────────────────────────────────────────── */
      const pkgHero = document.querySelector<HTMLElement>(".pkg-hero");
      if (pkgHero) {
        const title = pkgHero.querySelector<HTMLElement>(".pkg-hero__title");
        utils.set(pkgHero.querySelectorAll(".crumbs, .pkg-hero__lede, .pkg-facts > div, .pkg-hero__buy"), { opacity: 0 });
        utils.set(pkgHero.querySelectorAll(".pkg-hero__media"), { clipPath: "inset(100% 0 0 0 round 14px)" });
        const tl = createTimeline({ defaults: { ease: "outExpo" } });
        tl.add(pkgHero.querySelectorAll(".pkg-hero__media"), { clipPath: ["inset(100% 0 0 0 round 14px)", "inset(0% 0 0 0 round 14px)"], duration: 1500, ease: "inOutQuart" }, 0)
          .add(pkgHero.querySelectorAll(".pkg-hero__media img"), { scale: [1.25, 1], duration: 2200, ease: "outQuart" }, 0);
        if (title) {
          const chars = float(title);
          utils.set(chars, { opacity: 0 });
          rise(chars, title, 300);
        }
        tl.add(pkgHero.querySelectorAll(".crumbs, .pkg-hero__lede, .pkg-facts > div, .pkg-hero__buy"), {
          opacity: [0, 1],
          y: [20, 0],
          duration: 900,
          delay: stagger(70),
        }, 500);
      }

      /* ── Headings: letters float up, then ride the swell ──────────── */
      document.querySelectorAll<HTMLElement>("[data-split], .jt__name, .cruises-hero__title").forEach((el) => {
        const chars = float(el);
        if (el.matches(".jt__name")) {
          // already shown by their own animations: just ride the swell
          el.classList.add("wave-on");
          return;
        }
        utils.set(chars, { opacity: 0 });
        once(el, () => rise(chars, el));
      });

      /* ── The swell: scroll speed raises the waves in every floating line ── */
      {
        let lastY = window.scrollY;
        let lastT = performance.now();
        let swell = 0;
        let dir = 1;
        let raf = 0;
        const settle = () => {
          swell *= 0.92;
          root.style.setProperty("--swell", swell.toFixed(3));
          root.style.setProperty("--swell-dir", String(dir));
          raf = swell > 0.01 ? requestAnimationFrame(settle) : 0;
          if (!raf) root.style.setProperty("--swell", "0");
        };
        const onScrollSwell = () => {
          const now = performance.now();
          const dy = window.scrollY - lastY;
          const v = Math.abs(dy) / Math.max(16, now - lastT);
          lastY = window.scrollY;
          lastT = now;
          if (Math.abs(dy) > 1) dir = dy > 0 ? 1 : -1;
          swell = Math.min(1, Math.max(swell, v * 0.6));
          if (!raf) raf = requestAnimationFrame(settle);
        };
        window.addEventListener("scroll", onScrollSwell, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("scroll", onScrollSwell);
          cancelAnimationFrame(raf);
        });
      }

      /* ── Reveal blocks ───────────────────────────────────────────── */
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const targets = el.dataset.reveal === "stagger" ? Array.from(el.children) : [el];
        utils.set(targets, { opacity: 0, y: 36 });
        el.classList.add("is-armed");
        once(el, () =>
          animate(targets, { opacity: 1, y: 0, duration: 1100, delay: stagger(90), ease: "outQuart" }),
        );
      });

      /* ── Photos develop like a print ─────────────────────────────── */
      document.querySelectorAll<HTMLElement>("[data-develop]").forEach((frame) => {
        const img = frame.querySelector("img");
        if (!img) return;
        utils.set(img, { filter: "grayscale(1) contrast(0.6) brightness(1.35)", scale: 1.14 });
        once(frame, () =>
          createTimeline({ defaults: { ease: "outQuart" } })
            .add(img, { filter: "grayscale(0.6) contrast(1.1) brightness(0.95)", duration: 700 }, 0)
            .add(img, { filter: "grayscale(0) contrast(1) brightness(1)", duration: 1100 }, 650)
            .add(img, { scale: 1, duration: 2000 }, 0),
        );
      });

      /* ── Parallax inside frames ──────────────────────────────────── */
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((frame) => {
        const img = frame.querySelector("img");
        if (!img) return;
        const strength = Number(frame.dataset.parallax || 10);
        utils.set(img, { scale: 1 + strength / 50 });
        animate(img, {
          y: [`-${strength}%`, `${strength}%`],
          ease: "linear",
          autoplay: onScroll({ target: frame, enter: "bottom top", leave: "top bottom", sync: true }),
        });
      });

      /* ── Numbers count up ────────────────────────────────────────── */
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        if (!end) return;
        const counter = { value: 0 };
        once(el, () =>
          animate(counter, {
            value: end,
            duration: 1600,
            ease: "outExpo",
            modifier: utils.round(0),
            onUpdate: () => (el.textContent = formatPrice(counter.value)),
            onComplete: () => (el.textContent = formatPrice(end)),
          }),
        );
      });

      /* ── Cards rise in a wave ────────────────────────────────────── */
      document.querySelectorAll<HTMLElement>(".cards:not([data-self-animate])").forEach((list) => {
        const items = Array.from(list.children);
        utils.set(items, { opacity: 0, y: 60, scale: 0.97 });
        once(list, () => {
          list.classList.add("is-in");
          animate(items, { opacity: 1, y: 0, scale: 1, duration: 1200, delay: stagger(110), ease: "outExpo" });
        });
      });

      /* ── Statement: words turn to ink as it crosses the screen ───── */
      document.querySelectorAll<HTMLElement>("[data-highlight]").forEach((el) => {
        const words = el.querySelectorAll(".hl-word");
        animate(words, {
          opacity: [0.18, 1],
          duration: 400,
          delay: stagger(140),
          ease: "linear",
          autoplay: onScroll({ target: el, enter: "bottom-=10% top", leave: "center+=10% bottom", sync: true }),
        });
      });

      /* ── Route: river draws itself, the boat sails along it ──────── */
      document.querySelectorAll<HTMLElement>("[data-river]").forEach((river) => {
        const path = river.querySelector<SVGPathElement>(".river__path");
        const boat = river.querySelector<HTMLElement>(".river__boat");
        const stops = Array.from(river.querySelectorAll<HTMLElement>(".route__marker span"));
        const sync = onScroll({ target: river, enter: "bottom-=15% top", leave: "center top", sync: true });
        if (path) animate(createDrawable(path), { draw: ["0 0", "0 1"], ease: "linear", autoplay: sync });
        if (boat) {
          animate(boat, {
            left: ["0%", "100%"],
            ease: "linear",
            autoplay: onScroll({
              target: river,
              enter: "bottom-=15% top",
              leave: "center top",
              sync: true,
              onUpdate: (self) => {
                stops.forEach((s, i) => s.classList.toggle("is-passed", self.progress >= i / Math.max(1, stops.length - 1) - 0.02));
              },
            }),
          });
          // a gentle bob on the water
          animate(boat.firstElementChild!, { rotate: [-4, 4], y: [-2, 2], duration: 1600, alternate: true, loop: true, ease: "inOutSine" });
        }
        once(river, () =>
          animate(river.querySelectorAll(".route__stop"), { opacity: [0, 1], y: [40, 0], duration: 1100, delay: stagger(140), ease: "outExpo" }),
        );
        utils.set(river.querySelectorAll(".route__stop"), { opacity: 0 });
      });

      /* ── Package itinerary line ──────────────────────────────────── */
      document.querySelectorAll<HTMLElement>("[data-timeline]").forEach((list) => {
        const line = list.querySelector<HTMLElement>(".timeline__line");
        const items = Array.from(list.querySelectorAll<HTMLElement>("li"));
        if (line) {
          animate(line, {
            scaleY: [0, 1],
            ease: "linear",
            autoplay: onScroll({
              target: list,
              enter: "bottom-=20% top",
              leave: "center+=10% top",
              sync: true,
              onUpdate: (self) => items.forEach((li, i) => li.classList.toggle("is-passed", self.progress >= i / Math.max(1, items.length - 1) - 0.02)),
            }),
          });
        }
        utils.set(items, { opacity: 0, x: -20 });
        once(list, () => animate(items, { opacity: 1, x: 0, duration: 900, delay: stagger(120), ease: "outExpo" }));
      });

      /* ── Photo chapters: pinned story, each photo wipes up over the last ── */
      document.querySelectorAll<HTMLElement>("[data-chapters]").forEach((section) => {
        const frames = Array.from(section.querySelectorAll<HTMLElement>(".chapters__frame"));
        const panels = Array.from(section.querySelectorAll<HTMLElement>(".chapters__panel"));
        const dots = Array.from(section.querySelectorAll<HTMLElement>(".chapters__dot"));
        section.classList.add("is-live");
        const tl = createTimeline({
          defaults: { ease: "linear" },
          autoplay: onScroll({ target: section, enter: "top top", leave: "bottom bottom", sync: true }),
        });
        frames.forEach((frame, i) => {
          const img = frame.querySelector("img");
          const at = i * 1000;
          if (i > 0) {
            tl.add(frame, { clipPath: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"], duration: 450, ease: "inOutQuad" }, at - 600);
            if (img) tl.add(img, { scale: [1.2, 1.04], duration: 1000 }, at - 600);
            tl.add(panels[i - 1], { opacity: [1, 0], y: [0, -24], duration: 200 }, at - 400);
            tl.add(panels[i], { opacity: [0, 1], y: [24, 0], duration: 200 }, at - 250);
            tl.add(dots[i], { scaleX: [0, 1], duration: 300 }, at - 450);
          } else if (img) {
            tl.add(img, { scale: [1.12, 1.04], duration: 400 }, 0);
          }
        });
        tl.add({}, { duration: 1 }, frames.length * 1000 - 600);
      });

      /* ── Closing: sun rises behind the line ──────────────────────── */
      const closing = document.querySelector<HTMLElement>(".closing");
      if (closing) {
        animate(closing.querySelectorAll(".closing__sun"), {
          y: ["60%", "-10%"],
          scale: [0.8, 1.1],
          ease: "linear",
          autoplay: onScroll({ target: closing, enter: "bottom top", leave: "bottom bottom", sync: true }),
        });
      }

      /* ── Ink drawings: lines draw themselves, then the wash soaks in ── */
      document.querySelectorAll<HTMLElement>("[data-draw]").forEach((wrap) => {
        const lines = wrap.querySelectorAll<SVGGeometryElement>(".ink__lines path, .ink__lines circle, .ink__lines ellipse");
        if (!lines.length) return;
        const wash = wrap.querySelectorAll(".ink__wash");
        const drawn = createDrawable(lines);
        utils.set(drawn, { draw: "0 0" });
        once(wrap, () =>
          createTimeline()
            .add(drawn, { draw: ["0 0", "0 1"], duration: 1400, delay: stagger(28), ease: "inOutQuad" }, 0)
            .add(wash, { opacity: [0, 0.88], duration: 1200, ease: "outQuad" }, 700),
        );
      });

      /* ── Idle life: boats bob, palms sway, gulls drift, the sun turns ── */
      document.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) =>
        animate(el, { y: [-7, 7], rotate: [-1.6, 1.6], duration: 3000 + i * 300, alternate: true, loop: true, ease: "inOutSine" }),
      );
      document.querySelectorAll<HTMLElement>("[data-sway]").forEach((el) => {
        el.style.transformOrigin = "50% 100%";
        animate(el, { rotate: [-3, 3], duration: 4200, alternate: true, loop: true, ease: "inOutSine" });
      });
      document.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) =>
        animate(el, { x: [-24, 24], y: [-8, 8], duration: 6400, alternate: true, loop: true, ease: "inOutSine" }),
      );
      document.querySelectorAll<HTMLElement>("[data-spin]").forEach((el) =>
        animate(el.querySelector(".ink") ?? el, { rotate: 360, duration: 60000, loop: true, ease: "linear" }),
      );

      /* ── FAQ answers ease open ───────────────────────────────────── */
      document.querySelectorAll<HTMLDetailsElement>(".faq__item").forEach((item) => {
        const answer = item.querySelector("p");
        const onToggle = () => {
          if (item.open && answer) animate(answer, { opacity: [0, 1], y: [-10, 0], duration: 600, ease: "outExpo" });
        };
        item.addEventListener("toggle", onToggle);
        cleanups.push(() => item.removeEventListener("toggle", onToggle));
      });

      /* ── Magnetic buttons (mouse only) ───────────────────────────── */
      if (window.matchMedia("(pointer: fine)").matches) {
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
          const move = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width / 2) * 0.28;
            const y = (e.clientY - r.top - r.height / 2) * 0.4;
            animate(btn, { x, y, duration: 500, ease: "outQuart", composition: "replace" });
          };
          const leave = () => animate(btn, { x: 0, y: 0, duration: 900, ease: "outElastic(1, .45)", composition: "replace" });
          btn.addEventListener("pointermove", move);
          btn.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            btn.removeEventListener("pointermove", move);
            btn.removeEventListener("pointerleave", leave);
          });
        });
      }
    });

    // Initial states are set, so the hero can show (its words are now held by the timeline).
    root.classList.add("motion-ran");

    return () => {
      observers.forEach((o) => o.disconnect());
      cleanups.forEach((fn) => fn());
      scope.revert();
      splitters.forEach((s) => s.revert());
    };
  }, [pathname]);

  return <div className="progress" aria-hidden="true" />;
}
