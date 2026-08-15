import type { CSSProperties, ReactElement } from "react";

/* ---------------------------------------------------------------------------
   Pixel lenses
   The three signal lenses are drawn as grids of squares — chunky 8-bit discs —
   rather than as smooth circles, matching the pixel-art vocabulary the site
   already uses for the lime puzzle pieces. Unlit they sit at a mid grey rather
   than near-black, so a dark lens still reads as a bulb rather than a hole.

   Each lens is three stacked discs: two oversized rings behind it standing in
   for the glow (a blocky, stepped halo instead of a Gaussian drop-shadow, so
   the light is pixelated too) and the opaque core on top. Only the core changes
   colour; the halo groups fade their opacity on the same clock.
   --------------------------------------------------------------------------- */

/** 7×7 core. Cell size is tuned so this lands on the ~43-unit footprint the
 *  original smooth lens paths occupied. */
const LENS_CORE = [
  "..XXX..",
  ".XXXXX.",
  "XXXXXXX",
  "XXXXXXX",
  "XXXXXXX",
  ".XXXXX.",
  "..XXX..",
];
/** 9×9 — one cell of halo proud of the core, roughly the housing's own size. */
const LENS_GLOW_INNER = [
  "..XXXXX..",
  ".XXXXXXX.",
  "XXXXXXXXX",
  "XXXXXXXXX",
  "XXXXXXXXX",
  "XXXXXXXXX",
  "XXXXXXXXX",
  ".XXXXXXX.",
  "..XXXXX..",
];
/** 11×11 — the faint outer step, deliberately spilling past the housing onto
 *  the lime body the way a real lamp's light would. */
const LENS_GLOW_OUTER = [
  "...XXXXX...",
  "..XXXXXXX..",
  ".XXXXXXXXX.",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  "XXXXXXXXXXX",
  ".XXXXXXXXX.",
  "..XXXXXXX..",
  "...XXXXX...",
];

const CELL = 6.2;
/** Cells are drawn a hair oversized so neighbours butt without an antialiasing
 *  seam showing between them (the parent boil filter would exaggerate one). */
const BLEED = 0.3;

/** Square mask → <rect> grid, centred on (cx, cy). */
function pixels(mask: string[], cx: number, cy: number): ReactElement[] {
  const half = (mask.length * CELL) / 2;
  const out: ReactElement[] = [];
  mask.forEach((row, r) =>
    [...row].forEach((ch, c) => {
      if (ch !== "X") return;
      out.push(
        <rect
          key={`${r}-${c}`}
          x={cx - half + c * CELL}
          y={cy - half + r * CELL}
          width={CELL + BLEED}
          height={CELL + BLEED}
        />
      );
    })
  );
  return out;
}

/** One lens: pixel halo (two steps) behind a pixel core. `name` keys the
 *  keyframes in globals.css → TRAFFIC LIGHT SIGNAL. The `fill` attribute is the
 *  reduced-motion resting colour; the animation drives the live cycle. */
function Lens({
  name,
  colour,
  cx,
  cy,
}: {
  name: "red" | "yellow" | "green";
  colour: string;
  cx: number;
  cy: number;
}) {
  return (
    <>
      <g className={`tl-glow tl-glow-${name}`} fill={colour}>
        <g opacity={0.16}>{pixels(LENS_GLOW_OUTER, cx, cy)}</g>
        <g opacity={0.45}>{pixels(LENS_GLOW_INNER, cx, cy)}</g>
      </g>
      <g className={`tl-lens tl-${name}`} fill={colour}>
        {pixels(LENS_CORE, cx, cy)}
      </g>
    </>
  );
}

/**
 * The street-corner scene for the footer's right edge — one supplied asset,
 * not just a signal head. Read top-to-bottom it is:
 *
 *   • a tall lime **mast/pole** running the full height on the right, with a
 *     thick lime **overhead arm** that curves up and off the top-right corner
 *     (the piece the mock reads as the "road" sweeping to the horizon);
 *   • a horizontal **signal head** cantilevered off to the left — a lime
 *     housing with three lenses, the leftmost lit green (#59A13B), the other
 *     two dark;
 *   • a dark **clamp/bracket** where the head meets the pole, plus a small
 *     bracket lower down;
 *   • the teal **"EDGE OF THE CITY"** street sign (baked-in white text);
 *   • a **No-Parking disc** (grey face, red ring, red "P", red slash) hanging
 *     off the pole on a short bracket, sitting just past the pole to the right.
 *
 * Faithful 1:1 port of the source SVG — only `stroke-width` → `strokeWidth`
 * for JSX. Purely decorative; the caller owns sizing/opacity/placement via
 * `className` / `style`, and should mark the wrapper `aria-hidden`. viewBox is
 * 500×673, so height ≈ width × 1.346.
 */
export default function TrafficLight({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 500 673"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Same roughen-edges "boil" as the draped Hands: one feTurbulence →
          feDisplacementMap filter over the whole scene, its seed stepping a
          shuffled list on a discrete ~7fps timeline for a hand-drawn shimmer.
          `.tl-boil` lets globals.css drop it under prefers-reduced-motion. */}
      <defs>
        <filter id="traffic-boil" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06"
            numOctaves={2}
            seed={4}
            result="noise"
          >
            <animate
              attributeName="seed"
              dur="1.8s"
              calcMode="discrete"
              values="4;9;2;7;11;1;6;12;3;8;5;10"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={6}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g className="tl-boil" filter="url(#traffic-boil)">
      {/* Signal head — lime housing, cantilevered left off the pole. */}
      <path d="M196.018 113.18C195.94 108.229 196.877 88.1077 195.036 85.1731C194.669 84.5893 194.518 84.4457 193.848 84.3118C190.073 83.5586 185.144 84.0954 181.238 84.0906L153.149 84.0759L44.3845 84.1141C39.7701 84.112 2.3009 83.6669 0.603232 84.6852C-0.462326 86.8889 0.257081 140.31 0.043367 147.89C0.380493 149.174 0.750745 151.273 1.67784 152.061C5.05512 152.75 11.1986 152.576 14.889 152.577L33.1299 152.578L104.792 152.546L167.526 152.573L182.703 152.545C186.294 152.547 191.019 152.669 194.474 152.161C195.418 150.999 195.863 149.626 196.047 148.148C195.82 139.692 196.087 131.054 195.979 122.579C228.052 122.434 262.989 120.376 292.109 135.629C314.227 147.215 327.126 165.091 327.627 190.489C327.614 190.733 327.602 190.978 327.59 191.222C330.504 190.306 333.081 190.474 336.121 190.56C336.041 171.988 330.901 155.502 317.395 142.254C284.631 110.117 238.366 113.142 196.018 113.18Z" fill="#BFFF00" />
      <path d="M196.043 148.148C189.73 147.805 183.493 148.026 177.167 148.057L150.846 148.023L40.7358 147.885C29.7671 147.787 18.7353 148.115 7.76062 148.035C5.16295 148.017 2.64052 148.118 0.0398345 147.89C0.37696 149.174 0.747213 151.273 1.67431 152.062C5.05159 152.75 11.1951 152.576 14.8854 152.578L33.1263 152.579L104.789 152.547L167.522 152.573L182.699 152.545C186.29 152.547 191.016 152.669 194.47 152.161C195.415 150.999 195.859 149.626 196.043 148.148Z" fill="#BFFF00" />

      {/* Lens housings/bezels — smooth discs, as supplied. The pixel lenses that
          sit in them are rendered OUTSIDE this boil group, below. */}
      <path d="M102.103 89.8473C87.3955 87.7525 73.763 97.9353 71.6018 112.628C69.4406 127.321 79.5634 140.996 94.2494 143.223C109.03 145.464 122.815 135.264 124.99 120.477C127.166 105.691 116.901 91.9556 102.103 89.8473Z" fill="#BFCDCF" />
      <path d="M163.162 89.8441C148.421 87.7857 134.8 98.0552 132.726 112.79C130.652 127.525 140.911 141.153 155.648 143.24C170.405 145.331 184.06 135.057 186.136 120.302C188.212 105.547 177.923 91.9054 163.162 89.8441Z" fill="#BFCDCF" />
      <path d="M40.3444 89.8188C25.6042 88.0535 12.2155 98.5448 10.4064 113.275C8.6004 128.006 19.0543 141.421 33.7855 143.269C48.5739 145.125 62.0559 134.621 63.871 119.832C65.686 105.042 55.1418 91.5912 40.3444 89.8188Z" fill="#BFCDCF" />

      {/* Pole (lime front face) + its shaded side edges and dark clamp. */}
      <path d="M355.497 264.247C349.935 264.251 344.274 264.439 341.2 264.469C341.516 291.293 341.244 319.196 341.15 346.047L341.292 415.582L341.284 424.354C341.248 443.393 341.106 462.642 341.23 481.631L341.265 486.009L341.737 606.692C341.804 620.466 341.73 634.243 341.519 648.014L341.42 653.915C341.397 655.701 341.41 659.54 341.397 663.289C341.386 666.897 341.348 670.427 341.234 671.946H369.85L369.527 406.845L369.464 354.068C369.282 324.496 368.902 295.336 369.335 265.684L369.114 265.155C367.856 264.798 365.881 264.569 363.517 264.432C361.114 264.292 358.321 264.245 355.497 264.247Z" fill="#BFFF00" stroke="#BFFF00" strokeWidth="0.300966" />
      <path d="M336.474 197.496C333.876 197.742 330.903 197.422 328.194 197.508C328.316 199.44 328.473 200.527 328.05 202.42C327.956 215.489 327.944 228.561 328.013 241.631C328.014 245.786 328.277 255.323 327.924 258.964C330.896 258.666 333.331 258.937 336.293 259.226C336.946 239.5 336.273 217.569 336.474 197.496Z" fill="#888888" />
      <path d="M368.738 188.268C366.814 188.924 361.762 188.093 359.25 187.958C355.189 187.74 344.264 188.672 340.827 190.446C340.099 192.53 339.431 192.857 337.312 192.041C336.81 191.475 336.56 191.171 336.117 190.56C333.077 190.474 330.501 190.306 327.586 191.222C327.112 194.525 328.206 198.567 328.047 202.42C328.47 200.527 328.313 199.44 328.192 197.508C330.9 197.423 333.873 197.742 336.471 197.496C337.498 195.713 338.367 195.255 340.269 196.412C340.719 197.18 340.685 197.299 340.835 198.159C346.173 197.096 364.064 194.85 368.385 197.434C368.497 198.394 368.626 199.353 368.772 200.309C368.905 196.182 369.063 192.391 368.738 188.268Z" fill="#656464" />
      <path d="M359.253 187.958C355.192 187.74 344.267 188.671 340.829 190.445C340.102 192.529 339.433 192.857 337.316 192.041C336.814 191.475 336.562 191.171 336.12 190.561C333.08 190.474 330.504 190.306 327.589 191.222C327.115 194.525 328.209 198.567 328.05 202.42C327.956 215.489 327.944 228.562 328.013 241.631C328.015 245.787 328.276 255.324 327.924 258.965C327.533 260.379 327.488 263.162 327.825 264.562C330.603 264.757 333.473 264.276 336.39 264.318C336.683 263.954 336.978 263.662 337.299 263.325C339.213 262.666 340.323 262.582 341.177 264.559C347.103 264.528 363.777 264.071 368.761 264.998L369.017 265.387C369.342 263.38 368.849 251.17 368.647 248.829C368.329 232.495 368.996 216.561 368.775 200.309C368.907 196.182 369.066 192.391 368.741 188.268C366.817 188.924 361.765 188.093 359.253 187.958ZM336.475 197.496C337.501 195.713 338.371 195.255 340.273 196.412C340.723 197.18 340.688 197.299 340.838 198.159C341.57 203.079 341.508 212.568 341.478 217.681L341.193 246.692C341.193 249.232 341.048 254.387 341.257 256.773C341.156 258.23 341.165 260.231 338.812 260.231C337.941 260.231 336.907 259.886 336.293 259.227C336.946 239.501 336.273 217.569 336.475 197.496Z" fill="#BFFF00" />
      <path d="M368.646 248.829C368.499 251.366 368.553 253.262 368.643 255.777C364.531 255.841 360.28 256.181 356.129 256.352C351.802 256.527 345.353 256.175 341.257 256.774C341.156 258.23 341.165 260.231 338.812 260.231C337.941 260.231 336.907 259.885 336.293 259.226C333.331 258.937 330.896 258.666 327.925 258.964C327.534 260.379 327.488 263.162 327.825 264.562C330.603 264.757 333.474 264.276 336.39 264.318C336.684 263.954 336.978 263.662 337.299 263.325C339.213 262.666 340.323 262.581 341.177 264.559C347.102 264.528 363.777 264.071 368.761 264.998L369.017 265.386C369.342 263.379 368.849 251.17 368.646 248.829Z" fill="#272727" />
      <path d="M368.74 188.268L368.709 187.954C368.397 184.471 368.579 178.157 368.595 174.526C368.637 165.535 368.766 156.545 368.984 147.557C369.1 142.193 369.566 135.673 368.606 130.435C366.464 118.757 350.915 115.566 343.689 124.593C342.253 126.387 341.529 128.351 341.201 130.636C340.371 139.051 340.717 148.281 340.816 156.695C340.882 167.945 340.886 179.196 340.828 190.446C344.266 188.671 355.19 187.74 359.251 187.958C361.763 188.093 366.815 188.924 368.74 188.268Z" fill="#272727" />
      <path d="M336.388 264.318C333.471 264.276 330.601 264.757 327.823 264.562C328.112 265.886 328.017 269.476 328.012 270.99L327.951 285.636C327.938 289.105 326.989 299.09 331.9 299.517C332.873 299.596 333.834 299.253 334.538 298.576C335.304 297.847 336.133 296.015 336.186 295.001C336.719 284.871 336.076 274.441 336.388 264.318Z" fill="#BFFF00" />

      {/* Overhead arm — thick lime stroke curving off the top-right corner. */}
      <path d="M355.066 144.934C355.066 111.828 355.066 88.1467 355.066 61.6774C355.066 35.4013 376.367 14.0967 402.643 14.0967H500" stroke="#BFFF00" strokeWidth="28.1938" />

      {/* No-Parking disc — grey face, red ring, red "P", red slash — on a bracket. */}
      <circle cx="436" cy="468.097" r="47" fill="#DFDFDF" />
      <circle cx="436" cy="468.097" r="34.5" stroke="#E30000" strokeWidth="3" />
      <path d="M424.685 484.097V451.856H437.028C438.963 451.856 440.682 452.239 442.187 453.007C443.722 453.744 444.935 454.803 445.826 456.185C446.716 457.567 447.161 459.24 447.161 461.205V461.804C447.161 463.739 446.701 465.412 445.78 466.825C444.889 468.206 443.676 469.266 442.141 470.003C440.606 470.74 438.902 471.108 437.028 471.108H428.554V484.097H424.685ZM428.554 467.608H436.614C438.671 467.608 440.299 467.101 441.496 466.088C442.694 465.044 443.292 463.585 443.292 461.712V461.252C443.292 459.378 442.694 457.935 441.496 456.922C440.329 455.878 438.702 455.356 436.614 455.356H428.554V467.608Z" fill="#FF0000" />
      <line x1="400.951" y1="436.936" x2="472.951" y2="495.936" stroke="#E30000" strokeWidth="3" />
      <rect x="370" y="470.097" width="20" height="4" fill="#D9D9D9" />

      {/* "EDGE OF THE CITY" street sign — teal plate, white border + text. */}
      <rect x="217" y="347.097" width="166" height="35.3909" fill="#275F62" />
      <rect x="222.054" y="350.467" width="155.888" height="28.6497" stroke="white" strokeWidth="1.68528" />
      <path d="M243.305 370.097V358.68H250.334V359.919H244.675V363.736H249.878V364.975H244.675V368.857H250.416V370.097H243.305ZM251.304 370.097V368.873H252.903V359.903H251.304V358.68H255.757C257.257 358.68 258.415 359.06 259.231 359.822C260.057 360.583 260.47 361.752 260.47 363.328V365.448C260.47 367.036 260.057 368.21 259.231 368.971C258.415 369.722 257.257 370.097 255.757 370.097H251.304ZM254.273 368.857H255.757C256.866 368.857 257.703 368.585 258.268 368.042C258.834 367.498 259.117 366.655 259.117 365.514V363.279C259.117 362.116 258.834 361.268 258.268 360.735C257.703 360.202 256.866 359.936 255.757 359.936H254.273V368.857ZM265.984 370.325C265.136 370.325 264.386 370.151 263.734 369.803C263.092 369.444 262.587 368.922 262.217 368.237C261.858 367.552 261.679 366.704 261.679 365.693V363.084C261.679 361.572 262.081 360.425 262.886 359.642C263.69 358.848 264.772 358.452 266.131 358.452C267.479 358.452 268.507 358.821 269.214 359.561C269.92 360.3 270.274 361.289 270.274 362.529V362.611H268.92V362.496C268.92 361.953 268.822 361.469 268.627 361.045C268.431 360.621 268.126 360.289 267.713 360.05C267.3 359.8 266.773 359.675 266.131 359.675C265.163 359.675 264.408 359.974 263.864 360.572C263.32 361.159 263.049 361.985 263.049 363.051V365.726C263.049 366.791 263.32 367.623 263.864 368.221C264.408 368.808 265.169 369.102 266.147 369.102C267.104 369.102 267.806 368.83 268.251 368.286C268.708 367.743 268.936 367.02 268.936 366.117V365.84H265.479V364.666H270.274V370.097H269.034V368.857H268.806C268.686 369.096 268.518 369.33 268.3 369.558C268.083 369.787 267.789 369.972 267.42 370.113C267.05 370.254 266.571 370.325 265.984 370.325ZM272.119 370.097V358.68H279.149V359.919H273.489V363.736H278.692V364.975H273.489V368.857H279.23V370.097H272.119ZM288.336 370.325C286.977 370.325 285.89 369.934 285.074 369.151C284.27 368.357 283.867 367.204 283.867 365.693V363.084C283.867 361.572 284.27 360.425 285.074 359.642C285.89 358.848 286.977 358.452 288.336 358.452C289.706 358.452 290.794 358.848 291.598 359.642C292.414 360.425 292.821 361.572 292.821 363.084V365.693C292.821 367.204 292.414 368.357 291.598 369.151C290.794 369.934 289.706 370.325 288.336 370.325ZM288.336 369.102C289.326 369.102 290.092 368.808 290.636 368.221C291.18 367.623 291.451 366.797 291.451 365.742V363.035C291.451 361.98 291.18 361.159 290.636 360.572C290.092 359.974 289.326 359.675 288.336 359.675C287.358 359.675 286.597 359.974 286.053 360.572C285.509 361.159 285.237 361.98 285.237 363.035V365.742C285.237 366.797 285.509 367.623 286.053 368.221C286.597 368.808 287.358 369.102 288.336 369.102ZM294.451 370.097V358.68H301.35V359.919H295.821V363.752H300.91V364.992H295.821V370.097H294.451ZM308.519 370.097V359.919H304.849V358.68H313.558V359.919H309.889V370.097H308.519ZM314.649 370.097V358.68H316.019V363.752H321.369V358.68H322.739V370.097H321.369V364.992H316.019V370.097H314.649ZM324.7 370.097V358.68H331.73V359.919H326.07V363.736H331.273V364.975H326.07V368.857H331.811V370.097H324.7ZM340.901 370.325C339.542 370.325 338.46 369.934 337.655 369.151C336.85 368.357 336.448 367.204 336.448 365.693V363.084C336.448 361.572 336.85 360.425 337.655 359.642C338.46 358.848 339.542 358.452 340.901 358.452C342.249 358.452 343.282 358.827 343.999 359.577C344.728 360.327 345.092 361.355 345.092 362.659V362.741H343.739V362.611C343.739 361.752 343.505 361.05 343.037 360.507C342.581 359.952 341.868 359.675 340.901 359.675C339.933 359.675 339.177 359.974 338.634 360.572C338.09 361.159 337.818 361.985 337.818 363.051V365.726C337.818 366.791 338.09 367.623 338.634 368.221C339.177 368.808 339.933 369.102 340.901 369.102C341.868 369.102 342.581 368.83 343.037 368.286C343.505 367.732 343.739 367.025 343.739 366.166V365.905H345.092V366.117C345.092 367.422 344.728 368.449 343.999 369.2C343.282 369.95 342.249 370.325 340.901 370.325ZM346.586 370.097V358.68H347.956V370.097H346.586ZM352.721 370.097V359.919H349.051V358.68H357.761V359.919H354.091V370.097H352.721ZM361.836 370.097V365.742L357.775 358.68H359.341L362.407 364.16H362.635L365.702 358.68H367.267L363.206 365.742V370.097H361.836Z" fill="white" />
      </g>

      {/* Three lenses — they cycle red → yellow → green, one lit at a time with
          a matching pixel halo (see § TRAFFIC LIGHT SIGNAL in globals.css).
          Left = red, middle = yellow, right = green, drawn on the housing
          centres measured off the original smooth lens paths so they land
          exactly where those did.

          Deliberately OUTSIDE the boil group: the displacement map throws pixels
          about a full cell at render scale, which rounds the squares off and
          loses the whole point of a pixel lens. Kept crisp, they read as the
          machine part of a hand-drawn sign — the housing still shimmers around
          them, so nothing looks detached. */}
      <Lens name="red" colour="#e8402f" cx={37.14} cy={116.55} />
      <Lens name="yellow" colour="#f2b01c" cx={98.3} cy={116.55} />
      <Lens name="green" colour="#5eb63a" cx={159.43} cy={116.55} />
    </svg>
  );
}
