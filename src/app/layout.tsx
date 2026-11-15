import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { site } from "@/content";
import { imageSet } from "@/lib/images";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { Voyage } from "@/components/Voyage";
import "./globals.css";
import "./motion.css";

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
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
  themeColor: "#f5efe4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
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
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Voyage />
        <Motion />
      </body>
    </html>
  );
}
