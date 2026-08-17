import type { CSSProperties } from "react";
import Image from "next/image";
import GrowOnView from "../GrowOnView";
import { TiltCard } from "../ui/tilt-card";
import CropMarks from "./CropMarks";

/** Depth of the lockup layer, in px, inside TiltCard's 1600px perspective.
 *  `translateZ` alone would also magnify the layer by P/(P−Z) — 3.9% here — so
 *  it's paired with the exact inverse scale (1 − Z/P). Net effect at rest:
 *  nothing moves. Under tilt: the lockup swings wider than the plate behind it,
 *  which is the whole point. */
const LOCKUP_Z = 120;
const LOCKUP_PERSPECTIVE = 1600;
const LOCKUP_TRANSFORM = `translateZ(${LOCKUP_Z}px) scale(${1 - LOCKUP_Z / LOCKUP_PERSPECTIVE})`;

/** The lockup was exported from the same artboard as the plate — 684px against
 *  1686px — so holding it at that fraction keeps the proportion the artwork was
 *  drawn at instead of a size picked by eye. The 16:9 crop is vertical only, so
 *  the width relationship survives it. */
const LOCKUP_WIDTH = `${((684 / 1686) * 100).toFixed(2)}%`;

const PURPLE = "#8581ff";

/** Eased opacity stops (white → transparent) — a plain two-stop linear ramp
 *  over a dark fill reads to the eye as an abrupt wall of white partway
 *  through, since perceived brightness isn't linear in opacity. */
const FADE_STOPS =
  "#fff 0%, #fff 14%, rgba(255,255,255,.738) 32%, rgba(255,255,255,.541) 44%, rgba(255,255,255,.382) 55%, rgba(255,255,255,.278) 63%, rgba(255,255,255,.194) 70%, rgba(255,255,255,.126) 77%, rgba(255,255,255,.075) 83%, rgba(255,255,255,.042) 89%, rgba(255,255,255,.021) 95%, rgba(255,255,255,0) 100%";

/**
 * Case-study opener: eyebrow → title → one-line dek → the strongest frame the
 * project owns, full bleed.
 *
 * The hero is the one place the framework allows an image BEFORE the copy that
 * explains it, on the grounds that it's the best frame you have and it earns
 * its place on looks alone. Everything after this point is copy-first.
 *
 * Type ladder matches the home page exactly: the project name takes
 * `type-display` (the token reserved for the site's h1), the dek takes the lead
 * size, and the eyebrow takes the caption size — so a case study reads as the
 * same site rather than a microsite. Periwinkle registration marks flank the
 * title the way they flank the hero headline.
 */
export default function CaseHero({
  eyebrow,
  title,
  dek,
  frameLabel,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  frameLabel: string;
}) {
  return (
    <header className="pt-32 sm:pt-40">
      <div className="page-container">
        <div className="relative mx-auto max-w-[820px] text-center">
          {/* Registration squares flanking the title — the hero's own marks. */}
          <span
            aria-hidden
            className="accent-flicker-a absolute -left-[10px] top-[54px] hidden size-[10px] lg:block"
            style={{ background: PURPLE, ["--enter" as string]: "0.5s" } as CSSProperties}
          />
          <span
            aria-hidden
            className="accent-flicker-b absolute -right-[10px] top-[54px] hidden size-[10px] lg:block"
            style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "0.7s" } as CSSProperties}
          />

          <p className="type-caption text-ink-muted uppercase tracking-[0.14em]">{eyebrow}</p>
          <h1 className="type-display text-ink-hero mt-5">{title}</h1>
          <p
            className="type-lead mx-auto mt-6 max-w-[520px] text-balance"
            style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
          >
            {dek}
          </p>
        </div>
      </div>

      <div className="relative mt-14 sm:mt-20">
        <div className="page-container">
          {/* GrowOnView owns the entrance transform, TiltCard owns the hover
              transform — nested rather than merged so the two never write to
              the same element's `transform`. `overflow-visible` overrides the
              TiltCard default (via tailwind-merge) so the crop marks, which
              sit outside the frame, aren't clipped; the spotlight has its own
              clipping wrapper and stays inside the image either way. */}
          <GrowOnView className="case-figure relative mx-auto block w-full max-w-[1100px]">
            <TiltCard
              effect="evade"
              tiltLimit={4}
              scale={1.01}
              perspective={LOCKUP_PERSPECTIVE}
              glare={0.06}
              className="overflow-visible"
            >
              {/* The plate. Native art is 1.415:1 against this 16:9 box, so
                  cover crops ~20% — anchored to the top so the crop always
                  comes off the bottom (dark coat, which the fade eats anyway)
                  and never off the helmet. */}
              <div
                className="relative w-full overflow-hidden rounded-[3px]"
                style={{ aspectRatio: "16 / 9" }}
              >
                <Image
                  src="/case/titan/hero-bg.webp"
                  alt={frameLabel}
                  fill
                  priority
                  sizes="(max-width: 1100px) 100vw, 1100px"
                  className="object-cover object-top"
                />
              </div>

              {/* The lockup, floated toward the viewer. Centred on the plate,
                  so it lands over the ember lens. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grid place-items-center"
                style={{ transform: LOCKUP_TRANSFORM }}
              >
                <Image
                  src="/case/titan/hero-lockup.png"
                  alt=""
                  width={684}
                  height={280}
                  priority
                  style={{ width: LOCKUP_WIDTH, height: "auto" }}
                />
              </div>
              {/* Top two corners only — the lower pair sits inside the fade,
                  where a mark would only half-appear. Keeps the hero's original
                  26 × 18 offsets rather than the figures' tighter 8 × 8: at
                  1100px wide the marks need the extra room to read. */}
              <CropMarks offsetX={26} offsetY={18} corners={["tl", "tr"]} />
            </TiltCard>
          </GrowOnView>
        </div>
        {/* Glass edge, borrowed from the Work carousel: dissolves the frame's
            bottom edge into the page rather than cutting it off with a hard
            line. Detached from the (contained) image box and pinned to this
            wrapper instead, using the site's standard viewport-edge trick
            (see DashRule) — so the fade itself reaches the true viewport
            edges regardless of how narrow the frame above it is. */}
        {/* Runs 16px PAST the wrapper's bottom edge: the tilt scales and
            rotates the frame a few px beyond its own layout box, and without
            the overhang the frame's dashed bottom border pokes out below the
            fade as a hard line on hover. The gradient's last stop is opaque
            #fff on a #fff page, so the overhang itself is invisible. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-4 h-[calc(65%+1rem)] w-screen"
          style={{ left: "calc(50% - 50vw)", background: `linear-gradient(to top, ${FADE_STOPS})` }}
        />
      </div>
    </header>
  );
}
