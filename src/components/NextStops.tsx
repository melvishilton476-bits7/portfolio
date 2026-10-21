import { StreetSection, type SideProject } from "./SideStreets";

/**
 * NEXT STOPS — the two projects a reader is sent on to from the foot of a case
 * study, built as the home page's Side Streets grid so the way out of one
 * project looks like the way in to the rest.
 *
 * Always the two that follow the current one in the order below, wrapping
 * round, so every study points somewhere different and no study points at
 * itself. The order is the home page's: the three in Sights to See first, then
 * the rest.
 */

const STOPS: { slug: string; project: SideProject }[] = [
  {
    slug: "zenxo-strategy-builder",
    project: {
      title: "ZENXO | BUILDER",
      blurb: "A visual strategy builder for Indian options traders — a canvas beside the form it replaced.",
      href: "/work/zenxo-strategy-builder",
      thumb: "/case/zenxo/thumb.webp",
      thumbPosition: "center 38%",
      thumbAlt: "Two traders at a monitor showing the Zenxo results page.",
    },
  },
  {
    slug: "draw-the-line",
    project: {
      title: "DRAW THE LINE | WORKSHOP",
      blurb: "A two-day anti-bullying workshop for 33 government-school students, run with Going to School.",
      href: "/work/draw-the-line",
      thumb: "/case/draw-the-line/card.webp",
      thumbAlt: "The Draw the Line logo over a school corridor with students walking away down it",
    },
  },
  {
    slug: "titan-rebrand",
    project: {
      title: "TITAN | REBRAND",
      blurb: "A conceptual rebrand of Titan, India’s iconic eyewear brand, reimagined for the athletic market.",
      href: "/work/titan-rebrand",
      thumb: "/case/titan/thumb.webp",
      thumbPosition: "center 35%",
      thumbAlt: "A figure in goggles catching an ember reflection, the TITAN lockup across it.",
    },
  },
  {
    slug: "nagarhole-wayfinding",
    project: {
      title: "NAGARHOLE | SIGNAGE",
      blurb: "A signage system built to disappear into Nagarhole National Park — except where disappearing would be dangerous.",
      href: "/work/nagarhole-wayfinding",
      thumb: "/case/nagarhole/hero-leopard.webp",
      thumbPosition: "center 43%",
      thumbAlt: "A black leopard at the waterline, with the Nagarhole wordmark.",
    },
  },
  {
    slug: "ebb-headspace",
    project: {
      title: "EBB | MOTION",
      blurb: "A 55-second spec brand film for Headspace, introducing ebb — a calm-focused AI companion.",
      href: "/work/ebb-headspace",
      thumb: "/case/ebb/poster.webp",
      thumbAlt:
        "The closing frame of the ebb film: the character asleep above the Headspace lockup and the line “Calm can always find its way home.”",
    },
  },
];

export default function NextStops({ current }: { current: string }) {
  const at = STOPS.findIndex((s) => s.slug === current);
  const next = [1, 2].map((k) => STOPS[(at + k + STOPS.length) % STOPS.length].project);
  return <StreetSection id="next-stops" title="NEXT STOPS" lead="Not done" tail="yet?" projects={next} />;
}
