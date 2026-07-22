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

        {/* Headline */}
        <h1 className="type-display text-ink-hero text-balance">
          Hey I am{" "}
          <SelectedName>
            <span className="text-ink">Melvis</span>
          </SelectedName>{" "}
          a Designer,
          <br />
          who can{" "}
          <span className="font-light" style={{ fontWeight: 300 }}>
            ENGINEER
          </span>
          .
        </h1>

        {/* Lead */}
        <p
          className="type-lead mt-6 max-w-[494px] text-balance"
          style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
        >
          I help with building systems that help people and function with
          absolute brilliance.
        </p>

        {/* My Stack */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span
            className="type-label text-ink-muted"
            style={{ fontWeight: 400, letterSpacing: "-0.08em" }}
          >
            My Stack
          </span>
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
