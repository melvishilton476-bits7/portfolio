import { ImageResponse } from "next/og";

/**
 * The site's default share card (home, About, Blogs, Playground): what a link
 * to melvishilton.com shows when it is pasted into LinkedIn, WhatsApp, Slack
 * or iMessage. Case studies override it with their own opening image.
 *
 * Drawn in the site's blueprint vocabulary: white ground, dashed rules, crop
 * marks round the name and the periwinkle registration squares.
 */

export const alt = "Melvis Hilton — Designer who can Simplify";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#171717";
const MUTED = "#8a8a8a";
const PERI = "#8581ff";
const RULE = "rgba(23,23,23,0.16)";

function Mark({ x, y, flipX, flipY }: { x: number; y: number; flipX?: boolean; flipY?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 22,
        height: 22,
        borderLeft: flipX ? "none" : `2px solid #cfcfcf`,
        borderRight: flipX ? `2px solid #cfcfcf` : "none",
        borderTop: flipY ? "none" : `2px solid #cfcfcf`,
        borderBottom: flipY ? `2px solid #cfcfcf` : "none",
        display: "flex",
      }}
    />
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Dashed rules across the full width, above and below the name. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, borderTop: `2px dashed ${RULE}`, display: "flex" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, borderTop: `2px dashed ${RULE}`, display: "flex" }} />

        <Mark x={250} y={226} />
        <Mark x={928} y={226} flipX />
        <Mark x={250} y={352} flipY />
        <Mark x={928} y={352} flipX flipY />

        <div style={{ position: "absolute", left: 120, top: 120, width: 26, height: 26, background: PERI, display: "flex" }} />
        <div style={{ position: "absolute", left: 146, top: 146, width: 26, height: 26, border: `2px solid ${PERI}`, display: "flex" }} />
        <div style={{ position: "absolute", right: 140, bottom: 120, width: 26, height: 26, border: `2px solid ${PERI}`, display: "flex" }} />
        <div style={{ position: "absolute", right: 114, bottom: 94, width: 26, height: 26, background: PERI, display: "flex" }} />

        <div style={{ fontSize: 96, color: INK, letterSpacing: -3, lineHeight: 1, display: "flex" }}>Melvis Hilton</div>
        <div style={{ marginTop: 22, fontSize: 34, color: MUTED, display: "flex" }}>Designer who can Simplify</div>
        <div style={{ position: "absolute", bottom: 64, fontSize: 24, color: MUTED, letterSpacing: 4, display: "flex" }}>
          MELVISHILTON.COM
        </div>
      </div>
    ),
    size,
  );
}
