import type { CSSProperties } from "react";
// import Vase from "./Vase"; // commented out for now
import HatchCell from "./HatchCell";
import Chair from "./Chair";
import Fire from "./Fire";
import Fireplace from "./Fireplace";
import Fumes from "./Fumes";
import CodeMotes from "./CodeMotes";

/**
 * "Come have a seat!" — contact section. Dark form on the left, playful
 * illustrations (campfire + chair) on the right. Submission is stubbed;
 * wire "Book a Slot" / "Go To LinkedIn" to real endpoints later.
 *
 * The header reuses the site's blueprint vocabulary (Figma node 488:448): the
 * heading sits in a band bracketed by full-bleed dashed rules with periwinkle
 * diagonal-hatch cells bookending it, the subtitle wears crop-mark + dot
 * corners, and a periwinkle registration square-pair straddles the form's
 * top-right corner.
 */

const DASH_H = `repeating-linear-gradient(to right, rgba(23,23,23,0.16) 0px, rgba(23,23,23,0.16) 10px, transparent 10px, transparent 18px)`;
const PURPLE = "#8581ff";

/** Full-bleed dashed hairline pinned to the top or bottom of its relative
 *  parent — runs off-centre to both viewport edges (clipped by the body). */
function Rule({ edge }: { edge: "top" | "bottom" }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute hidden h-px w-screen sm:block"
      style={{ left: "calc(50% - 50vw)", [edge]: 0, backgroundImage: DASH_H } as CSSProperties}
    />
  );
}

/** Crop-mark + nested-dot corners hugging the subtitle — matched exactly to the
 *  "SIGHTS to SEE" caption frame (Work.tsx): 8px light-grey L-brackets at 26px
 *  horizontal / 18px vertical offsets, with a 3px dark registration dot nested
 *  4px into each crook. */
function SubtitleCorners() {
  const B = "pointer-events-none absolute h-2 w-2 border-[#cfcfcf]";
  const D = "pointer-events-none absolute size-[3px] rounded-full bg-[#171717]";
  return (
    <>
      <span aria-hidden className={`${B} -left-[26px] -top-[18px] border-l border-t`} />
      <span aria-hidden className={`${B} -right-[26px] -top-[18px] border-r border-t`} />
      <span aria-hidden className={`${B} -bottom-[18px] -left-[26px] border-b border-l`} />
      <span aria-hidden className={`${B} -bottom-[18px] -right-[26px] border-b border-r`} />
      <span aria-hidden className={`${D} -left-[26px] -top-[18px] translate-x-[4px] translate-y-[4px]`} />
      <span aria-hidden className={`${D} -right-[26px] -top-[18px] -translate-x-[4px] translate-y-[4px]`} />
      <span aria-hidden className={`${D} -bottom-[18px] -left-[26px] translate-x-[4px] -translate-y-[4px]`} />
      <span aria-hidden className={`${D} -bottom-[18px] -right-[26px] -translate-x-[4px] -translate-y-[4px]`} />
    </>
  );
}

export default function Contact() {
  const fieldWell =
    "w-full bg-btn-dark px-4 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-accent";

  return (
    <section id="contact" aria-label="Contact" className="relative overflow-x-clip py-24 sm:py-32">
      <div className="page-container">
      <header className="mb-14">
        {/* Heading band — full-bleed dashed rules top & bottom, periwinkle
            hatch cells bookending the heading. */}
        <div className="relative flex w-full items-center gap-[clamp(1.25rem,4vw,2.75rem)]">
          <Rule edge="top" />
          <Rule edge="bottom" />
          <HatchCell className="relative hidden h-[58px] w-[46px] shrink-0 sm:block" delay={0} />
          <h2 className="type-heading text-ink shrink-0">Come have a seat!</h2>
          <HatchCell className="relative hidden h-[58px] w-[46px] shrink-0 sm:block" delay={120} />
        </div>

        {/* Subtitle — same sizing as the "SIGHTS to SEE" caption (type-caption
            at 0.9375rem, leading-none, ink-muted with an ink-alt keyword) and
            the matching crop-mark frame. Indented so its LEFT crop mark lines up
            with the "C" of "Come" above: the heading text starts after the left
            hatch cell (w-[46px]) + the band's flex gap, and the crop mark now
            sits 26px left of the subtitle box (-left-[26px]), so the margin is
            (46 + 26)px + that same gap. Below sm the hatch cells are hidden and
            the heading starts at the header edge, so the mark aligns with
            ml-[26px] (matching the bracket's own -26px offset). */}
        <div className="relative mt-12 ml-[26px] inline-block sm:ml-[calc(72px+clamp(1.25rem,4vw,2.75rem))]">
          <SubtitleCorners />
          <p className="type-caption text-ink-muted leading-none" style={{ fontSize: "0.9375rem" }}>
            Let&rsquo;s have a <span className="text-ink-alt">chat.</span>
          </p>
        </div>
      </header>

      {/* Shifted right so the form's own left edge (and the periwinkle
          corner-marks hanging off it) line up with the subtitle's left crop
          mark above — same offset formula as the subtitle's own margin
          (72px band-gap minus its -26px bracket offset = 46px + gap), so the
          two track together at every width instead of a magic number. */}
      <div className="grid items-end gap-14 lg:ml-[calc(46px+clamp(1.25rem,4vw,2.75rem))] lg:grid-cols-[minmax(0,370px)_1fr]">
        {/* Form — kept compact (p-6, 40px fields, 3-row message, gap-4) so the
            dark box sits trimly beside the campfire/chair rather than looming
            over them. */}
        <form
          className="relative bg-btn-dark/95 p-6"
          /* TODO: wire onSubmit to backend / form service */
        >
          {/* Periwinkle registration square-pairs (outline + filled, meeting
              corner-to-corner) sitting fully OUTSIDE the form — they kiss the
              card at a single corner/edge point rather than overlapping its
              dark face. 18px each. Desktop only.
              (1) top-left corner: a diagonal chain up-left — outline nearest the
              corner (bottom-right on the card corner), filled beyond it.
              (2) right edge beside the Email field: filled resting flush on the
              edge (outside), outline continuing up-right. */}
          <span aria-hidden className="pointer-events-none absolute left-0 top-0 hidden lg:block">
            <span className="absolute -left-[20px] -top-[20px] size-[10px] accent-flicker-a" style={{ background: PURPLE, ["--enter" as string]: "0.9s" } as CSSProperties} />
            <span className="absolute -left-[10px] -top-[10px] size-[10px] accent-flicker-b" style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.1s" } as CSSProperties} />
          </span>
          <span aria-hidden className="pointer-events-none absolute left-full top-[140px] hidden lg:block">
            <span className="absolute left-0 top-0 size-[10px] accent-flicker-b" style={{ background: PURPLE, ["--enter" as string]: "1.3s" } as CSSProperties} />
            <span className="absolute left-[10px] -top-[10px] size-[10px] accent-flicker-a" style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.5s" } as CSSProperties} />
          </span>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">Name</span>
              <input type="text" className={`${fieldWell} h-10`} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">Email</span>
              <input type="email" className={`${fieldWell} h-10`} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">What it&rsquo;s About</span>
              <input type="text" className={`${fieldWell} h-10`} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">Message</span>
              <textarea rows={3} className={`${fieldWell} resize-none py-3`} />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-accent px-5 py-2.5 text-accent-ink"
            >
              <span aria-hidden>←</span>
              <span className="type-caption font-medium">Book a Slot</span>
            </button>
            <a
              href="#"
              className="inline-flex items-center bg-white/10 px-5 py-2.5 text-white"
            >
              <span className="type-caption font-medium">Go To LinkedIn</span>
            </a>
          </div>
        </form>

        {/* Illustrations — a flower vase + chair resting on a horizon line,
            the way the section reads: "come have a seat." The column aligns to
            the bottom of the grid row (items-end on the parent) so the horizon
            line sits level with the base of the form box, the pieces standing
            on the same ground line. The vase's bouquet breathes and its blooms
            pulse gently (Vase.tsx + globals.css → VASE). */}
        <div className="relative w-full">
          <div className="flex items-end justify-center gap-6 sm:gap-10">
            {/* Commented out for now.
            <Vase className="h-auto w-[clamp(140px,18vw,210px)] shrink-0" />
            */}
            {/* Campfire: the looping Lottie flames (made in AE) burning behind
                a smaller wood-log pile on a grey stone hearth (the user's own
                illustration, texture stripped to clean flat shapes). The logs
                sit in front of the flames so the fire reads as coming from
                within the pile rather than floating over it. */}
            <div className="relative h-[clamp(95px,12vw,145px)] w-[clamp(130px,17vw,200px)] shrink-0">
              <Fire className="absolute bottom-[6%] left-1/2 z-0 h-auto w-[72%] -translate-x-1/2" />
              <Fireplace className="absolute bottom-0 left-1/2 z-10 h-auto w-[58%] -translate-x-1/2" />
              {/* Smoke, on top of everything and free to drift out past the
                  container's top edge (nothing here clips). */}
              <Fumes className="pointer-events-none absolute inset-0 z-20" />
              {/* Code glyphs rising with the smoke — the "engineer" wink. */}
              <CodeMotes className="pointer-events-none absolute inset-0 z-30" />
            </div>
            <Chair
              color="#3FA35C"
              className="h-auto w-[clamp(240px,30vw,380px)] shrink-0"
            />
          </div>
          {/* The ground the pieces stand on — snug with the form's bottom. The
              left end stays at the illustration column; the right end runs full
              bleed to the viewport edge. That extension = the container's right
              padding + its centring margin (0 until the viewport passes the
              1280px frame), so the right edge lands exactly on the viewport. */}
          <div
            aria-hidden
            className="h-px bg-ink/15"
            style={{
              width:
                "calc(100% + clamp(1.25rem, 5vw, 4rem) + max(0px, (100vw - var(--container-page)) / 2))",
            }}
          />
        </div>
      </div>
      </div>
    </section>
  );
}
