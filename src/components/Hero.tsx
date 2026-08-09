import Image from "next/image";
import SelectedName from "./SelectedName";
import StackRow from "./StackRow";
import HeroAccents from "./HeroAccents";
import EngineerDecode from "./EngineerDecode";

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
      {/* Scattered blueprint accents behind everything — periwinkle squares,
          a lime block, a corner bracket, plus-marks and two rules bracketing
          the headline. See globals.css → HERO ACCENTS. */}
      <HeroAccents />

      <div className="mx-auto flex max-w-[720px] -translate-y-[30px] flex-col items-center text-center">
        {/* Central hero animation */}
        <Image
          src="/hero-animation.gif"
          alt=""
          width={1024}
          height={576}
          unoptimized
          priority
          className="mb-8 h-auto w-[clamp(220px,40vw,360px)] scale-75"
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
        <div className="relative w-full">
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
            {/* ENGINEER decodes in on load — grey glyphs scramble and lock to
                black one slot at a time, then the periwinkle box + arrow leader
                draw in. The box still hugs the word (relative wrapper + em-inset
                border) so it tracks it at any width. See EngineerDecode.tsx. */}
            <EngineerDecode />
          </h1>
        </div>

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
        <div className="mt-8 flex flex-col items-center">
          <StackRow />
        </div>

        {/* CTA — crop-mark brackets sit just outside and slide in on hover */}
        <div className="group relative mt-11 inline-block transition-transform duration-300 ease-out hover:-translate-y-0.5">
          {/* Crop-mark corners: a light-grey L-bracket with a black registration
              dot nestled in the crook — the same blueprint mark used around the
              "Sights to See" subtitle. Each corner is one group so the bracket
              and its dot slide inward together on hover, from 14px outside at
              rest toward the button. */}
          {/* TL */}
          <span aria-hidden className="pointer-events-none absolute -left-[14px] -top-[14px] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:translate-y-[4px]">
            <span className="block h-4 w-4 border-l border-t border-[#cfcfcf]" />
            <span className="absolute left-0 top-0 size-[3.5px] translate-x-[4px] translate-y-[4px] rounded-full bg-[#171717]" />
          </span>
          {/* TR */}
          <span aria-hidden className="pointer-events-none absolute -right-[14px] -top-[14px] transition-transform duration-300 ease-out group-hover:-translate-x-[4px] group-hover:translate-y-[4px]">
            <span className="block h-4 w-4 border-r border-t border-[#cfcfcf]" />
            <span className="absolute right-0 top-0 size-[3.5px] -translate-x-[4px] translate-y-[4px] rounded-full bg-[#171717]" />
          </span>
          {/* BL */}
          <span aria-hidden className="pointer-events-none absolute -bottom-[14px] -left-[14px] transition-transform duration-300 ease-out group-hover:translate-x-[4px] group-hover:-translate-y-[4px]">
            <span className="block h-4 w-4 border-b border-l border-[#cfcfcf]" />
            <span className="absolute bottom-0 left-0 size-[3.5px] translate-x-[4px] -translate-y-[4px] rounded-full bg-[#171717]" />
          </span>
          {/* BR */}
          <span aria-hidden className="pointer-events-none absolute -bottom-[14px] -right-[14px] transition-transform duration-300 ease-out group-hover:-translate-x-[4px] group-hover:-translate-y-[4px]">
            <span className="block h-4 w-4 border-b border-r border-[#cfcfcf]" />
            <span className="absolute bottom-0 right-0 size-[3.5px] -translate-x-[4px] -translate-y-[4px] rounded-full bg-[#171717]" />
          </span>
          <a
            href="#work"
            className="inline-flex items-center gap-2 bg-btn-dark px-5 py-2.5 text-white"
          >
            <span className="type-label font-medium" style={{ fontSize: "0.9375rem" }}>
              Take a tour
            </span>
            <span aria-hidden className="leading-none" style={{ fontSize: "1rem" }}>
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
