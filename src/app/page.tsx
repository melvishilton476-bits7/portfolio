import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import SideStreets from "@/components/SideStreets";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
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
