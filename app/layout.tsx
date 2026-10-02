import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Poppins({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

// Using a CSS variable for mono to fallback to system fonts, avoiding the Google Fonts fetch error
const monoFont = {
  variable: "--font-mono",
};
export const metadata: Metadata = {
  title: {
    default: "Rent Your Property | Rent Your Property",
    template: "%s | Rent Your Property",
  },
  description: "Find or list rental properties with Rent Your Property. Browse houses, apartments, and commercial spaces for rent in Islamabad and Rawalpindi.",
  metadataBase: new URL("https://rentyourproperty.pk"),
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://rentyourproperty.pk",
    title: "Rent Your Property | Rent Your Property",
    description: "Find or list rental properties with Rent Your Property.",
    siteName: "Rent Your Property",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent Your Property | Rent Your Property",
    description: "Find or list rental properties with Rent Your Property.",
  },
  verification: {
    google: "PLACEHOLDER_GOOGLE_SITE_VERIFICATION_ID",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch settings dynamically, but catch errors safely if DB not ready
  let settings = { phone: "+92-300-1234567", facebook: "", instagram: "", twitter: "", linkedin: "" };
  try {
    const { getSettings } = await import("@/app/actions/settings");
    settings = await getSettings();
  } catch (e) {
    // ignore
  }

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Rent Your Property",
    url: "https://rentyourproperty.pk",
    logo: "https://rentyourproperty.pk/logo.png",
    sameAs: [settings.facebook, settings.instagram, settings.twitter, settings.linkedin].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "customer service",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
  };

  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || "G-PLACEHOLDER"}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || "G-PLACEHOLDER"}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${headingFont.variable} ${monoFont.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
