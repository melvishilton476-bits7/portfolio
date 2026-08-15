"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/**
 * The little black cat peeking up from the footer's bottom edge (Figma node
 * 508:1996 "Isolation_Mode") — a rounded dark head with two pointed ears and
 * two round cream eyes. Ported 1:1 from the exported SVG, with two additions:
 *
 *   • the eye interiors are filled cream (the source drew them as rings), so a
 *     dark **pupil** can ride on top of each;
 *   • those pupils TRACK the cursor — but only once the pointer has dropped
 *     below the footer's periwinkle band (the `[data-footer-band]` element).
 *     Above the band the eyes rest dead-centre; cross it and they follow.
 *
 * Motion is eased in a rAF loop and applied via the SVG `transform` attribute
 * (user units), so it composes cleanly with the boil filter and respects
 * `prefers-reduced-motion` (which also drops the boil via `.cat-boil`).
 *
 * Purely decorative — the caller marks the wrapper `aria-hidden` and owns
 * sizing/placement via `className` / `style`. viewBox is 56×33, so
 * height ≈ width × 0.589.
 */

// Eye centres + how far a pupil may drift, all in the 56×33 viewBox's units.
const EYES = {
  left: { cx: 17.2, cy: 23.9 },
  right: { cx: 41.7, cy: 24.0 },
} as const;
const PUPIL_R = 2.8;
const MAX_DRIFT = 2.1; // keeps the pupil inside the cream at full deflection

export default function Cat({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftRef = useRef<SVGCircleElement>(null);
  const rightRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Honour reduced-motion: pin the eyes centred, skip all tracking.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Target vs. current pupil offset (viewBox units); eased toward target.
    const target = { lx: 0, ly: 0, rx: 0, ry: 0 };
    const cur = { lx: 0, ly: 0, rx: 0, ry: 0 };
    let raf = 0;

    // Where a given eye centre lands on screen, from the live SVG rect.
    const eyeScreen = (cx: number, cy: number, rect: DOMRect) => ({
      x: rect.left + (cx / 56) * rect.width,
      y: rect.top + (cy / 33) * rect.height,
    });

    const aim = (cursorX: number, cursorY: number, e: { cx: number; cy: number }, rect: DOMRect) => {
      const p = eyeScreen(e.cx, e.cy, rect);
      const a = Math.atan2(cursorY - p.y, cursorX - p.x);
      return { x: Math.cos(a) * MAX_DRIFT, y: Math.sin(a) * MAX_DRIFT };
    };

    const onMove = (ev: MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      // The band is the trigger line: only track once the cursor is below it.
      const band = document.querySelector("[data-footer-band]");
      const threshold = band ? band.getBoundingClientRect().bottom : rect.top;
      if (ev.clientY < threshold) {
        target.lx = target.ly = target.rx = target.ry = 0;
        return;
      }
      const l = aim(ev.clientX, ev.clientY, EYES.left, rect);
      const r = aim(ev.clientX, ev.clientY, EYES.right, rect);
      target.lx = l.x;
      target.ly = l.y;
      target.rx = r.x;
      target.ry = r.y;
    };

    const tick = () => {
      cur.lx += (target.lx - cur.lx) * 0.18;
      cur.ly += (target.ly - cur.ly) * 0.18;
      cur.rx += (target.rx - cur.rx) * 0.18;
      cur.ry += (target.ry - cur.ry) * 0.18;
      leftRef.current?.setAttribute("transform", `translate(${cur.lx.toFixed(3)} ${cur.ly.toFixed(3)})`);
      rightRef.current?.setAttribute("transform", `translate(${cur.rx.toFixed(3)} ${cur.ry.toFixed(3)})`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox="0 0 56 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Same roughen-edges "boil" as the Hands / TrafficLight: one
          feTurbulence → feDisplacementMap whose seed steps a shuffled list on a
          discrete timeline for a hand-drawn shimmer. `.cat-boil` lets
          globals.css drop it under prefers-reduced-motion. */}
      <defs>
        <filter id="cat-boil" x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09"
            numOctaves={2}
            seed={4}
            result="noise"
          >
            <animate
              attributeName="seed"
              dur="1.6s"
              calcMode="discrete"
              values="4;9;2;7;11;1;6;12;3;8;5;10"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={1.4}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <g className="cat-boil" filter="url(#cat-boil)" clipPath="url(#cat-clip)">
        {/* Head + ears (dark), with the two eye holes knocked out. */}
        <path
          d="M56 33H0L0.129038 31.3036L0.15095 28.5542L0.197209 26.5783C0.214252 25.8892 0.267814 25.2313 0.41633 24.5566L1.04204 21.7398C1.1516 21.2506 1.27334 20.8048 1.31473 20.306C1.39264 19.412 1.5728 18.5663 1.76027 17.6892C1.96965 16.7133 2.25451 15.8072 2.64162 14.8892C2.90457 14.2602 3.09204 13.6458 3.21377 12.9783C3.5108 11.3542 4.26799 9.48434 4.94483 7.95422C5.36359 7.00964 5.39768 6.22892 5.89679 5.35663C6.2839 4.68193 6.5858 3.99518 6.7684 3.23855C6.85848 2.86265 6.98509 2.51566 7.1969 2.19277L7.94192 1.05783C8.13426 0.766265 8.4045 0.638554 8.7551 0.616867C9.3662 0.578313 9.91887 0.828916 10.2451 1.34217C10.5957 1.71807 10.8611 2.14217 11.1313 2.57831C11.4552 3.1012 11.6597 3.65542 11.964 4.18795L13.2203 6.38313C13.6366 7.11084 13.9458 7.8747 14.4936 8.52289C14.6202 8.67229 14.91 8.58072 15.078 8.5759L18.0239 8.45783L20.2955 8.29639L24.6535 8.2747C26.0827 8.04819 27.4753 8.02169 28.9118 8.19036L33.1895 8.20964C34.2681 8.21446 35.2979 8.24337 36.3741 8.31807L38.0808 8.43615L40.9634 8.70121C41.4187 8.74217 41.8497 8.81928 42.3025 8.77349C42.4681 8.75663 42.6044 8.59518 42.6701 8.45783L43.3324 7.08916C43.7438 6.23615 44.1139 5.40241 44.4329 4.51084L44.9807 3.35663L45.5358 2.25783L46.1469 0.889157C46.4853 0.13253 47.4032 -0.183133 47.7343 0.113253L48.6789 0.963855C48.8859 1.1494 49.0247 1.36627 49.1367 1.62169L50.948 5.78313L51.3132 6.93735L51.5786 8.19036L52.3163 10.6699C52.6328 11.2699 52.9226 11.8651 53.0297 12.5349L53.3219 14.3566L53.9768 17.4217C54.1837 18.3928 54.3688 19.3253 54.6634 20.2723C54.9117 21.0699 55.0773 21.841 55.1649 22.6723L55.4035 24.9518L55.8247 28.9229L55.9075 31.1687L55.9805 33.0024L56 33ZM15.6501 30.3759C16.8261 30.6241 17.9168 30.5181 19.0635 30.2169C20.5584 29.8265 21.7636 28.9349 22.6376 27.6892C23.1684 26.9349 23.5263 26.1663 23.7016 25.2506C23.8647 24.4 23.9037 23.5928 23.7819 22.7229C23.7211 22.2819 23.5677 21.8819 23.4557 21.4554C23.3315 20.9759 23.1294 20.6072 22.8567 20.2048C22.4842 19.6506 22.0923 19.1904 21.5493 18.7831C20.6607 18.1181 19.6892 17.6506 18.5742 17.4675L17.2059 17.241L16.1516 17.2988C15.1072 17.3542 14.1917 17.8241 13.3079 18.3783C12.3438 18.9855 11.6353 19.853 11.1557 20.8771C10.8684 21.4892 10.7174 22.106 10.5422 22.7542C10.2646 23.788 10.2987 24.8 10.5811 25.8313C10.7394 26.4096 10.8221 26.9928 11.1752 27.4988L11.9883 28.6578C12.4509 29.3181 13.0791 29.7904 13.8606 29.9759L14.8734 30.2169L15.6428 30.3783L15.6501 30.3759ZM46.9454 28.4723C47.4251 28.0964 47.7221 27.6241 47.929 27.0819C48.0897 26.6602 48.2918 26.2458 48.321 25.7904C48.3673 25.0747 48.6424 24.5494 48.4842 23.7374L48.1311 21.9325C48.024 21.3855 47.7781 20.8747 47.4105 20.4458C46.8797 19.8313 46.3441 19.2506 45.733 18.7157C45.2193 18.2651 43.6586 17.6795 42.899 17.5301C42.3366 17.4193 41.7864 17.4337 41.2093 17.4265C40.2817 17.412 39.3712 17.5639 38.5482 17.9831L37.5378 18.4988C37.2506 18.6458 36.956 18.7904 36.7417 19.0337C35.5317 20.4145 34.7891 21.7759 34.7404 23.6482C34.6308 25.6217 35.2785 27.5687 36.8123 28.8651C38.0637 29.9229 39.2153 30.6699 40.9367 30.6072C42.546 30.8506 44.1602 30.294 45.6283 29.6554C46.1907 29.4096 46.6168 28.9976 46.9479 28.4699L46.9454 28.4723Z"
          fill="#191919"
        />
        {/* Eye whites — cream ovals (the source's ring + interior, merged). */}
        <path
          d="M44.3111 26.159C44.1139 27.3687 43.6124 28.588 42.3439 28.8506C41.2799 29.0723 40.1551 28.8795 39.303 28.1928C38.3535 27.4289 37.8446 26.2771 37.8178 25.0675L37.9371 22.4265C37.9663 21.7831 38.1733 21.1831 38.4801 20.6289C38.967 19.7518 39.824 19.1807 40.8368 19.1494C41.5283 19.1277 42.1613 19.2867 42.7213 19.6771C43.3713 20.1253 43.8534 20.7422 44.0628 21.5157C44.4888 23.0843 44.5716 24.5518 44.3111 26.1614V26.159Z"
          fill="#FCFCFC"
        />
        <path
          d="M19.5164 27.8627C18.2649 29.4193 15.4456 29.3349 14.294 27.6241C13.6245 26.6313 13.5198 25.3952 13.4686 24.2096L13.7048 22.0699C13.8679 21.1157 14.35 20.3301 15.0999 19.7301C15.4992 19.4096 15.9471 19.2 16.473 19.1663C17.8584 19.0771 19.1974 19.4289 19.7501 20.759C20.0885 21.5735 20.2663 22.4337 20.2638 23.3253L20.2589 26.0819C20.2589 26.7301 19.923 27.3663 19.5188 27.8651L19.5164 27.8627Z"
          fill="#FCFCFC"
        />
        <path
          d="M46.9454 28.4723C46.6143 29.0024 46.1907 29.4145 45.6258 29.6578C44.1553 30.2964 42.5435 30.853 40.9342 30.6096C39.2153 30.6699 38.0613 29.9253 36.8099 28.8675C35.276 27.5711 34.6284 25.6217 34.738 23.6506C34.7891 21.7783 35.5292 20.4169 36.7393 19.0361C36.9535 18.7928 37.2481 18.6482 37.5354 18.5012L38.5458 17.9855C39.3687 17.5639 40.2793 17.4145 41.2069 17.4289C41.7864 17.4386 42.3342 17.4241 42.8966 17.5325C43.6562 17.6819 45.2144 18.2651 45.7305 18.7181C46.3416 19.253 46.8773 19.8337 47.408 20.4482C47.7757 20.8747 48.0216 21.3855 48.1287 21.9349L48.4817 23.7398C48.64 24.5518 48.3649 25.0771 48.3186 25.7928C48.2894 26.2482 48.0873 26.6602 47.9266 27.0843C47.7197 27.6289 47.4226 28.1012 46.943 28.4747L46.9454 28.4723ZM44.3111 26.159C44.5741 24.5494 44.4888 23.0819 44.0628 21.5133C43.8534 20.7373 43.3689 20.1229 42.7213 19.6747C42.1589 19.2867 41.5258 19.1277 40.8368 19.147C39.824 19.1783 38.967 19.747 38.4801 20.6265C38.1733 21.1831 37.9664 21.7831 37.9371 22.4241L37.8178 25.0651C37.8446 26.2771 38.3535 27.4265 39.303 28.1904C40.1551 28.8771 41.2799 29.0699 42.3439 28.8482C43.6124 28.5831 44.1139 27.3663 44.3111 26.1566V26.159Z"
          fill="#FCFCFC"
        />
        <path
          d="M15.6501 30.3759L14.8807 30.2145L13.8679 29.9735C13.084 29.7855 12.4582 29.3157 11.9957 28.6554L11.1825 27.4964C10.827 26.9904 10.7467 26.4096 10.5884 25.8289C10.306 24.7976 10.2719 23.788 10.5495 22.7518C10.7223 22.1036 10.8757 21.4892 11.163 20.8747C11.6426 19.8506 12.3487 18.9831 13.3152 18.3759C14.199 17.8193 15.1145 17.3518 16.159 17.2964L17.2132 17.2386L18.5815 17.4651C19.6965 17.6506 20.6655 18.1157 21.5566 18.7807C22.0996 19.188 22.4915 19.6458 22.8641 20.2024C23.1343 20.6048 23.3388 20.9735 23.463 21.453C23.5725 21.8795 23.7259 22.2795 23.7892 22.7205C23.911 23.5904 23.872 24.3976 23.7089 25.2482C23.5336 26.1663 23.1757 26.9325 22.6449 27.6867C21.7709 28.9325 20.5657 29.8241 19.0708 30.2145C17.9241 30.5157 16.8334 30.6193 15.6574 30.3735L15.6501 30.3759ZM19.5164 27.8627C19.9181 27.3614 20.2541 26.7253 20.2565 26.0795L20.2614 23.3229C20.2614 22.4313 20.0861 21.5711 19.7477 20.7566C19.195 19.4265 17.8559 19.0723 16.4706 19.1639C15.9447 19.1976 15.4967 19.4096 15.0974 19.7277C14.35 20.3277 13.8655 21.1133 13.7024 22.0675L13.4662 24.2072C13.5173 25.3928 13.622 26.6289 14.2916 27.6217C15.4432 29.3325 18.2625 29.4193 19.5139 27.8602L19.5164 27.8627Z"
          fill="#FCFCFC"
        />
        {/* Pupils — dark, riding on top of the cream; they track the cursor. */}
        <circle ref={leftRef} cx={EYES.left.cx} cy={EYES.left.cy} r={PUPIL_R} fill="#191919" />
        <circle ref={rightRef} cx={EYES.right.cx} cy={EYES.right.cy} r={PUPIL_R} fill="#191919" />
      </g>
      <defs>
        <clipPath id="cat-clip">
          <rect width="56" height="33" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
