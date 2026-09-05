import type { CSSProperties } from "react";
import DashRule from "@/components/DashRule";
import HatchCell from "@/components/HatchCell";
import GrowOnView from "@/components/GrowOnView";
import Polaroid from "./Polaroid";

/**
 * The top of the About page: the title band, then the bio, the portrait and the
 * list of things I like, side by side.
 *
 * The band is the site's existing section-opener vocabulary, unchanged — two
 * full-bleed dashed rules with periwinkle hatch cells bookending the heading,
 * exactly as "Come have a seat!" opens Contact. Reusing it rather than
 * inventing an About-specific header is the point: a new page should arrive
 * looking like the same site.
 *
 * Below the band it is two columns: the print on the left, everything the page
 * has to say on the right. The source ran the prose either side of the
 * photograph, which reads beautifully as annotation and leaves a hole — the bio
 * is four lines against a print four hundred deep, so a third of the row was
 * white with nothing in it. One column of text down the right fills that height
 * with the words it already had.
 *
 * The print keeps the whole left track to itself because the composition is
 * WIDER than the card: the two face crops hang outside it either side, and
 * giving the stage its own column is what lets them do that without being
 * pushed off the page or into the prose. Below `lg` it collapses to one column,
 * portrait first — a face is a better thing to land on than six lines of prose.
 */

const PURPLE = "#8581ff";
const AMBER = "#ffae00";

/* The two tracks, against the source's own 1137-wide page.
   The left one is the PRINT'S STAGE, not the card: 524 source px carrying the
   card's 279.7 plus the crops that overhang it, printed a fifth larger than the
   source drew it — 524 x 1.2 = 629. The right one takes what is left after a
   gutter, which lands the prose on a ~400px measure: long enough not to break
   the bio across six ragged lines, short enough to still read as a column.
   `fr`, so the proportion holds from 1024 up rather than drifting as the
   container grows. Written out literally in the class below rather than built
   from a constant — Tailwind reads source text, and a name assembled at runtime
   never reaches the stylesheet. */

/** The loose periwinkle squares that drift around the site's section openers.
 *  Two clusters straddling the band diagonally — one above the top rule on the
 *  left, one below the bottom rule on the right — mirroring the pairs that
 *  bracket the Contact form. Desktop only: at phone width they crowd the
 *  heading instead of framing it.
 *
 *  Offsets are the source's, measured from the top rule (`top`) or the bottom
 *  rule (`bottom`), so a cluster keeps its relationship to the line it hangs
 *  off however the band's height resolves. */
function BandAccents() {
  const sq = (style: CSSProperties, cls = "") => (
    <span aria-hidden className={`absolute ${cls}`} style={style} />
  );
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Upper cluster: a stepped pair sitting on the top rule. */}
      {sq({ left: 202, top: -22, width: 8, height: 7, background: PURPLE }, "accent-flicker-a")}
      {sq({ left: 210, top: -15, width: 7, height: 7, background: PURPLE }, "accent-flicker-b")}
      {sq({ left: 202, top: -8, width: 8, height: 7, background: PURPLE }, "accent-flicker-a")}
      {/* The amber bar in its periwinkle outline — the site's one warm accent,
          used here the way the hero uses it: once, small, off to the side. */}
      {sq({ left: 10, top: -20, width: 37, height: 28, border: `1px solid ${PURPLE}` }, "accent-flicker-b")}
      {sq({ left: 16, top: -13, width: 26, height: 14, background: AMBER }, "accent-flicker-a")}
      {/* Lower cluster, on the bottom rule and stepping down past it. */}
      {sq({ left: 807, bottom: -10, width: 10, height: 8, background: PURPLE }, "accent-flicker-b")}
      {sq({ left: 817, bottom: -18, width: 8, height: 8, background: PURPLE }, "accent-flicker-a")}
      {sq({ left: 807, bottom: -26, width: 10, height: 9, background: PURPLE }, "accent-flicker-b")}
    </span>
  );
}

export default function AboutIntro() {
  // Top clearance is only needed from md up: the nav is fixed to the top there
  // and to the BOTTOM below it, where this padding would just be an empty
  // screenful above the title.
  return (
    <section aria-labelledby="about-title" className="relative pt-12 md:pt-28">
      {/* ---- Title band ------------------------------------------------------
          One line now, not two, and the emphasis is carried in CAPS as well as
          weight: at 38px across a full container the old two-line setting left
          a hole under the second line that nothing filled. */}
      <div className="page-container relative">
        <BandAccents />
        <div className="relative flex items-center justify-center py-4">
          <DashRule edge="top" />
          <DashRule edge="bottom" />
          {/* The cells sit hard against the title rather than out at the page
              edge, because the title is centred here — parked in the gutters
              they would read as two unrelated marks at the far sides of the
              screen instead of as brackets on the heading. Hidden below lg,
              where the heading wraps and there is no room beside it. */}
          <HatchCell className="absolute inset-y-0 hidden w-[48px] lg:block" style={{ right: "calc(50% + 426px)" }} delay={0} />
          <h1
            id="about-title"
            className="type-heading text-ink-hero text-center"
            style={{ fontSize: "clamp(1.5rem, 0.6rem + 2.9vw, 2.375rem)", letterSpacing: "-0.08em" }}
          >
            <span className="font-light">An </span>
            <span className="font-medium">OBSESSIVE</span>
            <span className="font-light"> Designer &amp; Professional </span>
            <span className="font-medium">FUN HAVER</span>
          </h1>
          <HatchCell className="absolute inset-y-0 hidden w-[48px] lg:block" style={{ left: "calc(50% + 426px)" }} delay={120} />
        </div>
      </div>

      {/* ---- Print · everything else ----------------------------------------
          The gutter is a track rather than a `gap` so the two halves keep the
          exact proportion above whatever the container does. */}
      <div className="page-container mt-10 lg:mt-16">
        <GrowOnView className="grid gap-y-12 lg:grid-cols-[629fr_70fr_438fr] lg:gap-y-0">
          {/* The print leads on mobile and takes the left track on desktop. No
              overhang trickery any more: the track IS the stage, so the crops
              hang inside their own column and the left one lands flush with the
              content edge the rest of the page starts from. */}
          <div className="order-1 mx-auto w-full max-w-[420px] lg:order-none lg:col-start-1 lg:max-w-none lg:self-start">
            <Polaroid />
          </div>

          {/* One column, centred against the print's height, spaced by the same
              rhythm throughout — bio, then the list, then the line that asks
              for a reply. Centred rather than spread edge to edge: `between`
              would open holes as large as the ones this layout was meant to
              close the moment the print grew taller than the words. */}
          <div className="order-2 flex flex-col justify-center gap-9 lg:order-none lg:col-start-3">
            <p className="type-note text-ink-alt leading-relaxed">
              I like working <strong className="font-medium">with people</strong>, on{" "}
              <strong className="font-medium">products for people</strong> — and pushing the limits
              on how <strong className="font-medium">platforms and tech</strong> interact with them.
            </p>

            <div className="type-note text-ink-alt leading-relaxed">
              <p>Outside of design and research, I like :</p>
              <ul className="mt-2 space-y-2 pl-5">
                {[
                  "Reading up on random biology",
                  "Dribbling past 3 people on the football pitch, on average",
                  "Performing gluttony at obscure restaurants",
                  "Watching 1 movie a week and calling myself a Cinephile",
                ].map((item) => (
                  <li key={item} className="list-disc marker:text-ink-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Last in the column rather than centred under the whole row: it
                is the end of what the page is saying, and it belongs to the
                voice saying it. */}
            {/* TODO: LinkedIn and X await real URLs. Rendered as plain text
                until then rather than pointing somewhere wrong. */}
            <p className="type-caption text-ink-alt">
              To befriend me or hire me, reach out on{" "}
              <span className="font-medium underline decoration-from-font underline-offset-2">LinkedIn</span>,{" "}
              <span className="font-medium underline decoration-from-font underline-offset-2">X</span>, or by{" "}
              <a
                href="mailto:melvishilton476@gmail.com"
                className="hover:text-ink font-medium underline decoration-from-font underline-offset-2 transition-colors"
              >
                email
              </a>
              —can&rsquo;t wait to meet you!
            </p>
          </div>
        </GrowOnView>
      </div>
    </section>
  );
}
