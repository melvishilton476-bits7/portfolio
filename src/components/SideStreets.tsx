import type { CSSProperties } from "react";
import Placeholder from "./Placeholder";
import HatchCell from "./HatchCell";
import DashRule from "./DashRule";
import RevealText from "./RevealText";

/**
 * SIDE STREETS — the second projects showcase (Figma node 488:448). Where
 * "Sights to See" is a pinned, one-at-a-time carousel, this is a calm, static
 * 2×2 grid you scroll through: a "keep wandering" archive of more work.
 *
 * It reuses the site's blueprint vocabulary end to end — full-bleed dashed
 * rules, diagonal-hatch intersection cells with black corner dots, periwinkle
 * registration squares, and crop-mark + dot corners around each title. Each
 * row is a relative band: two cards on top (title → image), then a shared
 * footer band (quote + a dark "View Project" bar with a dotted accent tab)
 * bracketed by dashed rules with hatch cells at the centre gutter and bleeding
 * off both viewport edges.
 *
 * Desktop (lg+) is the full blueprint grid; below lg it degrades to a clean
 * single-column stack with the decoration dropped (responsive-first, no
 * horizontal overflow — the section clips its own bleed).
 */

const PURPLE = "#8581ff";

const QUOTE =
  "“A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.”";

type SideProject = { title: string; quote: string; href: string };

const PROJECTS: SideProject[] = [
  { title: "TITAN REBRAND", quote: QUOTE, href: "#" },
  { title: "ZENXO | UI & UX", quote: QUOTE, href: "#" },
  { title: "NAGARHOLE | WAYFINDING", quote: QUOTE, href: "#" },
  { title: "TITAN REBRAND", quote: QUOTE, href: "#" },
];

const ROWS: SideProject[][] = [
  [PROJECTS[0], PROJECTS[1]],
  [PROJECTS[2], PROJECTS[3]],
];

/** Crop-mark + nested-dot corners at the four corners of a *card-width* title
 *  frame — the brackets sit on the project image's left/right edges (the frame
 *  spans the full card width, matching Figma node 488:705) with the title
 *  centred between them, rather than hugging the text. */
function TitleCorners() {
  // Each corner is one wrapper (bracket + its nested dot) pinned to the frame
  // corner. On hover of the parent card (`group`) the wrapper slides inward, so
  // the whole crop-mark frame tightens toward the title — the same gesture as
  // the hero CTA brackets. Bracket stroke is a mid-grey (darker than before);
  // the dot stays the canonical #171717.
  const B = "block h-2.5 w-2.5 border-[#8a8a8a]";
  const D = "absolute size-[3.5px] rounded-full bg-[#171717]";
  const W = "pointer-events-none absolute transition-transform duration-300 ease-out";
  return (
    <>
      {/* TL */}
      <span aria-hidden className={`${W} left-0 top-0 group-hover:translate-x-[6px] group-hover:translate-y-[6px]`}>
        <span className={`${B} border-l border-t`} />
        <span className={`${D} left-0 top-0 translate-x-[4px] translate-y-[4px]`} />
      </span>
      {/* TR */}
      <span aria-hidden className={`${W} right-0 top-0 group-hover:-translate-x-[6px] group-hover:translate-y-[6px]`}>
        <span className={`${B} border-r border-t`} />
        <span className={`${D} right-0 top-0 -translate-x-[4px] translate-y-[4px]`} />
      </span>
      {/* BL */}
      <span aria-hidden className={`${W} bottom-0 left-0 group-hover:translate-x-[6px] group-hover:-translate-y-[6px]`}>
        <span className={`${B} border-b border-l`} />
        <span className={`${D} bottom-0 left-0 translate-x-[4px] -translate-y-[4px]`} />
      </span>
      {/* BR */}
      <span aria-hidden className={`${W} bottom-0 right-0 group-hover:-translate-x-[6px] group-hover:-translate-y-[6px]`}>
        <span className={`${B} border-b border-r`} />
        <span className={`${D} bottom-0 right-0 -translate-x-[4px] -translate-y-[4px]`} />
      </span>
    </>
  );
}

/** A small periwinkle square pair — one filled, one outlined, tucked corner-to-
 *  corner in a 20px box. `variant` picks which diagonal the pair sits on so the
 *  four header clusters mirror across both axes. Each square carries the same
 *  scatter animation as the hero periwinkles — a load entrance then a sparse
 *  flicker loop (accent-flicker-a/-b), staggered by `enter`. Desktop only. */
function Cluster({ variant, className, enter }: { variant: "tl" | "bl" | "tr" | "br"; className: string; enter: string }) {
  const filled: CSSProperties = { background: PURPLE };
  const outline: CSSProperties = { border: `1px solid ${PURPLE}` };
  // [style, cornerClasses, flickerClass] for the two squares per variant.
  const layout: Record<typeof variant, [CSSProperties, string, string][]> = {
    tl: [[outline, "right-0 top-0", "accent-flicker-a"], [filled, "left-0 bottom-0", "accent-flicker-b"]],
    bl: [[filled, "left-0 top-0", "accent-flicker-b"], [outline, "right-0 bottom-0", "accent-flicker-a"]],
    tr: [[outline, "left-0 top-0", "accent-flicker-a"], [filled, "right-0 bottom-0", "accent-flicker-b"]],
    br: [[filled, "right-0 top-0", "accent-flicker-b"], [outline, "left-0 bottom-0", "accent-flicker-a"]],
  };
  // Box is exactly twice the square, so the two squares meet corner-to-corner
  // at the centre point (no overlap, no gap).
  return (
    <span aria-hidden className={`pointer-events-none size-[20px] ${className}`}>
      {layout[variant].map(([style, corner, flicker], i) => (
        <span
          key={i}
          className={`absolute size-[10px] ${corner} ${flicker}`}
          style={{ ...style, ["--enter" as string]: enter } as CSSProperties}
        />
      ))}
    </span>
  );
}

/** Card top half — the title (with crop corners) and the project still. */
function CardHead({ p }: { p: SideProject }) {
  return (
    <div className="flex flex-col">
      {/* Title frame — a card-width crop-mark rectangle (brackets on the
          image's left/right edges) with the title centred inside, sitting just
          above the project still. */}
      <div className="relative mb-5 py-1.5">
        <TitleCorners />
        <h3
          className="type-heading text-ink-alt text-center uppercase"
          style={{ fontSize: "clamp(1.25rem, 1.9vw, 1.558rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          {p.title}
        </h3>
      </div>
      <Placeholder
        label={p.title}
        ratio={388 / 216}
        variant="dark"
        className="border-solid border-black/15"
      />
    </div>
  );
}

/** Card footer — the quote and the dark "View Project" bar with its dotted
 *  accent tab. Fixed height so the desktop band decoration lines up. */
function CardFoot({ p }: { p: SideProject }) {
  return (
    <div className="flex flex-col">
      {/* Quote reveals letter-by-letter once the band rules have drawn. The
          flex wrapper keeps the vertical centring within the fixed 60px band;
          RevealText renders a normal text-centred <p> so words wrap cleanly. */}
      <div className="flex h-[60px] items-center justify-center px-6">
        <RevealText
          text={p.quote}
          className="type-caption text-center leading-snug text-ink-muted"
        />
      </div>
      <a
        href={p.href}
        className="relative mt-3 flex h-10 items-center justify-center bg-btn-dark text-white/90 transition-opacity hover:opacity-90"
      >
        <span className="absolute inset-y-0 left-0 flex aspect-square items-center justify-center bg-ink">
          <span className="size-[15px] rounded-full bg-white" />
        </span>
        <span className="type-caption">View Project</span>
      </a>
    </div>
  );
}

/** Desktop-only decoration for a row's footer band: dashed rules top and
 *  bottom, a hatch cell filling the centre gutter, and hatch cells bleeding
 *  off each viewport edge. Anchored to the bottom of the row (both cards are
 *  equal height, so the buttons — and this band — align). */
function BandDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[113px] lg:block">
      <DashRule edge="top" />
      <DashRule edge="bottom" />
      {/* Edge cells — each fills the whole outer margin, from the viewport edge
          right up to the card's outer edge (the decor box is the page-container,
          so its 0 / 100% sit on the outer card edges), putting corner dots on
          those edges. They bleed off-screen (clipped by the section). The three
          cells draw in with a small left-to-right stagger (delay). */}
      <HatchCell
        className="absolute hidden lg:block"
        delay={0}
        style={{ left: "calc(50% - 50vw)", width: "calc(50vw - 50%)", top: 0, height: 113 }}
      />
      {/* Centre-gutter cell — fills the gap between the two image columns, so
          its inner edges (and corner dots) land on the cards' inner edges. */}
      <HatchCell
        className="absolute hidden lg:block"
        delay={90}
        style={{ left: "50%", top: 0, height: 113, width: "var(--gut)", transform: "translateX(-50%)" }}
      />
      <HatchCell
        className="absolute hidden lg:block"
        delay={180}
        style={{ left: "100%", width: "calc(50vw - 50%)", top: 0, height: 113 }}
      />
    </div>
  );
}

function Row({ pair }: { pair: SideProject[] }) {
  return (
    <div
      className="relative grid grid-cols-1 gap-y-12 lg:grid-cols-[1fr_var(--gut)_1fr] lg:gap-y-0"
      style={{ ["--gut" as string]: "clamp(2rem, 12vw, 15rem)" } as CSSProperties}
    >
      <BandDecor />
      {/* Left card — `group` so hovering anywhere on it tightens the title's
          crop-mark brackets (see TitleCorners). */}
      <div className="group relative z-10 flex flex-col">
        <CardHead p={pair[0]} />
        <div className="mt-auto pt-[clamp(28px,3vw,52px)]">
          <CardFoot p={pair[0]} />
        </div>
      </div>
      {/* Gutter spacer — desktop only */}
      <div aria-hidden className="hidden lg:block" />
      {/* Right card */}
      <div className="group relative z-10 flex flex-col">
        <CardHead p={pair[1]} />
        <div className="mt-auto pt-[clamp(28px,3vw,52px)]">
          <CardFoot p={pair[1]} />
        </div>
      </div>
    </div>
  );
}

export default function SideStreets() {
  return (
    <section
      id="side-streets"
      className="relative overflow-x-clip bg-background py-24 sm:py-32"
    >
      {/* Section-opening full-bleed dashed rule. */}
      <DashRule edge="top" />

      <div className="page-container">
        {/* Header — left-aligned, with periwinkle square-pair clusters
            (corner-to-corner) hugging the title's left and right ends, an upper
            and a lower pair on each side, mirrored across both axes. */}
        <header className="mb-16 sm:mb-20">
          <div className="relative inline-block">
            <Cluster variant="tl" enter="0.2s" className="absolute -left-[46px] -top-[22px] hidden lg:block" />
            <Cluster variant="bl" enter="0.5s" className="absolute -left-[46px] -bottom-[14px] hidden lg:block" />
            <Cluster variant="tr" enter="0.35s" className="absolute -right-[46px] -top-[22px] hidden lg:block" />
            <Cluster variant="br" enter="0.65s" className="absolute -right-[46px] -bottom-[14px] hidden lg:block" />
            <h2 className="type-heading text-ink-alt">SIDE STREETS</h2>
            <p className="type-caption mt-3 leading-none" style={{ fontSize: "0.9375rem" }}>
              <span className="text-ink-muted">Keep</span>{" "}
              <span className="text-ink-alt">wandering.</span>
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-16 sm:gap-24 lg:gap-0">
          {ROWS.map((pair, i) => (
            <div key={i} className={i > 0 ? "lg:mt-24" : ""}>
              <Row pair={pair} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
