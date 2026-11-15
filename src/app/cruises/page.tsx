import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { site } from "@/content";
import { formatPrice, packageMessage, whatsappLink } from "@/lib/format";
import { PackageExplorer, PackageExplorerView } from "@/components/PackageExplorer";
import { Enquiry } from "@/components/Enquiry";
import { MobileBar } from "@/components/MobileBar";
import { Waves } from "@/components/Sea";
import { InkBandBoat, InkGulls } from "@/components/Ink";

export const metadata: Metadata = {
  title: site.cruisesPage.metaTitle,
  description: site.cruisesPage.lede,
};

/** "Every cruise on the *Mandovi*" → the starred words in the accent italic. */
function accented(text: string) {
  return text.split(/(\*[^*]+\*)/).map((part, i) => (part.startsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part));
}

export default function CruisesPage() {
  const page = site.cruisesPage;
  const col = page.columns;

  return (
    <>
      <section className="cruises-hero" aria-labelledby="cruises-page-title" data-port="All cruises">
        <div className="wrap cruises-hero__grid">
          <header className="cruises-hero__head" data-reveal>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 id="cruises-page-title" className="cruises-hero__title">
              {accented(page.title)}
            </h1>
            <p className="cruises-hero__lede">{page.lede}</p>
          </header>
          <div className="cruises-hero__art" data-float>
            <InkGulls />
            <InkBandBoat />
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-label="Cruises">
        <div className="wrap">
          <Suspense fallback={<PackageExplorerView filter="all" />}>
            <PackageExplorer />
          </Suspense>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="compare-title" data-port="Compare">
        <div className="wrap">
          <header className="section__head">
            <h2 id="compare-title" className="h2" data-split>
              {page.compareTitle}
            </h2>
          </header>
          <div className="compare-wrap" data-reveal>
            <table className="compare">
              <caption>{page.compareCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{col.cruise}</th>
                  <th scope="col">{col.departs}</th>
                  <th scope="col">{col.duration}</th>
                  <th scope="col">{col.days}</th>
                  <th scope="col">{col.price}</th>
                  <th scope="col">
                    <span className="sr-only">{col.book}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {site.packages.map((p) => (
                  <tr key={p.slug}>
                    <th scope="row">
                      <Link href={`/packages/${p.slug}`}>{p.name}</Link>
                    </th>
                    <td>{p.departs}</td>
                    <td>{p.duration}</td>
                    <td>{p.days}</td>
                    <td className="compare__price">{p.price !== null ? formatPrice(p.price) : p.priceNote}</td>
                    <td className="compare__book">
                      <a href={whatsappLink(packageMessage(p.name, "a date to be confirmed", "our group"))} target="_blank" rel="noopener noreferrer">
                        {page.bookLink}
                        <span className="sr-only"> to book the {p.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section section--river" aria-labelledby="plan-title" data-port="Plan">
        <Waves className="section__waves section__waves--top" flip />
        <div className="wrap plan">
          <header className="plan__head">
            <h2 id="plan-title" className="h2" data-split>
              {site.enquiry.title}
            </h2>
            <p className="section__intro" data-reveal>
              {site.enquiry.intro}
            </p>
            <p className="plan__reassure" data-reveal>
              {site.booking.reassurance}
            </p>
          </header>
          <div data-reveal>
            <Enquiry />
          </div>
        </div>
        <Waves className="section__waves" />
      </section>

      <MobileBar />
    </>
  );
}
