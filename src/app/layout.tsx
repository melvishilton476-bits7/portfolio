import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter, Courier_Prime } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

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

/* Typewriter — the quote struck onto the print in the About polaroid. Courier
   Prime rather than the JetBrains mono already loaded: JetBrains is a screen
   face for code, drawn even and open, and it reads as a terminal. This one is
   a typewriter, which is what a line typed onto a photographic print should
   look like. Regular only; nothing here needs the bold. */
const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/* Small UI / navigation text. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Melvis Hilton — Designer who can Engineer",
  description:
    "I help build systems that help people and function with absolute brilliance. Portfolio of Melvis Hilton.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        {children}
        {/* Last in the body and fixed at the top of the stack, so it paints
            over everything without joining any section's stacking context. */}
        <Cursor />
      </body>
    </html>
  );
}
