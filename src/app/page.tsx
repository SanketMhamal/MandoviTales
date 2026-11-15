import { Suspense } from "react";
import Link from "next/link";
import { site } from "@/content";
import { whatsappLink } from "@/lib/format";
import { Photo } from "@/components/Photo";
import { PackageExplorer, PackageExplorerView } from "@/components/PackageExplorer";
import { Enquiry } from "@/components/Enquiry";
import { MobileBar } from "@/components/MobileBar";
import { Chapters } from "@/components/Chapters";
import { Journey } from "@/components/Journey";
import { Waves, Boat } from "@/components/Sea";
import { ArrowIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

/** "the sky turns *pink*" → words, with the starred ones marked for the accent colour. */
function statementWords(text: string) {
  return text.split(" ").map((word) => ({ word: word.replace(/\*/g, ""), accent: word.includes("*") }));
}

export default function Home() {
  const { hero, statement, marquee, cruisesSection, onBoard, enquiry, visit, faq, closing, booking } = site;

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title" data-port="Panjim jetty">
        <Photo {...hero.photo} className="hero__bg" sizes="100vw" priority />
        <div className="hero__shade" aria-hidden="true" />
        <div className="wrap hero__content">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            {hero.title}
          </h1>
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__actions">
            <Link href="#cruises" className="btn btn--primary" data-magnetic>
              {hero.primaryCta}
              <ArrowIcon />
            </Link>
            <a className="btn btn--glass" href={whatsappLink()} target="_blank" rel="noopener noreferrer" data-magnetic>
              <WhatsAppIcon />
              {booking.cta}
            </a>
          </div>
          <p className="hero__fact">{hero.fact}</p>
        </div>
        <a href="#statement" className="scroll-cue">
          <span>{hero.scrollCue}</span>
          <span className="scroll-cue__line" aria-hidden="true" />
        </a>
        <Waves className="hero__waves" />
      </section>

      {/* Statement */}
      <section id="statement" className="statement" aria-label="About the cruise">
        <div className="wrap">
          <p className="statement__text" data-highlight>
            {statementWords(statement.text).map(({ word, accent }, i) => (
              <span key={i} className={accent ? "hl-word hl-accent" : "hl-word"}>
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* Cruises */}
      <section id="cruises" className="section" aria-labelledby="cruises-title" data-port="Cruises">
        <div className="wrap">
          <header className="section__head section__head--split">
            <h2 id="cruises-title" className="h2" data-split>
              {cruisesSection.title}
            </h2>
            <p className="section__intro" data-reveal>
              {cruisesSection.intro}
            </p>
          </header>
          <Suspense fallback={<PackageExplorerView filter="all" />}>
            <PackageExplorer />
          </Suspense>
        </div>
      </section>

      {/* Moving strip */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <ul key={copy}>
              {marquee.map((item) => (
                <li key={item}>
                  {item}
                  <Boat className="marquee__boat" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Photo story */}
      <Chapters />

      {/* On board */}
      <section id="on-board" className="section section--surface" aria-labelledby="onboard-title" data-port="On board">
        <div className="wrap">
          <header className="section__head section__head--split">
            <h2 id="onboard-title" className="h2" data-split>
              {onBoard.title}
            </h2>
            <p className="section__intro" data-reveal>
              {onBoard.intro}
            </p>
          </header>
          <ul className="onboard">
            {onBoard.items.map((item, i) => (
              <li key={item.title} className="onboard__item" data-lead={i === 0 || undefined}>
                <div className="onboard__media" data-develop>
                  <Photo {...item.photo} sizes={i === 0 ? "(min-width: 1024px) 80vw, 100vw" : "(min-width: 1024px) 40vw, 100vw"} />
                </div>
                <div className="onboard__text" data-reveal>
                  <h3 className="h3">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Down the river: fly-over of the estuary */}
      <Journey />

      {/* Enquiry */}
      <section id="plan" className="section section--river" aria-labelledby="plan-title" data-port="Plan">
        <Waves className="section__waves section__waves--top" flip />
        <div className="wrap plan">
          <header className="plan__head">
            <h2 id="plan-title" className="h2" data-split>
              {enquiry.title}
            </h2>
            <p className="section__intro" data-reveal>
              {enquiry.intro}
            </p>
            <p className="plan__reassure" data-reveal>
              {booking.reassurance}
            </p>
          </header>
          <div data-reveal>
            <Enquiry />
          </div>
        </div>
        <Waves className="section__waves" />
      </section>

      {/* Visit */}
      <section id="visit" className="section" aria-labelledby="visit-title" data-port="Visit">
        <div className="wrap visit">
          <div className="visit__text">
            <h2 id="visit-title" className="h2" data-split>
              {visit.title}
            </h2>
            <p className="visit__place" data-split="chars">
              {visit.place}
            </p>
            <p className="visit__address" data-reveal>
              {visit.address}
            </p>
            <dl className="facts" data-reveal="stagger">
              {visit.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
            <a className="btn btn--ghost" href={visit.mapsUrl} target="_blank" rel="noopener noreferrer" data-magnetic>
              <PinIcon />
              {visit.mapsCta}
            </a>
          </div>
          <div className="visit__media" data-develop>
            <Photo {...visit.photo} aspect="1:1" sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section--surface" aria-labelledby="faq-title" data-port="FAQ">
        <div className="wrap faq">
          <h2 id="faq-title" className="h2" data-split>
            {faq.title}
          </h2>
          <div className="faq__list" data-reveal="stagger">
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
      <section className="closing" aria-labelledby="closing-title" data-port="Home port">
        <div className="closing__sun" aria-hidden="true" />
        <div className="wrap closing__inner">
          <h2 id="closing-title" className="closing__title" data-split>
            {closing.title}
          </h2>
          <p data-reveal>{closing.text}</p>
          <a className="btn btn--primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer" data-magnetic>
            <WhatsAppIcon />
            {booking.cta}
          </a>
        </div>
        <Waves className="closing__waves" />
      </section>

      <MobileBar />
    </>
  );
}
