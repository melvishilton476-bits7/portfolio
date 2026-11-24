import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/** A missing page: says so in the tab and to search engines (which must not
 *  index it), and offers the way back. */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="page-container flex flex-1 flex-col items-center justify-center py-40 text-center">
        <p className="type-caption uppercase tracking-[0.14em] text-ink-muted">404</p>
        <h1 className="type-heading mt-4 text-ink-hero">This street doesn&rsquo;t exist.</h1>
        <p className="type-note mt-4 text-ink-muted">The page may have moved, or the link was mistyped.</p>
        <Link
          href="/"
          className="type-caption mt-8 inline-flex h-11 items-center bg-btn-dark px-6 font-medium text-white transition-colors hover:bg-ink"
        >
          Back to the home page
        </Link>
      </main>
      <Footer />
    </>
  );
}
