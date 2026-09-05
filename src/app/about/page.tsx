import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import About from "@/components/about/About";

/**
 * /about — a real route rather than an anchor on the home page, so the nav's
 * About item links somewhere with its own URL and its own metadata.
 *
 * Same shell as the case-study route: Nav, a flex-1 main clipped horizontally
 * (the title band's dashed rules run to both viewport edges and would
 * otherwise put a sliver of horizontal scroll on the page), then Footer.
 */
export const metadata: Metadata = {
  title: "About — Melvis Hilton",
  description:
    "Melvis Hilton: a Mallu born and brought up in Mumbai who likes working with people, on products for people, and pushing the limits on how platforms and tech interact with them.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 overflow-x-clip">
        <About />
      </main>
      <Footer />
    </>
  );
}
