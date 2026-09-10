"use client";

import { useRef, useState, useCallback, createContext, useContext } from "react";
import { cn } from "@/lib/utils";

export interface TiltCardProps {
  /** Maximum tilt angle in degrees */
  tiltLimit?: number;
  /** Scale factor on hover */
  scale?: number;
  /** Perspective distance in pixels */
  perspective?: number;
  /** Tilt direction: "gravitate" leans toward the cursor, "evade" tilts away */
  effect?: "gravitate" | "evade";
  /** Show a spotlight that follows the cursor on hover */
  spotlight?: boolean;
  /** Peak spotlight alpha. The upstream component hard-codes 0.15, which blows
   *  out over a large dark image — kept as a prop so each surface can dial the
   *  glare to its own contrast. */
  glare?: number;
  /** Additional class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Card content */
  children?: React.ReactNode;
}

/**
 * Pointer-driven 3D tilt with an optional cursor-tracking spotlight.
 *
 * Three adaptations from the stock component, all to fit this codebase:
 *   - `glare` is a prop rather than a hard-coded 0.15.
 *   - the tilt is skipped under `prefers-reduced-motion`, matching the
 *     treatment every other animated primitive here gets.
 *   - the current tilt is offered to descendants through `TiltContext`, for
 *     the rare child that must parallax AND stay inside a clip — see
 *     `TiltParallax` below. Floating a layer on `translateZ` is the better
 *     answer and the one to reach for first, since the compositor projects it
 *     as part of this card's own transform and it cannot drift.
 *
 * The root keeps `overflow-hidden` by default (the spotlight clips to the
 * card), but `cn` runs through tailwind-merge — so passing `overflow-visible`
 * from a caller wins, which is what the case-study hero needs for the crop
 * marks that sit outside the frame. The spotlight has its own `overflow-hidden`
 * wrapper, so it stays clipped either way.
 */
export function TiltCard({
  tiltLimit = 15,
  scale = 1.05,
  perspective = 1200,
  effect = "evade",
  spotlight = true,
  glare = 0.08,
  className,
  style,
  children,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, s: 1 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const dir = effect === "evade" ? -1 : 1;

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const el = cardRef.current;
      if (!el) return;
      // Checked per-move rather than cached: the OS setting can change while
      // the page is open, and this is a trivial read.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const xRot = (py - 0.5) * (tiltLimit * 2) * dir;
      const yRot = (px - 0.5) * -(tiltLimit * 2) * dir;
      setTilt({ x: xRot, y: yRot, s: scale });
      if (spotlight) {
        setSpotlightPos({ x: px * 100, y: py * 100 });
      }
    },
    [tiltLimit, scale, dir, spotlight],
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, s: 1 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("will-change-transform relative overflow-hidden", className)}
      style={
        {
          transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${tilt.s}, ${tilt.s}, ${tilt.s})`,
          transition: "transform 0.2s ease-out",
          transformStyle: "preserve-3d",
          ...style,
        } as React.CSSProperties
      }
    >
      <TiltContext.Provider value={tilt}>{children}</TiltContext.Provider>
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.3s" }}
        >
          <div
            className="absolute h-[200%] w-[200%] rounded-full"
            style={{
              left: `${spotlightPos.x}%`,
              top: `${spotlightPos.y}%`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, rgba(255,255,255,${glare}) 0%, transparent 40%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

/** The card's current tilt in degrees, for descendants that need to move with
 *  it without being lifted into its 3D context. */
const TiltContext = createContext({ x: 0, y: 0 });

const tan = (deg: number) => Math.tan((deg * Math.PI) / 180);

/**
 * A FLAT layer that parallaxes with the card, for the one case `translateZ`
 * cannot serve: a layer that must also be clipped. `overflow`, `clip-path` and
 * `mask-*` all force `transform-style: flat` on the subtree they apply to, so
 * a clipped layer is out of the card's perspective and gets no parallax from
 * it. This slides by the distance a layer at `depth` would slide instead —
 * depth·tan(θ) per axis, the same small-angle geometry the projection does.
 *
 * The offset is resolved to real pixels HERE rather than published as a custom
 * property for the stylesheet to do the trig on. That earlier arrangement is
 * what made this judder: easing `--tilt-x`/`--tilt-y` on the card meant a
 * REGISTERED custom property interpolating on the main thread, and every one
 * of those frames re-resolved this layer's transform, so it crawled behind a
 * card the compositor was animating for free. Not easing them instead makes
 * the layer snap ahead of the card, which is no better.
 *
 * A concrete px value sidesteps the choice: card and layer both run an
 * ordinary `transform` transition, and both are compositor work. Verified —
 * they are two CSSTransitions on `transform`, created on the same frame at
 * currentTime 0, on the same curve, so they cannot drift apart.
 */
export function TiltParallax({
  depth,
  className,
  children,
}: {
  /** The depth in px the layer should READ as, against the card's perspective. */
  depth: number;
  className?: string;
  children: React.ReactNode;
}) {
  const tilt = useContext(TiltContext);
  return (
    <div
      className={className}
      style={{
        /* rotateY carries a near layer toward +x, rotateX toward −y — hence
           the one negative. */
        transform: `translate(${(depth * tan(tilt.y)).toFixed(3)}px, ${(-depth * tan(tilt.x)).toFixed(3)}px)`,
        transition: "transform 0.2s ease-out",
      }}
    >
      {children}
    </div>
  );
}
