"use client";

import { useEffect, useState } from "react";
import { site } from "@/content";
import { whatsappLink } from "@/lib/format";
import { WhatsAppIcon } from "./icons";

/** Sticky booking bar on phones, shown once the visitor scrolls past the first screen. */
export function MobileBar({ message }: { message?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="mobile-bar" data-show={show} aria-hidden={!show}>
      <a className="btn btn--primary btn--block" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1}>
        <WhatsAppIcon />
        {site.booking.cta}
      </a>
    </div>
  );
}
