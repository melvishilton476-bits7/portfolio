import Placeholder from "./Placeholder";
import ProjectCard from "./ProjectCard";

const PROJECTS = [
  { title: "TITAN — REBRAND", meta: "SOLO, 2025" },
  { title: "TITAN — REBRAND", meta: "SOLO, 2025" },
  { title: "TITAN — REBRAND", meta: "SOLO, 2025" },
];

/**
 * "SIGHTS to SEE" — work / projects showcase. A featured framed piece with
 * a pull quote, plus a grid of project cards.
 */
export default function Work() {
  return (
    <section id="work" className="page-container py-24 sm:py-32">
      {/* Heading */}
      <header className="text-center">
        <h2 className="type-heading text-ink-alt">
          SIGHTS to <span className="font-mono">SEE</span>
        </h2>
        <p className="type-lead mt-3">
          Problems walked into. Solutions built out of.
        </p>
      </header>

      {/* Featured piece with corner-bracket framing + pull quote */}
      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[494px]">
          {/* Corner brackets */}
          <span className="pointer-events-none absolute -left-3 -top-3 size-8 border-l-2 border-t-2 border-accent" />
          <span className="pointer-events-none absolute -right-3 -top-3 size-8 border-r-2 border-t-2 border-accent" />
          <span className="pointer-events-none absolute -bottom-3 -left-3 size-8 border-b-2 border-l-2 border-accent" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 size-8 border-b-2 border-r-2 border-accent" />
          <Placeholder label="Featured project" ratio={493 / 256} variant="dark" />
        </div>

        <blockquote className="type-label max-w-[406px] font-normal leading-snug text-ink">
          &ldquo;A conceptual rebrand of Titan, India&rsquo;s iconic eyewear
          brand, reimagined for the athletic market.&rdquo;
        </blockquote>
      </div>

      {/* Callout */}
      <div className="mt-14 flex justify-center">
        <a
          href="#work"
          className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-accent px-5 py-3 text-accent-ink transition-transform hover:-translate-y-0.5"
        >
          <span className="type-caption font-medium">
            Go ahead click, Don&rsquo;t be shy
          </span>
          <span aria-hidden>→</span>
        </a>
      </div>

      {/* Project grid */}
      <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={i} title={p.title} meta={p.meta} />
        ))}
      </div>
    </section>
  );
}
