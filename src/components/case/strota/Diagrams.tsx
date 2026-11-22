import Connectors, { type Link } from "./Connectors";

/**
 * The two hub diagrams on the Strota page — "one story, five channels" (Figma
 * 35:93) and the Five Whys (40:197) — built as HTML boxes over one SVG of
 * connectors rather than exported as pictures, so the copy stays real text
 * and stays sharp.
 *
 * Both are drawn on their Figma artboard's own coordinates (1100 wide) inside
 * a box that keeps the artboard's ratio, so the boxes (placed in percent) and
 * the connectors (in the SVG's viewBox) scale together and always meet. Below
 * md the canvas would shrink the copy past reading, so each diagram drops to
 * a plain stack that says the same thing in the same order.
 */

type Box = { x: number; y: number; w: number; h: number };

/** Absolute placement on the artboard, as percentages of it. */
const place = (b: Box, W: number, H: number): React.CSSProperties => ({
  left: `${(b.x / W) * 100}%`,
  top: `${(b.y / H) * 100}%`,
  width: `${(b.w / W) * 100}%`,
  height: `${(b.h / H) * 100}%`,
});

/* ── One story, five channels ───────────────────────────────────────────── */

const CH_W = 1100;
const CH_H = 400;

const CHANNELS: { name: string; carries: string; box: Box }[] = [
  { name: "WhatsApp", carries: "the voice note", box: { x: 60, y: 30, w: 220, h: 60 } },
  { name: "Camera roll", carries: "the photos", box: { x: 60, y: 300, w: 220, h: 60 } },
  { name: "Phone call", carries: "the urgency", box: { x: 820, y: 30, w: 220, h: 60 } },
  { name: "Email", carries: "the brief", box: { x: 820, y: 300, w: 220, h: 60 } },
  { name: "Notes", carries: "extra context", box: { x: 440, y: 330, w: 220, h: 60 } },
];

const STORY: Box = { x: 440, y: 165, w: 220, h: 70 };

const CH_LINKS: Link[] = [
  { from: [280, 60], to: [440, 189.5] },
  { from: [280, 330], to: [440, 210.5] },
  { from: [820, 60], to: [660, 189.5] },
  { from: [820, 330], to: [660, 210.5] },
  { from: [550, 235], to: [550, 330] },
];

function StoryCard({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 border-[1.5px] border-solid border-[#4a90e2] bg-white ${className}`}
      style={style}
    >
      <span className="type-caption uppercase tracking-[0.04em] text-ink-muted">7:42 PM</span>
      <span className="font-display text-[1.125rem] font-medium leading-[1.2] text-ink">One breaking story</span>
    </div>
  );
}

function ChannelCard({ name, carries, className = "", style }: { name: string; carries: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-0.5 border border-solid border-[#d9d9d9] bg-white text-center ${className}`}
      style={style}
    >
      <span className="type-caption uppercase tracking-[0.04em] text-ink">{name}</span>
      <span className="type-caption-prose text-ink-muted">{carries}</span>
    </div>
  );
}

export function ChannelsDiagram() {
  return (
    <figure className="m-0" aria-label="One breaking story at 7:42 PM, split across five channels: WhatsApp carries the voice note, the camera roll the photos, a phone call the urgency, email the brief and notes the extra context.">
      <div className="relative mx-auto hidden w-full max-w-[1100px] md:block" style={{ aspectRatio: `${CH_W} / ${CH_H}` }}>
        <Connectors w={CH_W} h={CH_H} links={CH_LINKS} />
        <StoryCard className="absolute" style={place(STORY, CH_W, CH_H)} />
        {CHANNELS.map((c) => (
          <ChannelCard key={c.name} name={c.name} carries={c.carries} className="absolute" style={place(c.box, CH_W, CH_H)} />
        ))}
      </div>

      <div className="flex flex-col items-center md:hidden">
        <StoryCard className="h-[70px] w-full max-w-[260px]" />
        <span aria-hidden className="h-6 w-px bg-[#8a8a8a]" />
        <div className="grid w-full grid-cols-2 gap-2.5">
          {CHANNELS.map((c) => (
            <ChannelCard key={c.name} name={c.name} carries={c.carries} className="h-[60px]" />
          ))}
        </div>
      </div>
    </figure>
  );
}

/* ── Five Whys ──────────────────────────────────────────────────────────── */

const WH_W = 1100;
const WH_H = 640;

/** Badge colours as drawn: the site's orange, periwinkle, ink and amber. */
const WHYS: { n: number; text: string; box: Box; badge: [number, number]; color: string }[] = [
  { n: 1, text: "Coordination breaks down under pressure.", box: { x: 60, y: 70, w: 210, h: 102 }, badge: [38, 48], color: "#e8792b" },
  { n: 2, text: "Updates arrive scattered across channels.", box: { x: 100, y: 360, w: 210, h: 102 }, badge: [78, 338], color: "#8581ff" },
  { n: 3, text: "Formal tools slow reporters down, so they go informal.", box: { x: 445, y: 456, w: 210, h: 123 }, badge: [423, 434], color: "#2c2c2c" },
  { n: 4, text: "Systems are designed top-down, without reporter input.", box: { x: 790, y: 360, w: 210, h: 123 }, badge: [992, 338], color: "#f5a524" },
  { n: 5, text: "Tools are built for publishing and assume clean input.", box: { x: 830, y: 70, w: 210, h: 123 }, badge: [1032, 48], color: "#8581ff" },
];

const ROOT: Box = { x: 360, y: 220, w: 380, h: 140 };
const START: Box = { x: 350, y: 60, w: 400, h: 63 };

const WH_LINKS: Link[] = [
  { from: [270, 121], to: [360, 262] },
  { from: [310, 411], to: [360, 318] },
  { from: [550, 360], to: [550, 456] },
  { from: [790, 421.5], to: [740, 318] },
  { from: [830, 131.5], to: [740, 262] },
];

const STARTING_POINT =
  "Starting point: a breaking story is stressful to coordinate from the field. Each why led to the next, and all of them pointed at the same gap.";

function Badge({ n, color, className = "", style }: { n: number; color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`flex items-center justify-center type-caption text-white ${className}`}
      style={{ background: color, ...style }}
    >
      {n}
    </span>
  );
}

function WhyCard({ n, text, className = "", style }: { n: number; text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`flex flex-col gap-2 border border-solid border-[#d9d9d9] bg-white p-[18px] ${className}`} style={style}>
      <span className="type-caption uppercase tracking-[0.04em] text-ink-muted">WHY {n}</span>
      <span className="type-caption-prose text-ink">{text}</span>
    </div>
  );
}

function RootCard({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2.5 border border-solid border-[#424242] bg-white px-8 py-7 text-center ${className}`}
      style={style}
    >
      <span className="type-caption uppercase tracking-[0.04em] text-[#e8792b]">ROOT CAUSE</span>
      <span className="max-w-[300px] type-caption-prose font-medium text-ink">
        No structured layer between the field and publishing.
      </span>
    </div>
  );
}

export function FiveWhys() {
  return (
    <figure className="m-0">
      <div className="relative mx-auto hidden w-full max-w-[1100px] md:block" style={{ aspectRatio: `${WH_W} / ${WH_H}` }}>
        <Connectors w={WH_W} h={WH_H} links={WH_LINKS} />
        <p
          className="absolute m-0 text-center type-caption-prose text-ink-muted"
          style={place(START, WH_W, WH_H)}
        >
          {STARTING_POINT}
        </p>
        <RootCard className="absolute" style={place(ROOT, WH_W, WH_H)} />
        {WHYS.map((w) => (
          <div key={w.n}>
            <WhyCard n={w.n} text={w.text} className="absolute" style={{ ...place(w.box, WH_W, WH_H), height: "auto", minHeight: `${(w.box.h / WH_H) * 100}%` }} />
            <Badge
              n={w.n}
              color={w.color}
              className="absolute"
              style={place({ x: w.badge[0], y: w.badge[1], w: 30, h: 30 }, WH_W, WH_H)}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        <p className="m-0 text-center type-caption-prose text-ink-muted">{STARTING_POINT}</p>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {WHYS.map((w) => (
            <li key={w.n} className="relative pl-3 pt-3">
              <Badge n={w.n} color={w.color} className="absolute left-0 top-0 size-[30px]" />
              <WhyCard n={w.n} text={w.text} />
            </li>
          ))}
        </ol>
        <RootCard className="mt-2" />
      </div>
    </figure>
  );
}
