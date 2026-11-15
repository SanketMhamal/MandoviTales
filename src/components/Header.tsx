"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger } from "animejs";
import { site } from "@/content";
import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./icons";
import { Waves } from "./Sea";

/** A label split into letters (for the hover hop); screen readers hear the whole word. */
function Letters({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} className="nav__char" style={{ "--i": i } as React.CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </>
  );
}

const BARS = {
  flat: ["M1 3 Q7 3 13 3 T25 3", "M1 10 Q7 10 13 10 T25 10", "M1 17 Q7 17 13 17 T25 17"],
  wave: ["M1 3 Q7 0 13 3 T25 3", "M1 10 Q7 13 13 10 T25 10", "M1 17 Q7 14 13 17 T25 17"],
  close: ["M3 2 Q13 10 23 18 T23 18", "M13 10 Q13 10 13 10 T13 10", "M3 18 Q13 10 23 2 T23 2"],
};

type MenuState = "closed" | "opening" | "open" | "closing";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<MenuState>("closed");
  const [current, setCurrent] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const boatRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<SVGSVGElement>(null);
  const open = menu === "opening" || menu === "open";
  // Pages without a full-bleed photo hero get the solid header straight away.
  const overHero = pathname === "/";

  // Solid once scrolled; ducks away going down, floats back going up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 400);
        lastY = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Which section are we in? Drives the boat under the nav.
  useEffect(() => {
    const targets = site.nav
      .map((item) => ({ href: item.href, el: item.href.startsWith("/#") && pathname === "/" ? document.getElementById(item.href.slice(2)) : null }))
      .filter((t): t is { href: string; el: HTMLElement } => !!t.el);
    const update = () => {
      const exact = site.nav.find((item) => item.href === pathname);
      if (exact) return setCurrent(exact.href);
      let found: string | null = null;
      for (const t of targets) if (t.el.getBoundingClientRect().top < window.innerHeight * 0.45) found = t.href;
      setCurrent(found);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  // Sail the boat to the current link.
  useEffect(() => {
    const boat = boatRef.current;
    const list = navRef.current;
    if (!boat || !list) return;
    const link = current ? list.querySelector<HTMLElement>(`a[href="${current}"]`) : null;
    boat.dataset.show = String(!!link);
    if (!link) return;
    // measured on screen, so transforms on the links (their drop-in) can't skew it
    const rail = boat.parentElement!.getBoundingClientRect();
    const r = link.getBoundingClientRect();
    const x = r.left - rail.left + r.width / 2 - boat.offsetWidth / 2;
    const still = !document.documentElement.classList.contains("motion");
    animate(boat, { x, duration: still ? 0 : 1100, ease: "outElastic(1, .6)", composition: "replace" });
  }, [current, scrolled]);

  // The menu button's lines: flat → waves on hover → a cross when open.
  const setBars = (shape: keyof typeof BARS) => {
    const paths = barsRef.current?.querySelectorAll("path");
    if (!paths) return;
    paths.forEach((p, i) => {
      if (!document.documentElement.classList.contains("motion")) return p.setAttribute("d", BARS[shape][i]);
      animate(p, { d: BARS[shape][i], duration: 500, ease: "outElastic(1, .7)", composition: "replace" });
    });
  };

  // Open and close the phone menu like a tide.
  useEffect(() => {
    const panel = menuRef.current;
    if (!panel) return;
    const motion = document.documentElement.classList.contains("motion");
    const items = panel.querySelectorAll("li, .mobile-menu__cta, .mobile-menu__note");
    if (menu === "open" && !motion) {
      document.documentElement.classList.add("menu-open");
      panel.style.clipPath = "none";
      setBars("close");
    }
    if (menu === "closed" && !motion) setBars("flat");
    if (menu === "opening") {
      document.documentElement.classList.add("menu-open");
      setBars("close");
      if (!motion) {
        panel.style.clipPath = "none";
        return;
      }
      createTimeline({ onComplete: () => setMenu("open") })
        .add(panel, { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"], duration: 700, ease: "inOutQuart" }, 0)
        .add(items, { opacity: [0, 1], x: [-40, 0], rotate: [-4, 0], duration: 900, delay: stagger(70), ease: "outBack(1.4)" }, 250)
        .add(panel.querySelectorAll("li .nav__char"), { y: [14, 0], duration: 700, delay: stagger(14), ease: "outBack(2)" }, 300);
    }
    if (menu === "closing") {
      setBars("flat");
      if (!motion) return;
      createTimeline({ onComplete: () => setMenu("closed") })
        .add(items, { opacity: 0, x: 30, duration: 300, delay: stagger(30, { reversed: true }), ease: "inQuad" }, 0)
        .add(panel, { clipPath: "inset(0 0 100% 0)", duration: 550, ease: "inOutQuart" }, 150);
    }
    if (menu === "closed") document.documentElement.classList.remove("menu-open");
  }, [menu]);

  /** Open or close; without motion the menu jumps straight to its end state. */
  const toggle = (want: boolean) => {
    const motion = document.documentElement.classList.contains("motion");
    if (want) setMenu(motion ? "opening" : "open");
    else setMenu(motion ? "closing" : "closed");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && toggle(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => open && toggle(false);
  const solid = scrolled || !overHero || menu !== "closed";

  return (
    <header className="header" data-solid={solid} data-open={open} data-hidden={hidden && menu === "closed"}>
      <div className="wrap header__inner">
        <Link href="/" className="logo" onClick={close} aria-label={`${site.brand.name}, home`}>
          <span className="logo__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <circle cx="16" cy="13" r="6" fill="currentColor" opacity=".9" />
              <path d="M3 21c3.2 0 3.2-2 6.5-2s3.3 2 6.5 2 3.2-2 6.5-2 3.3 2 6.5 2M3 26c3.2 0 3.2-2 6.5-2s3.3 2 6.5 2 3.2-2 6.5-2 3.3 2 6.5 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="logo__word" translate="no">
            {site.brand.name}
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          <ul ref={navRef}>
            {site.nav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={item.href} className="nav__link" aria-current={current === item.href ? (item.href.startsWith("/#") ? "location" : "page") : undefined}>
                  <Letters text={item.label} />
                </Link>
              </li>
            ))}
            <li className="nav__boat-slot" aria-hidden="true">
              <span ref={boatRef} className="nav__boat">
                <svg viewBox="0 0 30 18">
                  <path d="M14 1v8 M14 2l7 3-7 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 10h26l-4 6H6z" fill="currentColor" />
                </svg>
              </span>
            </li>
          </ul>
        </nav>

        <a className="btn btn--primary btn--sm header__cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer" data-magnetic>
          <WhatsAppIcon />
          {site.booking.cta}
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => toggle(!open)}
          onPointerEnter={() => !open && setBars("wave")}
          onPointerLeave={() => !open && setBars("flat")}
        >
          <svg ref={barsRef} className="menu-btn__svg" viewBox="0 0 26 20" aria-hidden="true">
            {BARS.flat.map((d) => (
              <path key={d} d={d} />
            ))}
          </svg>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <div id="mobile-menu" ref={menuRef} className="mobile-menu" data-state={menu} hidden={menu === "closed"}>
        <nav aria-label="Mobile">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} aria-current={current === item.href ? "page" : undefined}>
                  <Letters text={item.label} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--primary btn--block mobile-menu__cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          {site.booking.cta}
        </a>
        <p className="mobile-menu__note">{site.booking.reassurance}</p>
        <Waves className="mobile-menu__waves" />
      </div>
    </header>
  );
}
