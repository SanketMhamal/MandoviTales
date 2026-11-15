import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content";
import { formatPrice, getPackage, packageMessage, whatsappLink } from "@/lib/format";
import { imageSet } from "@/lib/images";
import { Photo } from "@/components/Photo";
import { PackageCard } from "@/components/PackageCard";
import { Enquiry } from "@/components/Enquiry";
import { MobileBar } from "@/components/MobileBar";
import { WhatsAppIcon } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return site.packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/packages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) return {};
  const priceText = pkg.price !== null ? `${formatPrice(pkg.price)} ${pkg.priceNote}` : pkg.priceNote;
  const description = `${pkg.summary} ${pkg.duration}, departs ${pkg.departs}. ${priceText}.`;
  return {
    title: pkg.name,
    description,
    openGraph: { title: pkg.name, description, images: [{ url: imageSet(pkg.cover.image).src, alt: pkg.cover.alt }] },
  };
}

export default async function PackagePage({ params }: PageProps<"/packages/[slug]">) {
  const { slug } = await params;
  const pkg = getPackage(slug);
  if (!pkg) notFound();

  const others = site.packages.filter((p) => p.slug !== pkg.slug).slice(0, 3);
  const bookMessage = packageMessage(pkg.name, "a date to be confirmed", "our group");

  const facts = [
    { label: "Duration", value: pkg.duration },
    { label: "Departs", value: pkg.departs },
    { label: "Boarding", value: pkg.boarding },
    { label: "Runs", value: pkg.days },
  ];

  return (
    <>
      <section className="pkg-hero" aria-labelledby="pkg-title" data-enter>
        <div className="wrap pkg-hero__grid">
          <div className="pkg-hero__text">
            <nav aria-label="Breadcrumb" className="crumbs">
              <ol>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/#cruises">Cruises</Link>
                </li>
                <li aria-current="page">{pkg.name}</li>
              </ol>
            </nav>
            <h1 id="pkg-title" className="pkg-hero__title">
              {pkg.name}
            </h1>
            <p className="pkg-hero__lede">{pkg.description}</p>
            <dl className="pkg-facts">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="pkg-hero__buy">
              <p className="price price--lg">
                {pkg.price !== null ? (
                  <>
                    <span className="price__amount">{formatPrice(pkg.price)}</span>
                    <span className="price__note"> {pkg.priceNote}</span>
                  </>
                ) : (
                  <span className="price__amount price__amount--text">{pkg.priceNote}</span>
                )}
              </p>
              <a className="btn btn--primary" href={whatsappLink(bookMessage)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                {site.booking.cta}
              </a>
            </div>
          </div>
          <div className="pkg-hero__media">
            <Photo {...pkg.cover} aspect="4:5" sizes="(min-width: 1024px) 50vw, 100vw" priority />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="day-title">
        <div className="wrap pkg-detail">
          <div>
            <h2 id="day-title" className="h2">
              How the cruise runs
            </h2>
            <ol className="timeline">
              {pkg.itinerary.map((step) => (
                <li key={`${step.time}-${step.title}`}>
                  <span className="timeline__time">{step.time}</span>
                  <div>
                    <h3 className="timeline__title">{step.title}</h3>
                    {step.detail && <p>{step.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="pkg-aside">
            <h2 className="h3">What’s included</h2>
            <ul className="ticks">
              {pkg.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 className="h3">Good to know</h2>
            <ul className="notes">
              {pkg.goodToKnow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
        <div className="wrap pkg-gallery">
          {pkg.gallery.map((photo) => (
            <div key={photo.image} className="pkg-gallery__item">
              <Photo {...photo} aspect="3:2" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      </section>

      <section className="section section--river" aria-labelledby="plan-title">
        <div className="wrap plan">
          <header className="plan__head">
            <h2 id="plan-title" className="h2">
              {site.enquiry.title}
            </h2>
            <p className="section__intro">{site.enquiry.intro}</p>
            <p className="plan__reassure">{site.booking.reassurance}</p>
          </header>
          <Enquiry defaultSlug={pkg.slug} />
        </div>
      </section>

      <section className="section" aria-labelledby="more-title">
        <div className="wrap">
          <header className="section__head">
            <h2 id="more-title" className="h2">
              More cruises
            </h2>
          </header>
          <ul className="cards cards--three">
            {others.map((p) => (
              <li key={p.slug}>
                <PackageCard pkg={p} cta={site.cruisesSection.cardCta} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MobileBar message={bookMessage} />
    </>
  );
}
