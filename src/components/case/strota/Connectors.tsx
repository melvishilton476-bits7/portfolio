"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { elbowPath } from "./geometry";

/**
 * A diagram's connectors, drawing themselves in the first time the diagram
 * enters the viewport: each line strokes out from its outer end toward the
 * hub, staggered, and its two ring nodes pop in as the line reaches them.
 * Under reduced motion the transitions are off (globals.css → .strota-draw),
 * so they appear whole.
 */

export type Link = { from: [number, number]; to: [number, number]; midX?: number };

const RING = 3;
const DRAW_MS = 700;
const STAGGER_MS = 110;

export default function Connectors({ w, h, links }: { w: number; h: number; links: Link[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const [drawn, setDrawn] = useState(false);

  // Each line's own length, in its own units, so the dash that hides it is
  // exactly as long as the line (pathLength-normalised dashes break on some
  // engines with these short elbowed paths).
  useLayoutEffect(() => {
    paths.current.forEach((p) => {
      if (!p) return;
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len} ${len}`;
      p.style.setProperty("--len", String(len));
    });
  }, [links]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setDrawn(true);
        io.disconnect();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} aria-hidden viewBox={`0 0 ${w} ${h}`} className="strota-draw pointer-events-none absolute inset-0 h-full w-full">
      {links.map(({ from: [x1, y1], to: [x2, y2], midX }, i) => {
        const delay = i * STAGGER_MS;
        const node = (cx: number, cy: number, at: number) => (
          <circle
            cx={cx}
            cy={cy}
            r={RING}
            fill="#fff"
            stroke="#171717"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: drawn ? "scale(1)" : "scale(0)",
              transition: `transform 260ms cubic-bezier(0.34,1.56,0.64,1) ${at}ms`,
            }}
          />
        );
        return (
          <g key={i}>
            <path
              ref={(el) => {
                paths.current[i] = el;
              }}
              d={elbowPath(x1, y1, x2, y2, midX)}
              fill="none"
              stroke="#8a8a8a"
              // No non-scaling-stroke: it measures dashes in screen space,
              // which would no longer match the measured length. The stroke
              // scales with the diagram, near 1:1 wherever it is shown.
              strokeWidth={1}
              style={{
                strokeDashoffset: drawn ? 0 : "var(--len, 2000)",
                transition: `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.65,0,0.35,1) ${delay}ms`,
              }}
            />
            {node(x1, y1, delay)}
            {node(x2, y2, delay + DRAW_MS - 120)}
          </g>
        );
      })}
    </svg>
  );
}
