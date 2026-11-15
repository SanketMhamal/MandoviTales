import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Caveat, Fraunces, Hanken_Grotesk } from "next/font/google";
import { site } from "@/content";
import { imageSet } from "@/lib/images";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { Voyage } from "@/components/Voyage";
import { InkDefs } from "@/components/Ink";
import "./globals.css";
import "./motion.css";
import "./journey.css";
import "./watercolour.css";

/* Headings: a soft, slightly wonky serif that sits well beside ink and watercolour. */
const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

/* Hand-lettered notes and labels, used sparingly. */
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const sans = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const ogImage = imageSet(site.hero.photo.image).src;

export const metadata: Metadata = {
  metadataBase: new URL(site.brand.url),
  title: {
    default: `${site.brand.name} · ${site.brand.tagline}`,
    template: `%s · ${site.brand.name}`,
  },
  description: site.brand.description,
  openGraph: {
    type: "website",
    siteName: site.brand.name,
    title: `${site.brand.name} · ${site.brand.tagline}`,
    description: site.brand.description,
    images: [{ url: ogImage, alt: site.hero.photo.alt }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f4eddf",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable} ${hand.variable}`} suppressHydrationWarning>
      <head>
        {/* Turn on the motion layer before first paint, unless the visitor prefers reduced motion. */}
        <Script id="motion-flag" strategy="beforeInteractive">
          {"if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion');setTimeout(function(){document.documentElement.classList.add('motion-ran')},4000)"}
        </Script>
        {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <InkDefs />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Voyage />
        <Motion />
      </body>
    </html>
  );
}
