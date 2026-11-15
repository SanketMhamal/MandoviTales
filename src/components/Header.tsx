"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content";
import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./icons";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Pages without a full-bleed photo hero get the solid header straight away.
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || !overHero || open;

  return (
    <header className="header" data-solid={solid} data-open={open}>
      <div className="wrap header__inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)} aria-label={`${site.brand.name}, home`}>
          <span className="logo__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <circle cx="16" cy="13" r="6" fill="currentColor" opacity=".9" />
              <path d="M3 21c3.2 0 3.2-2 6.5-2s3.3 2 6.5 2 3.2-2 6.5-2 3.3 2 6.5 2M3 26c3.2 0 3.2-2 6.5-2s3.3 2 6.5 2 3.2-2 6.5-2 3.3 2 6.5 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="logo__word" translate="no">{site.brand.name}</span>
        </Link>

        <nav className="nav" aria-label="Main">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--primary btn--sm header__cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          {site.booking.cta}
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-btn__bars" aria-hidden="true" />
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--primary btn--block" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          {site.booking.cta}
        </a>
        <p className="mobile-menu__note">{site.booking.reassurance}</p>
      </div>
    </header>
  );
}
