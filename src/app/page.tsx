import { Suspense } from "react";
import Link from "next/link";
import { site } from "@/content";
import { whatsappLink } from "@/lib/format";
import { Photo } from "@/components/Photo";
import { PackageExplorer, PackageExplorerView } from "@/components/PackageExplorer";
import { Enquiry } from "@/components/Enquiry";
import { MobileBar } from "@/components/MobileBar";
import { ArrowIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

export default function Home() {
  const { hero, cruisesSection, onBoard, route, enquiry, visit, faq, closing, booking } = site;

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title" data-enter>
        <Photo {...hero.photo} className="hero__bg" sizes="100vw" priority />
        <div className="hero__shade" aria-hidden="true" />
        <div className="wrap hero__content">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            {hero.title}
          </h1>
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__actions">
            <Link href="#cruises" className="btn btn--primary">
              {hero.primaryCta}
              <ArrowIcon />
            </Link>
            <a className="btn btn--glass" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              {booking.cta}
            </a>
          </div>
          <p className="hero__fact">{hero.fact}</p>
        </div>
      </section>

      {/* Cruises */}
      <section id="cruises" className="section" aria-labelledby="cruises-title">
        <div className="wrap">
          <header className="section__head section__head--split">
            <h2 id="cruises-title" className="h2">
              {cruisesSection.title}
            </h2>
            <p className="section__intro">{cruisesSection.intro}</p>
          </header>
          <Suspense fallback={<PackageExplorerView filter="all" />}>
            <PackageExplorer />
          </Suspense>
        </div>
      </section>

      {/* On board */}
      <section id="on-board" className="section section--surface" aria-labelledby="onboard-title">
        <div className="wrap">
          <header className="section__head section__head--split">
            <h2 id="onboard-title" className="h2">
              {onBoard.title}
            </h2>
            <p className="section__intro">{onBoard.intro}</p>
          </header>
          <ul className="onboard">
            {onBoard.items.map((item, i) => (
              <li key={item.title} className="onboard__item" data-lead={i === 0 || undefined}>
                <div className="onboard__media">
                  <Photo {...item.photo} sizes={i === 0 ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} />
                </div>
                <div className="onboard__text">
                  <h3 className="h3">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Route */}
      <section id="route" className="section" aria-labelledby="route-title">
        <div className="wrap">
          <header className="section__head section__head--split">
            <h2 id="route-title" className="h2">
              {route.title}
            </h2>
            <p className="section__intro">{route.intro}</p>
          </header>
          <ol className="route">
            {route.stops.map((stop, i) => (
              <li key={stop.name} className="route__stop">
                <div className="route__marker" aria-hidden="true">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="route__media">
                  <Photo {...stop.photo} aspect="4:5" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <h3 className="h3">{stop.name}</h3>
                <p>{stop.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Enquiry */}
      <section id="plan" className="section section--river" aria-labelledby="plan-title">
        <div className="wrap plan">
          <header className="plan__head">
            <h2 id="plan-title" className="h2">
              {enquiry.title}
            </h2>
            <p className="section__intro">{enquiry.intro}</p>
            <p className="plan__reassure">{booking.reassurance}</p>
          </header>
          <Enquiry />
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="section" aria-labelledby="visit-title">
        <div className="wrap visit">
          <div className="visit__text">
            <h2 id="visit-title" className="h2">
              {visit.title}
            </h2>
            <p className="visit__place">{visit.place}</p>
            <p className="visit__address">{visit.address}</p>
            <dl className="facts">
              {visit.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <a className="btn btn--ghost" href={visit.mapsUrl} target="_blank" rel="noopener noreferrer">
              <PinIcon />
              {visit.mapsCta}
            </a>
          </div>
          <div className="visit__media">
            <Photo {...visit.photo} aspect="4:5" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section--surface" aria-labelledby="faq-title">
        <div className="wrap faq">
          <h2 id="faq-title" className="h2">
            {faq.title}
          </h2>
          <div className="faq__list">
            {faq.items.map((item) => (
              <details key={item.q} className="faq__item">
                <summary>
                  <span>{item.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="closing" aria-labelledby="closing-title">
        <div className="wrap closing__inner">
          <h2 id="closing-title" className="closing__title">
            {closing.title}
          </h2>
          <p>{closing.text}</p>
          <a className="btn btn--primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            {booking.cta}
          </a>
        </div>
      </section>

      <MobileBar />
    </>
  );
}
