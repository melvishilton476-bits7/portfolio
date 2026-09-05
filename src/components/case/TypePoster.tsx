import type { CSSProperties } from "react";
import { MuseoModerno, Montserrat } from "next/font/google";

/**
 * A foundry-style specimen poster, one per typeface in the system.
 *
 * The layout is the specimen-sheet convention: a row of metadata across the
 * top, a staggered phrase set small in the middle, and the typeface's own name
 * set enormous across the foot. It earns its place here because a case study
 * claiming a face was chosen for its letterforms has to show the letterforms
 * at a size where the choice is arguable.
 *
 * Both faces are loaded through next/font, which scopes a font to the
 * component that loads it — so these two are requested on this page only and
 * nothing else on the site inherits them (Font Optimization, next/dist/docs).
 * Neither call passes `weight`, which loads the VARIABLE cut: the posters use
 * several weights each, and static cuts would be a file per weight.
 *
 * Sized in `cqw` against a `container-type: inline-size` plate rather than in
 * px or vw. The poster has to hold its proportions at any figure width — the
 * wordmark is set to fill the measure edge to edge — and cqw makes every size
 * here a fraction of the poster's own width instead of the viewport's, so one
 * set of numbers works at 880px and at 335px.
 *
 * The typing animation lives in globals.css (`.tp-ch`). Every character is its
 * own span carrying an index, so the reveal is per-letter rather than
 * per-line. Fires once on `.is-grown`, which <Figure>'s GrowOnView puts on an
 * ancestor.
 */

const museo = MuseoModerno({ variable: "--font-museo", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({ variable: "--font-mont", subsets: ["latin"], display: "swap" });

export const FACES = {
  museo: {
    key: "museo",
    className: museo.variable,
    varName: "--font-museo",
    name: "MuseoModerno",
    role: "Primary — every board",
    /** Straight from the family's Google Fonts metadata, not paraphrased. */
    meta: [
      ["OPEN FONT LICENSE", "DISPLAY + TEXT", "VARIABLE 100–900"],
      ["LATIN / LATIN-EXT / VIETNAMESE", "ROMAN + ITALIC", "OMNIBUS-TYPE, 2020"],
    ],
    phrase: [
      { text: "GEOMETRIC BOWLS", indent: 6 },
      { text: "WIDE APERTURES, ROUNDED", indent: 0 },
      { text: "TERMINALS THAT HOLD A NAME", indent: 12 },
      { text: "AT THE DISTANCE A SIGN IS READ", indent: 4 },
    ],
  },
  montserrat: {
    key: "montserrat",
    className: montserrat.variable,
    varName: "--font-mont",
    name: "Montserrat",
    role: "Secondary — long copy",
    meta: [
      ["OPEN FONT LICENSE", "TEXT", "VARIABLE 100–900"],
      ["LATIN / CYRILLIC / VIETNAMESE", "ROMAN + ITALIC", "J. ULANOVSKY ET AL, 2011"],
    ],
    phrase: [
      { text: "A NEUTRAL GROTESQUE", indent: 10 },
      { text: "FOR THE PARAGRAPHS THE", indent: 0 },
      { text: "DISPLAY FACE SHOULD NOT", indent: 14 },
      { text: "BE ASKED TO CARRY", indent: 6 },
    ],
  },
} as const;

export type FaceKey = keyof typeof FACES;

/** The information family's own base, yellow and grey, from
 *  <PaletteWeighting>. A specimen on white would be showing the face
 *  somewhere it never appears. */
const PLATE = "#191919";
const YELLOW = "#FFD200";
const GREY = "#A8A8A8";

/** The gap between two adjacent characters. Every string starts at zero and
 *  runs its own clock, so the whole sheet begins at once and each line sweeps
 *  left to right — a poster is taken in as one object, and revealing it block
 *  by block made a reader wait on a sequence that carries no meaning. */
const STEP_MS = 26;

/**
 * Splits a string into per-character spans, each delayed by its own position
 * in the string, so the line reveals left to right. Spaces are emitted as
 * non-breaking so a span-per-character line still wraps and measures like
 * text.
 */
function Typed({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      {[...text].map((ch, i) => (
        <span key={i} className="tp-ch" style={{ "--d": `${i * STEP_MS}ms` } as CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export default function TypePoster({ face }: { face: FaceKey }) {
  const f = FACES[face];

  return (
    <div
      className={`${f.className} absolute inset-0 flex flex-col justify-between`}
      style={{
        backgroundColor: PLATE,
        fontFamily: `var(${f.varName})`,
        containerType: "inline-size",
        padding: "5.5cqw 5cqw 4cqw",
      }}
    >
      {/* Metadata. Two rows of three, the specimen-sheet convention: what the
          family is, what it covers, who made it. */}
      <div style={{ display: "grid", gap: "1.1cqw 3cqw", gridTemplateColumns: "1.5fr 1fr 1.1fr" }}>
        {f.meta.flat().map((cell, i) => (
          <Typed
            key={i}
            text={cell}
            style={{
              color: GREY,
              fontSize: "1.42cqw",
              fontWeight: 500,
              letterSpacing: "0.09em",
            }}
          />
        ))}
      </div>

      {/* The staggered phrase. Indents are per-line and deliberate — the block
          is meant to read as set by hand rather than as a justified column. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5cqw" }}>
        {f.phrase.map((line) => (
          <Typed
            key={line.text}
            text={line.text}
            style={{
              color: YELLOW,
              fontSize: "2.5cqw",
              fontWeight: 600,
              letterSpacing: "0.06em",
              marginLeft: `${line.indent}cqw`,
            }}
          />
        ))}
      </div>

      {/* The wordmark, set to fill the measure. Mixed case, not caps: this is
          the family's own name rather than board copy, and the lowercase is
          where a geometric face shows what it is. */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "2cqw" }}>
        <Typed
          text={f.name}
          style={{
            color: "#ffffff",
            // Tied to character count so both posters fill the same measure
            // despite "Montserrat" being two characters shorter.
            fontSize: `${88 / f.name.length}cqw`,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 0.92,
            whiteSpace: "nowrap",
          }}
        />
        <Typed
          text={f.role}
          style={{
            color: GREY,
            fontSize: "1.42cqw",
            fontWeight: 500,
            letterSpacing: "0.09em",
            whiteSpace: "nowrap",
          }}
        />
      </div>
    </div>
  );
}
