import Link from "next/link";
import { site } from "@/content";
import { whatsappLink } from "@/lib/format";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div>
          <p className="footer__name" translate="no">{site.brand.name}</p>
          <p className="footer__note">{site.footer.note}</p>
        </div>
        <nav aria-label="Cruises">
          <p className="footer__head">Cruises</p>
          <ul>
            {site.packages.map((p) => (
              <li key={p.slug}>
                <Link href={`/packages/${p.slug}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="footer__head">Visit</p>
          <p>
            {site.visit.place}
            <br />
            {site.visit.address}
          </p>
          <ul>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            {site.footer.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap footer__base">
        <p>
          © {year} {site.brand.name}
        </p>
        {site.footer.credits && <p className="footer__credits">{site.footer.credits}</p>}
      </div>
    </footer>
  );
}
