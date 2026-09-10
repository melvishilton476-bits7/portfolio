/**
 * One dashboard strategy card, before or after the redesign.
 *
 * FRAMING
 *
 * Both exports arrive on artboards padded for their own drop shadow, and
 * padded differently — 16px around the old card, effectively none around the
 * new one. Both viewBoxes are cropped to the card itself, so what each file
 * now measures IS the card: 364x485 and 663x1036. The shadow is CSS from here
 * on, which is what makes the two look like one treatment.
 *
 * The frames stay at different heights on purpose. Same dashboard column,
 * same width, and the new card is genuinely taller — the caption owns up to
 * costing vertical space, and a shared box would hide the only evidence of it.
 *
 * `frameRatio` is why that survives the padding. A percentage `padding`
 * resolves against WIDTH on all four sides, so the plate insets the card
 * evenly, but it also means the frame is taller than the card by a fixed
 * amount rather than proportionally. Solving
 *
 *     W(1 - 2p) / (H - 2pW) = A
 *
 * for W/H gives the frame ratio that leaves the CARD at exactly its artboard
 * ratio A. Both cards then come out width-limited, so their heights stay in
 * the true 1.195 proportion instead of drifting with the padding.
 *
 * Because that arithmetic makes the inner box exactly the artboard, the image
 * can fill it rather than being fitted into it — which is what lets an
 * overlay share its coordinate space (see <AfterCurve>).
 *
 * No boil here, unlike <ZenxoDirection>. These are the shipped article at full
 * colour, not proposals — a wobble would say they are still up for argument.
 *
 * Plain <img>: Next won't optimise SVG without `dangerouslyAllowSVG`, so
 * next/image would only wrap the same request.
 */

/** Inset of the card inside its frame, as a fraction of frame width.
 *
 *  Widened from the 0.035 that only had to clear the shadow. These are cards,
 *  and a card shown edge to edge in its frame reads as a screenshot of a
 *  screen rather than as an object on a page — the air around it is what says
 *  "this is one card, at its own size". It also brings both cards down to
 *  roughly the size they are in the product. */
const PAD = 0.09;

/** The cropped artboards — the cards' own dimensions. */
const ART = {
  before: { w: 364, h: 485 },
  after: { w: 663, h: 1036 },
} as const;

/** Frame ratio that leaves a card of ratio `a` at exactly `a` once PAD is
 *  taken off all four sides. Derived rather than eyeballed so the two cards'
 *  relative heights stay honest. */
export const frameRatio = (a: number) => 1 / ((1 - 2 * PAD) / a + 2 * PAD);

/** The plate a card sits on, shared by every card-shaped figure on this page
 *  — the exported before/after shots below, and the two transcribed run cards
 *  in <ZenxoPreRunCard> and <ZenxoRunningCard>. One definition because the
 *  padding, the ground and the shadow together ARE the treatment: a card that
 *  picked up a different inset or a different falloff would read as a
 *  different kind of object rather than as the same card at another moment.
 *
 *  `art` is the artwork's own pixel size and `radius` its own corner radius,
 *  both in artboard units; the ratio a caller should frame this at is
 *  `plateRatio(art)`. */
export function CardPlate({
  art,
  radius,
  children,
}: {
  art: { w: number; h: number };
  radius: number;
  children: React.ReactNode;
}) {
  return (
    // White plate rather than the Placeholder's grey: the cards are cropped
    // flush to their own edges, so anything but the page's own ground would
    // read as a mat around them.
    <div className="absolute inset-0 bg-background" style={{ padding: `${PAD * 100}%` }}>
      <div
        className="relative h-full w-full"
        // The shadow's radius has to track the rendered width, and the
        // artboards are different sizes, so it is expressed in cqw against
        // this box rather than in px. A percentage border-radius would resolve
        // each axis separately and draw ellipses.
        style={{ containerType: "inline-size" }}
      >
        {/* The shadow is cast by an empty box behind the card, not by a filter
            on the card itself.

            `drop-shadow` follows the image's alpha, and the alpha it gets is
            the RASTERISED svg at whatever size the figure happens to be — so
            the shadow inherits that raster's stair-stepped edge and its blur
            is a cheap approximation on top of it. At this size it reads as a
            gritty halo rather than as light. A box-shadow on a box whose
            geometry is known exactly is drawn analytically instead, which is
            what makes it smooth.

            Four layers rather than two: contact, near, mid, and a wide soft
            one. The ramp is what stops the falloff from banding — two layers
            leave a visible shoulder where the near one ends, and that shoulder
            IS the band. */}
        <div
          className="zc-shadow absolute inset-0"
          style={{ borderRadius: `calc(100cqw * ${radius / art.w})` }}
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}

/** Frame ratio for a card of this artboard size — the ratio that leaves it at
 *  exactly its own proportions once PAD is taken off all four sides. */
export const plateRatio = (art: { w: number; h: number }) => frameRatio(art.w / art.h);

export const CARD_RATIO = {
  before: frameRatio(ART.before.w / ART.before.h),
  after: frameRatio(ART.after.w / ART.after.h),
} as const;

/**
 * The new card's cumulative curve, drawn on.
 *
 * The path is lifted verbatim out of the export and the export's copy deleted,
 * because a line can only draw itself if nothing is already painting it. It
 * keeps the file's own coordinates and viewBox, so it lands on the millimetre
 * without a single number being re-derived — the overlay and the image are
 * stretched to the same box, which the framing arithmetic above guarantees is
 * the artboard.
 *
 * `pathLength="1"` normalises the path's own length away, so one dash of 1 and
 * an offset from 1 to 0 is the whole animation regardless of how long the
 * curve actually is. The gradient is the export's: white at both ends, orange
 * through the middle, so the line fades out at the edges of the plot rather
 * than stopping dead.
 */
function AfterCurve() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      viewBox="0.758484 0 663 1036"
      fill="none"
    >
      <defs>
        <linearGradient
          id="zc-curve"
          x1="644.902"
          y1="439"
          x2="43.8867"
          y2="439"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.514423" stopColor="#EC5E1A" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
      <path
        className="zc-curve"
        d="M50.7585 522.489L53.4486 526.106C55.8683 529.359 60.4695 530.03 63.7179 527.604C64.5024 527.018 65.1616 526.281 65.6565 525.436L71.8501 514.861C73.2191 512.524 76.5617 512.423 78.0685 514.674C79.3272 516.555 81.9707 516.86 83.6246 515.315L84.0643 514.905C85.3118 513.74 87.1418 513.45 88.6883 514.172L90.8415 515.177C94.547 516.907 98.9584 515.44 100.889 511.835L102.03 509.703C102.739 508.379 103.73 507.227 104.934 506.328L113.642 499.824C115.929 498.116 118.861 497.525 121.63 498.214C126.374 499.396 131.24 496.788 132.884 492.184L134.952 486.391C135.413 485.1 136.067 483.886 136.892 482.791L141.379 476.832C144.803 472.286 151.689 472.477 154.856 477.207L157.735 481.508C158.803 483.104 160.99 483.479 162.529 482.33C164.067 481.18 166.255 481.555 167.323 483.151L167.634 483.615C169.212 485.973 172.705 485.898 174.18 483.474L177.191 478.527C177.784 477.552 178.589 476.723 179.547 476.103L194.654 466.324C197.077 464.755 200.329 465.771 201.428 468.44C202.882 471.969 207.748 472.308 209.677 469.014L213.734 462.088C214.483 460.809 215.551 459.745 216.833 459L224.727 454.414C226.451 453.412 228.621 453.62 230.124 454.93C232.803 457.264 237.003 455.858 237.738 452.382L238.656 448.043C239.312 444.94 243.322 444.061 245.215 446.606C246.431 448.241 248.743 448.578 250.375 447.359L257.948 441.702C259.277 440.71 261.078 440.634 262.486 441.51C265.168 443.18 268.64 441.251 268.64 438.092V433.899C268.64 431.247 270.287 428.873 272.772 427.946L274.52 427.293C279.119 425.575 284.248 427.839 286.077 432.395L289.38 440.617C290.312 442.938 293.246 443.66 295.149 442.036L295.888 441.405C297.971 439.627 301.181 441.107 301.181 443.846C301.181 446.352 303.925 447.891 306.064 446.584L310.607 443.807C313.838 441.832 318.07 443.193 319.544 446.681L323.72 456.56C324.706 458.891 326.364 460.876 328.483 462.261L329.486 462.916C333.665 465.648 339.15 465.269 342.914 461.989C344.309 460.773 345.38 459.229 346.03 457.496L351.821 442.046C353.037 438.803 357.508 438.505 359.143 441.558C360.793 444.638 365.313 444.302 366.487 441.011L367.025 439.504C368.07 436.579 371.6 435.433 374.163 437.188L378.083 439.873C381.47 442.192 386.07 439.767 386.07 435.662V435.335C386.07 434.292 386.453 433.286 387.147 432.508C389.743 429.6 394.559 431.436 394.559 435.335V438.348C394.559 439.46 394.902 440.545 395.543 441.454L399.841 447.554C403.406 452.614 411.244 451.291 412.951 445.341L414.654 437.71C415.053 435.921 417.444 435.558 418.356 437.148C419.112 438.465 420.998 438.5 421.802 437.213L425.45 431.374C427.659 427.837 432.678 427.49 435.354 430.688L436.15 431.639C436.713 432.313 437.146 433.087 437.425 433.92L442.552 449.238C444.09 453.833 449.39 455.943 453.665 453.662C454.801 453.056 455.77 452.179 456.487 451.109L461.216 444.043C462.704 441.821 465.686 441.178 467.957 442.592C470.361 444.088 473.528 443.271 474.908 440.798L477.379 436.366C478.699 434.001 480.939 432.288 483.567 431.633L483.99 431.528C488.803 430.33 492.181 426.007 492.181 421.048V412.116C492.181 408.641 494.494 405.591 497.84 404.653L499.06 404.312C501.685 403.576 503.499 401.184 503.499 398.458C503.499 394.415 507.372 391.499 511.257 392.615L513.504 393.261C517.984 394.548 522.591 391.666 523.393 387.074L525.798 373.302C526.017 372.044 526.646 370.888 527.579 370.016C531.319 366.524 537.455 369.147 537.455 374.264C537.455 375.138 537.65 376 538.027 376.788L543.153 387.508C543.994 389.267 545.77 390.386 547.719 390.386C550.01 390.386 552.015 388.847 552.608 386.634L557.048 370.049C558.112 366.074 563.525 365.521 565.372 369.199C566.855 372.153 570.918 372.535 572.926 369.91L573.223 369.523C573.881 368.662 574.813 368.051 575.865 367.789L578.95 367.02C581.335 366.427 583.314 364.768 584.316 362.523L585.869 359.042C587.16 356.149 590.802 355.201 593.34 357.097L594.839 358.216C596.609 359.538 599.148 358.877 600.048 356.859C600.288 356.322 600.662 355.855 601.133 355.503L602.807 354.253C608.552 349.961 616.783 351.936 619.955 358.368L623.758 366.08"
        stroke="url(#zc-curve)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}

/** The corner radius both exports draw, in their own artboard units. */
const CARD_RADIUS = 16;

export default function ZenxoCardShot({
  which,
  src,
  alt,
  curve = false,
}: {
  /** Which artboard this is, for the shadow's corner radius. */
  which: keyof typeof ART;
  src: string;
  alt: string;
  /** Draw the cumulative curve on rather than shipping it in the export. */
  curve?: boolean;
}) {
  const art = ART[which];
  return (
    <CardPlate art={art} radius={CARD_RADIUS}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full" />
      {curve ? <AfterCurve /> : null}
    </CardPlate>
  );
}
