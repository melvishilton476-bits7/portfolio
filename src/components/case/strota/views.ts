import type { Size, TimelineJson, View } from "./timeline";
import firstSignal from "./clips/first-signal.timeline.json";
import home from "./clips/home.timeline.json";
import fieldLog from "./clips/field-log.timeline.json";
import verification from "./clips/verification.timeline.json";
import draftsFiling from "./clips/drafts-filing.timeline.json";
import draftsSubmit from "./clips/drafts-submit.timeline.json";
import stories from "./clips/stories.timeline.json";
import safety from "./clips/safety.timeline.json";
import profile from "./clips/profile.timeline.json";

/**
 * The nine phone views of the final handoff ("Phone views" table), each its
 * timeline JSON plus the CSS size of every @2x layer it draws.
 *
 * The content's size is read from the JSON; the bars' sizes are measured off
 * the PNGs (pixel size ÷ 2), since the JSON does not give them.
 */

const half = (w: number, h: number): Size => ({ w: w / 2, h: h / 2 });

/** Pixel sizes of the bars in public/case/strota/screens/<screen>/. The
 *  content's size comes from its timeline (`layers.content.height`), so a
 *  re-exported, re-cropped screen needs no change here. */
const BARS: Record<string, { topBar: Size; navbar: Size; queryBar?: Size }> = {
  "first-signal": { topBar: half(780, 138), navbar: half(780, 170) },
  home: { topBar: half(780, 138), navbar: half(762, 170) },
  "field-log": { topBar: half(780, 138), navbar: half(780, 170), queryBar: half(754, 304) },
  verification: { topBar: half(780, 138), navbar: half(780, 170), queryBar: half(754, 304) },
  "drafts-filing": { topBar: half(780, 138), navbar: half(780, 170) },
  safety: { topBar: half(780, 138), navbar: half(780, 170) },
  profile: { topBar: half(780, 138), navbar: half(780, 170) },
  stories: { topBar: half(780, 138), navbar: half(780, 170) },
};

/** The query bar's box position is only given in its note ("sits at x 17,
 *  y 625"), so it is read from there. */
function queryBox(json: TimelineJson) {
  const m = json.layers.queryBar?.note?.match(/x\s*(\d+(?:\.\d+)?),\s*y\s*(\d+(?:\.\d+)?)/);
  return m ? { x: Number(m[1]), y: Number(m[2]) } : undefined;
}

function view(raw: unknown): View {
  const json = raw as TimelineJson;
  const bars = BARS[json.screen];
  if (!bars) throw new Error(`Strota: no bar sizes for screen "${json.screen}"`);
  const content = { w: json.viewport.w, h: json.layers.content.height };
  return { ...json, sizes: { content, ...bars }, queryBox: queryBox(json) };
}

export const VIEWS = {
  firstSignal: view(firstSignal),
  home: view(home),
  fieldLog: view(fieldLog),
  verification: view(verification),
  draftsFiling: view(draftsFiling),
  draftsSubmit: view(draftsSubmit),
  stories: view(stories),
  safety: view(safety),
  profile: view(profile),
} as const;
