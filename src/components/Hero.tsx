import Placeholder from "./Placeholder";

/**
 * Hero — headline, lead, tech-stack row, and the "Take a tour" CTA.
 * The central graphic and stack icons are placeholders pending real assets.
 * Structure kept animation-friendly (stable wrappers) for GSAP later.
 */
export default function Hero() {
  return (
    <section className="page-container relative pt-14 sm:pt-20" id="top">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        {/* Central hero animation (source: Main animation GIF, 342×192) */}
        <Placeholder
          label="Hero animation"
          ratio={342 / 192}
          maxWidth={342}
          className="mb-8"
        />

        {/* Headline */}
        <h1 className="type-display text-ink-hero text-balance">
          Hey I am <span className="text-ink">Melvis</span> a Designer,
          <br />
          who can{" "}
          <span className="font-light" style={{ fontWeight: 300 }}>
            ENGINEER
          </span>
          .
        </h1>

        {/* Lead */}
        <p className="type-lead mt-6 max-w-[494px] text-balance">
          I help with building systems that help people and function with
          absolute brilliance.
        </p>

        {/* My Stack */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="type-label text-ink">My Stack</span>
          <ul className="flex items-center -space-x-2" aria-label="Tech stack">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="size-6 rounded-full border-2 border-background bg-surface"
                aria-hidden
              />
            ))}
          </ul>
        </div>

        {/* CTA */}
        <a
          href="#work"
          className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-btn-dark px-6 py-3 text-white transition-transform hover:-translate-y-0.5"
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
