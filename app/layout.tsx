import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { CartFlyOverlay } from "@/components/motion/CartFlyOverlay";
import { AmbientPlayerProvider } from "@/components/audio/ambient-player.context";
import { PlayerMount } from "@/components/audio/PlayerMount";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wdgreenhill.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WD Greenhill & Co — Digital Piano Parts & Repairs",
    template: "%s | WD Greenhill & Co",
  },
  description:
    "Europe's largest independent stockist of digital piano, keyboard & organ parts. Official Kawai UK service partner. Est. 1980. 5,000+ manuals, 30+ brands supported.",
  keywords: [
    "digital piano parts",
    "keyboard repair",
    "organ parts",
    "Kawai service",
    "Hammond organ oil",
    "vintage organ parts",
    "piano service manuals",
    "WDGreenhill",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "WD Greenhill & Co",
    title: "WD Greenhill & Co — Digital Piano Parts & Repairs",
    description:
      "Europe's largest independent stockist of digital piano, keyboard & organ parts. Official Kawai UK service partner since 1980.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WD Greenhill & Co",
    description: "Europe's largest independent digital piano parts stockist.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "W D Greenhill & Co Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/images/og-default.jpg`,
  description: "Europe's largest independent stockist of digital piano, keyboard & organ parts. Official Kawai UK service partner since 1980.",
  foundingDate: "1980",
  address: {
    "@type": "PostalAddress",
    streetAddress: "138 Ashingdon Road",
    addressLocality: "Rochford",
    addressRegion: "Essex",
    postalCode: "SS4 1TA",
    addressCountry: "GB",
  },
  telephone: "+441702546195",
  email: "info@wdgreenhill.com",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[hsl(50,20%,98%)]">
        <AmbientPlayerProvider>
          <SmoothScroll>
            <CustomCursor />
            <CartFlyOverlay />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <PlayerMount />
          </SmoothScroll>
        </AmbientPlayerProvider>
      </body>
    </html>
  );
}
