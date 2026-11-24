import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import SideStreets from "@/components/SideStreets";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/seo";

/** Who this site is about, for search engines: lets Google tie the name to
 *  the site and the profiles elsewhere (a knowledge-panel candidate). */
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Melvis Hilton",
  url: SITE_URL,
  jobTitle: "Product Designer",
  description: "Designer who builds and simplifies systems that put people first.",
  address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressCountry: "IN" },
  sameAs: [
    "https://www.linkedin.com/in/melvis-hilton-1b2982291",
    "https://www.instagram.com/melvis_18_08_/",
    "https://medium.com/@melvishilton476",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Static, site-authored JSON; nothing user-supplied goes in here.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }}
      />
      <Nav />
      <main className="flex-1">
        {/* Slide-over group: Work scrolls up and over the sticky Hero like a
            card. Wrapping them bounds Hero's stickiness to this group, so it
            unsticks when Work ends rather than showing through Contact. */}
        <div className="relative">
          <Hero />
          <Work />
        </div>
        <SideStreets />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
