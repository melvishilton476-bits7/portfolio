import Image from "next/image";
import SelectedName from "./SelectedName";
import StackRow from "./StackRow";

/**
 * Hero — headline, lead, tech-stack row, and the "Take a tour" CTA.
 * The central graphic and stack icons are placeholders pending real assets.
 * Structure kept animation-friendly (stable wrappers) for GSAP later.
 *
 * Sticky and behind the Work slab (z-0): it pins to the top and holds still
 * while "Sights to See" scrolls up and over it like a card being pulled
 * across. Bounded by the group wrapper in page.tsx, so it unsticks once Work
 * ends rather than lingering behind later sections.
 */
export default function Hero() {
  return (
    <section
      className="page-container sticky top-0 z-0 flex min-h-screen flex-col justify-center pt-24 sm:pt-32"
      id="top"
    >
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        {/* Central hero animation */}
        <Image
          src="/hero-animation.gif"
          alt=""
          width={1024}
          height={576}
          unoptimized
          priority
          className="mb-8 h-auto w-[clamp(220px,40vw,360px)]"
        />

        {/* Greeting — a small supporting line above the headline. Shares the
            tagline's weight (type-lead's own is overridden here) but takes
            the headline's ink colour instead of type-lead's muted default. */}
        <p
          className="type-lead mb-2"
          style={{ fontWeight: 300, color: "var(--color-ink-hero)" }}
        >
          Hello, I am Melvis,
        </p>

        {/* Headline — the selection motif rides DESIGNER. DESIGNER and
            ENGINEER share the base display weight; the connecting words
            ("A", "who can") are a lighter weight so the two roles stand out. */}
        <h1 className="type-display text-ink-hero text-balance">
          <span className="font-light" style={{ fontWeight: 300 }}>
            A
          </span>{" "}
          <SelectedName>
            <span className="text-ink">DESIGNER</span>
          </SelectedName>{" "}
          <span className="font-light" style={{ fontWeight: 300 }}>
            who can
          </span>{" "}
          <span className="text-ink">ENGINEER.</span>
        </h1>

        {/* Lead */}
        <p
          className="type-lead mt-6 max-w-[494px] text-balance"
          style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
        >
          I help with building systems that help people and function with
          absolute brilliance.
        </p>

        {/* Stack row — icons/circles unchanged; the "My Stack" label is
            dropped per the reference. */}
        <div className="mt-10 flex flex-col items-center">
          <StackRow />
        </div>

        {/* CTA */}
        <a
          href="#work"
          className="mt-8 inline-flex items-center gap-2 bg-btn-dark px-6 py-3 text-white transition-transform hover:-translate-y-0.5"
        >
          <span className="type-label font-medium">Take a tour</span>
          <span aria-hidden className="text-lg leading-none">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
