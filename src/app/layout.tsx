import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";

/* Primary display + body typeface used across the site. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* Monospace accent — e.g. the "SEE" in the section heading. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* Small UI / navigation text. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

/* Written to be the line Google shows under the name. Google picks its own
   snippet when this doesn't cover the search, and it had been lifting the
   Titan card's copy; naming the lead work here gives it the right sentence. */
const description =
  "Melvis Hilton, a product designer in Mumbai who builds and simplifies systems that put people first. Work includes Zenxo, a visual strategy builder for options traders, and Strota, a newsroom app for reporters in the field.";

export const metadata: Metadata = {
  metadataBase: new URL("https://melvishilton.com"),
  // Pages set a short title ("About") and the template adds the name.
  title: { default: "Melvis Hilton — Designer who can Simplify", template: "%s — Melvis Hilton" },
  description,
  applicationName: "Melvis Hilton",
  authors: [{ name: "Melvis Hilton", url: "https://melvishilton.com" }],
  creator: "Melvis Hilton",
  keywords: ["Melvis Hilton", "product designer", "UX designer", "interaction design", "portfolio", "Mumbai"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Melvis Hilton — Designer who can Simplify",
    description,
    url: "/",
    siteName: "Melvis Hilton",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Melvis Hilton — Designer who can Simplify",
    description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <SmoothScroll />
        {children}
        {/* Last in the body and fixed at the top of the stack, so it paints
            over everything without joining any section's stacking context. */}
        <Cursor />
      </body>
    </html>
  );
}
