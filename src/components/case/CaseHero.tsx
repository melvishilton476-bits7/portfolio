import type { CSSProperties } from "react";
import Image from "next/image";
import GrowOnView from "../GrowOnView";
import Placeholder from "../Placeholder";
import { TiltCard, TiltParallax } from "../ui/tilt-card";
import CropMarks from "./CropMarks";

/** Depth of the lockup layer, in px, inside TiltCard's 1600px perspective.
 *  `translateZ` alone would also magnify the layer by P/(P−Z) — 3.9% here — so
 *  it's paired with the exact inverse scale (1 − Z/P). Net effect at rest:
 *  nothing moves. Under tilt: the lockup swings wider than the plate behind it,
 *  which is the whole point.
 *
 *  This is the DEFAULT path and it is the good one: the layer is a real child
 *  of the card's 3D context, so the compositor projects it as part of the
 *  card's own transform. It cannot drift out of sync, because it is not a
 *  second animation — it is the same one. Titan's wordmark uses it. */
const LOCKUP_Z = 120;
const LOCKUP_PERSPECTIVE = 1600;
const LOCKUP_TRANSFORM = `translateZ(${LOCKUP_Z}px) scale(${1 - LOCKUP_Z / LOCKUP_PERSPECTIVE})`;

/** The edge-to-edge path, and it exists under protest.
 *
 *  A layer that fills the frame has to be CLIPPED to it — its bleed would
 *  otherwise hang off the card onto the page — and a clip is fatal to 3D:
 *  `overflow`, `clip-path` and `mask-*` all force `transform-style: flat` on
 *  the subtree they apply to, which would take the layer out of the card's
 *  perspective and kill the parallax outright. So this layer stays flat and
 *  slides by the distance a layer at LOCKUP_Z *would* slide, which is what
 *  `TiltParallax` does — see the note there for why the offset is computed in
 *  JS rather than left to the stylesheet. */
const TILT_LIMIT_DEG = 4;

/** A lockup is held at `width / artboard` of the plate, so it keeps the exact
 *  proportion it was drawn at instead of a size picked by eye — Titan's is a
 *  wordmark cut out of a larger artboard, 684 against 1686. Edge-to-edge
 *  layers bypass this and simply take the full width. */
const lockupWidth = (width: number, artboard: number) =>
  `${((width / artboard) * 100).toFixed(2)}%`;

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
  image,
  lockup,
  fade = true,
}: {
  eyebrow: string;
  title: string;
  dek: string;
  frameLabel: string;
  /** The hero plate. `ratio` defaults to 16:9, and `objectPosition` anchors
   *  the crop when the artwork's own ratio differs from it. Omit `src` and the
   *  plate keeps a <Placeholder> at the same ratio, so a hero can reserve its
   *  shape before the export lands — the same convention <Figure> follows. */
  image?: { src?: string; ratio?: number; objectPosition?: string };
  /** Optional second layer, floated toward the viewer so it swings wider than
   *  the plate under tilt. Omit on a hero whose plate already carries its own
   *  lockup — a second one would just repeat the title.
   *
   *  `artboard` is the width of the canvas the layer was exported against; it
   *  is what sizes the layer against the plate. A full-frame layer passes its
   *  own width and lands at 100%.
   *
   *  `edgeToEdge` is for exactly that full-frame case, and it changes how the
   *  layer registers: by WIDTH and TOP rather than by centring. Any height the
   *  file carries beyond the plate's own ratio is therefore BLEED — hidden
   *  below the frame at rest, slid into view as the parallax lifts the layer,
   *  so a swing never opens a gap along the bottom edge. Zenxo's monitor
   *  export carries 80px of it. Titan's lockup is a wordmark at 40% width with
   *  three hundred pixels of margin on every side, so it neither needs this
   *  nor wants it. */
  lockup?: {
    src: string;
    width: number;
    height: number;
    artboard: number;
    edgeToEdge?: boolean;
  };
  /** The white bottom gradient. It dissolves a dark, full-bleed photograph
   *  into the page, which is what Titan's hero needs. Turn it OFF for flat
   *  artwork on a light ground: there is no edge to dissolve, and the ramp
   *  just bleaches the bottom two thirds of the art. */
  fade?: boolean;
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
              scale={1.01}
              tiltLimit={TILT_LIMIT_DEG}
              perspective={LOCKUP_PERSPECTIVE}
              glare={0.06}
              className="overflow-visible"
            >
              {/* The plate. On Titan the native art is 1.415:1 against a 16:9
                  box, so cover crops ~20% — anchored to the top so the crop
                  always comes off the bottom (dark coat, which the fade eats
                  anyway) and never off the helmet. A hero whose art is already
                  the right shape passes its own ratio and crops nothing. */}
              {image?.src ? (
                <div
                  className="relative w-full overflow-hidden rounded-[3px]"
                  style={{ aspectRatio: String(image.ratio ?? 16 / 9) }}
                >
                  <Image
                    src={image.src}
                    alt={frameLabel}
                    fill
                    priority
                    sizes="(max-width: 1100px) 100vw, 1100px"
                    className="object-cover"
                    style={{ objectPosition: image.objectPosition ?? "top" }}
                  />
                </div>
              ) : (
                <Placeholder
                  label={frameLabel}
                  ratio={image?.ratio ?? 16 / 9}
                  className="rounded-[3px]"
                />
              )}

              {/* Two different layers with two different problems.

                  A wordmark is small, centred, and surrounded by its own
                  transparent margin, so nothing has to hold it in: it floats
                  in the card's 3D context and the compositor does the rest.

                  A full-frame layer fills the plate, so a swing would drag its
                  edge off the card and onto the page. It has to be clipped,
                  and clipping is what rules 3D out for it — hence the flat
                  slide. Wrapper clips, child moves: one element cannot do
                  both, since the clip would flatten its own transform. */}
              {lockup ? (
                lockup.edgeToEdge ? (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-[3px]"
                  >
                    <TiltParallax depth={LOCKUP_Z} className="absolute inset-0">
                      <Image
                        src={lockup.src}
                        alt=""
                        width={lockup.width}
                        height={lockup.height}
                        priority
                        // Width only, so the layer keeps its own ratio and
                        // never stretches; the bleed hangs past the bottom of
                        // the clip.
                        style={{ width: "100%", height: "auto" }}
                      />
                    </TiltParallax>
                  </div>
                ) : (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 grid place-items-center"
                    style={{ transform: LOCKUP_TRANSFORM }}
                  >
                    <Image
                      src={lockup.src}
                      alt=""
                      width={lockup.width}
                      height={lockup.height}
                      priority
                      // The fraction of its own artboard the layer was drawn
                      // at, so it keeps that proportion rather than a size
                      // picked by eye.
                      style={{
                        width: lockupWidth(lockup.width, lockup.artboard),
                        height: "auto",
                      }}
                    />
                  </div>
                )
              ) : null}
              {/* Top two corners only when the fade is on — the lower pair
                  would sit inside it and only half-appear. Without the fade
                  there is nothing to hide them, so the frame closes properly.
                  Keeps the hero's original 26 × 18 offsets rather than the
                  figures' tighter 8 × 8: at 1100px wide the marks need the
                  extra room to read. */}
              <CropMarks
                offsetX={26}
                offsetY={18}
                corners={fade ? ["tl", "tr"] : undefined}
              />
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
        {fade ? (
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 h-[calc(65%+1rem)] w-screen"
            style={{ left: "calc(50% - 50vw)", background: `linear-gradient(to top, ${FADE_STOPS})` }}
          />
        ) : null}
      </div>
    </header>
  );
}
