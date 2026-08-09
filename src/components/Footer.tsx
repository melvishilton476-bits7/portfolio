import type { CSSProperties } from "react";
import TrafficLight from "./TrafficLight";
import Cat from "./Cat";

/**
 * Footer — the closing "Edge of the City" scene (Figma node 505:1274 bottom).
 *
 * A full-bleed pale-periwinkle "ruled-paper" band (dashed top & bottom rules)
 * seams it to the section above. Below it:
 *
 *   • Left column: four nav links, each framed by hand-drawn crop-mark
 *     brackets with black registration dots that TIGHTEN inward on hover (the
 *     same gesture as the SideStreets titles and hero CTA), then the closing
 *     "Come Again Soon" / "Thank You for your Curiosity!" sign-off.
 *   • Right edge: the supplied <TrafficLight> street scene (mast + overhead arm
 *     bleeding off the top-right, three-lens signal head, "EDGE OF THE CITY"
 *     plate), a pair of periwinkle registration square-clusters floating beside
 *     the sign-off, and a little black <Cat> peeking up from the bottom edge.
 *
 * The street scene, periwinkle clusters and cat are decorative (aria-hidden)
 * and desktop-only (hidden below lg), where they would crowd the text and risk
 * horizontal overflow; the sign-off stands on its own on small screens.
 */

const PURPLE = "#8581ff";
const DASH = "rgba(23,23,23,0.16)";
const DASH_H = `repeating-linear-gradient(to right, ${DASH} 0px, ${DASH} 10px, transparent 10px, transparent 18px)`;
// The 45° blueprint hatch shared by the site's other blue bands (HatchCell /
// SightsBand) — thin grey diagonals over the periwinkle fill.
const HATCH = `repeating-linear-gradient(45deg, #a1a1a1 0, #a1a1a1 0.75px, transparent 0.75px, transparent 6px)`;

const LINKS = ["Sights to See", "Work", "About", "Blogs"];

/** A single nav link wearing crop-mark corners + registration dots that tighten
 *  inward when the link is hovered (`group`). Brackets hug the link's own box
 *  (text + arrow) with a little breathing room, matching the mock. */
function FooterLink({ name }: { name: string }) {
  // Wrapper (bracket + its dot) pinned to a corner; on hover it slides toward
  // the centre. Bracket stroke is the site's mid-grey; dots are canonical
  // #171717 (see memory: decorative dots are always black).
  const W = "pointer-events-none absolute transition-transform duration-300 ease-out";
  const B = "block h-2 w-2 border-[#8a8a8a]";
  const D = "absolute size-[3px] rounded-full bg-[#171717]";
  return (
    <a
      href="#"
      // Brackets hug the label (Figma node 505:1274): Space Grotesk 16px with
      // -0.08em tracking, ~13px from the left crop mark to the text, the frame
      // ~34px tall. px-[9px]/py-[3px] + the crop marks sitting 4px outside the
      // padding box land those exact offsets.
      className="font-display group relative inline-flex min-w-[80px] items-center gap-2 px-[9px] py-[3px] text-[1rem] font-normal leading-[20px] tracking-[-0.08em] text-ink transition-colors hover:text-accent-strong"
    >
      {/* TL — dot nested inside the crook (down-right of the corner). */}
      <span aria-hidden className={`${W} -left-1 -top-1 group-hover:translate-x-[5px] group-hover:translate-y-[5px]`}>
        <span className={`${B} border-l border-t`} />
        <span className={`${D} left-[3px] top-[3px]`} />
      </span>
      {/* TR */}
      <span aria-hidden className={`${W} -right-1 -top-1 group-hover:-translate-x-[5px] group-hover:translate-y-[5px]`}>
        <span className={`${B} border-r border-t`} />
        <span className={`${D} right-[3px] top-[3px]`} />
      </span>
      {/* BL */}
      <span aria-hidden className={`${W} -bottom-1 -left-1 group-hover:translate-x-[5px] group-hover:-translate-y-[5px]`}>
        <span className={`${B} border-b border-l`} />
        <span className={`${D} bottom-[3px] left-[3px]`} />
      </span>
      {/* BR */}
      <span aria-hidden className={`${W} -bottom-1 -right-1 group-hover:-translate-x-[5px] group-hover:-translate-y-[5px]`}>
        <span className={`${B} border-b border-r`} />
        <span className={`${D} bottom-[3px] right-[3px]`} />
      </span>

      {name}
      <span
        aria-hidden
        className="text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-strong"
      >
        &#8599;
      </span>
    </a>
  );
}

/** A periwinkle registration square-pair — outline + filled, meeting corner-to-
 *  corner. `dir` sets which diagonal the filled square runs off toward. */
function Cluster({ className, dir }: { className: string; dir: "down" | "up" }) {
  const filledPos = dir === "down" ? "left-[9px] top-[9px]" : "left-[9px] -top-[9px]";
  return (
    <span aria-hidden className={`pointer-events-none absolute hidden lg:block ${className}`}>
      <span className="absolute left-0 top-0 size-[9px]" style={{ border: `1px solid ${PURPLE}` }} />
      <span className={`absolute size-[9px] ${filledPos}`} style={{ background: PURPLE }} />
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-background">
      {/* Ruled-paper periwinkle band — full-bleed, dashed rules top & bottom. */}
      <div
        aria-hidden
        className="relative h-[clamp(44px,5vw,62px)] w-screen bg-[#8581ff]/[0.07]"
        style={{ left: "calc(50% - 50vw)", backgroundImage: HATCH }}
      >
        <span className="absolute inset-x-0 top-0 h-px" style={{ backgroundImage: DASH_H }} />
        <span className="absolute inset-x-0 bottom-0 h-px" style={{ backgroundImage: DASH_H }} />
      </div>

      <div className="relative overflow-x-clip">
        {/* Right-edge street scene — one supplied asset. Desktop only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-[46%] lg:block"
        >
          <TrafficLight className="absolute -right-[2%] bottom-0 h-full w-auto" />
        </div>

        {/* Left column — the real content. */}
        <div className="page-container relative z-10 flex min-h-[clamp(460px,58vw,620px)] flex-col justify-between pt-24 pb-14 sm:pt-28">
          {/* Nav links — bracketed, left-aligned. The negative left margin pulls
              the first bracket's crop mark back to the container edge so the
              link text still lines up with the sign-off below. */}
          {/* ml-1 lines the crop marks' left edge up with the sign-off below
              (the marks sit 4px outside the padding box). The big gap matches
              Figma's airy ~99px option-to-option rhythm (≈65px between frames),
              eased down on smaller screens. */}
          <nav aria-label="Footer" className="ml-1">
            <ul className="flex flex-col items-start gap-[clamp(2.75rem,7vw,4.5rem)]">
              {LINKS.map((name) => (
                <li key={name}>
                  <FooterLink name={name} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Sign-off, with the periwinkle clusters floating off to its right. */}
          <div className="relative max-w-[62%] lg:max-w-[58%]">
            <Cluster className="left-[calc(100%+clamp(2rem,10vw,7rem))] -top-2" dir="down" />
            <Cluster className="left-[calc(100%+clamp(6rem,16vw,11rem))] -top-6" dir="up" />
            <p className="type-caption text-ink-muted">Come Again Soon</p>
            {/* type-heading, not type-display — the display size is reserved for
                the hero <h1>, so this sign-off sits a step below it. */}
            <h2 className="type-heading mt-2 text-ink">
              Thank You for your Curiosity&nbsp;!
            </h2>
          </div>
        </div>

        {/* The cat peeking up from the bottom edge. Desktop only. */}
        <Cat className="pointer-events-none absolute bottom-0 left-[72%] z-10 hidden h-auto w-[clamp(44px,4vw,56px)] lg:block" />
      </div>
    </footer>
  );
}
