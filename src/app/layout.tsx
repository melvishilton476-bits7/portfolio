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

const description =
  "I help build and simplify systems that put people first and work brilliantly. Portfolio of Melvis Hilton.";

export const metadata: Metadata = {
  metadataBase: new URL("https://melvishilton.com"),
  title: "Melvis Hilton — Designer who can Simplify",
  description,
  alternates: { canonical: "./" },
  openGraph: {
    title: "Melvis Hilton — Designer who can Simplify",
    description,
    url: "./",
    siteName: "Melvis Hilton",
    type: "website",
  },
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
