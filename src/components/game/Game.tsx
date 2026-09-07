"use client";

import type { ReactNode } from "react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import MoleFigure from "./MoleFigure";
import useGameClock from "./useGameClock";
import { getBest, getServerBest, recordBest, subscribeBest } from "./bestScore";
import {
  DURATION_MS,
  LIFE_MS_END,
  LIFE_MS_START,
  MAX_LIVE_END,
  MAX_LIVE_START,
  PEST_POINTS,
  PEST_RATIO,
  PET_PENALTY_MS,
  SIZES,
  SLOTS,
  SPAWN_JITTER,
  SPAWN_MS_END,
  SPAWN_MS_START,
  TICK_MS,
  ramp,
  type MoleKind,
} from "./constants";

type Phase = "idle" | "playing" | "over";

type Live = {
  id: number;
  slot: number;
  kind: MoleKind;
  /** Height multiplier — see SIZES. */
  size: number;
  /** Wall-clock ms at which it has finished retreating and can be dropped. */
  diesAt: number;
  /** Total time out, matched by the CSS `--life` on its keyframe. */
  life: number;
};

/** A "+10" or "−2s" left behind where a mole was struck. */
type Mark = { id: number; slot: number; text: string; kind: MoleKind; diesAt: number };

const MARK_MS = 650;

/**
 * Where each stand sits, as a percentage across the arena.
 *
 * Evenly spaced would read as a grid, which the game explicitly is not, so each
 * stand is nudged off the beat. The nudge is a hash of the index rather than
 * `Math.random`, so the server and the client agree on the same ground and
 * hydration has nothing to argue about.
 */
const STAND = Array.from({ length: SLOTS }, (_, i) => {
  const even = 8 + (84 * i) / (SLOTS - 1);
  return even + (((i * 7919) % 11) - 5) * 0.55;
});

/**
 * Pixel Pests & Pixel Pets — sixty seconds, ten points a pest, two seconds off
 * the clock for every pet you take down with them.
 *
 * THE LOOP DOES NOT RUN PER FRAME. A mole's entire journey — up, hold, back
 * down — is one CSS keyframe on a transform, which the compositor owns, so
 * React is not involved in any of the motion. The 10Hz tick below only decides
 * when a mole is born, when a dead one can be dropped, and when the displayed
 * second changes; each of those bails out of its own state update when nothing
 * has actually changed, so a quiet second of play re-renders this component
 * once, not six hundred times.
 *
 * `brief` — the instructions and the two-character legend — is handed in from
 * the server component rather than built here. Children passed down from a
 * server parent stay server-rendered even though this component decides
 * whether to show them, so the how-to-play copy is still in the HTML and costs
 * the client bundle nothing. It is only up before a round: once the moles are
 * out you are reading the arena, not the instructions, and the space it frees
 * goes straight to the arena, because that is the part that grows.
 *
 * Time is read from `Date.now()` against a deadline rather than counted down a
 * tick at a time: intervals drift, background tabs throttle them to about a
 * second, and the pet penalty is then just an adjustment to the deadline
 * instead of a special case in the counter.
 */
export default function Game({ brief }: { brief?: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [secs, setSecs] = useState(Math.round(DURATION_MS / 1000));
  const [moles, setMoles] = useState<Live[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [beaten, setBeaten] = useState(false);
  const best = useSyncExternalStore(subscribeBest, getBest, getServerBest);

  /* Round bookkeeping the render never reads, so it lives in refs and changing
     it costs nothing. */
  const deadline = useRef(0);
  const startedAt = useRef(0);
  const nextSpawn = useRef(0);
  const seq = useRef(0);
  /* The tick needs to know the score to bank it when time runs out, and must
     not be re-created every time the score changes. */
  const scoreRef = useRef(0);

  /* WHO IS ON STAGE, MIRRORED OUT OF STATE. The tick has to read the roster to
     decide the next one, and it cannot do that inside a `setMoles` updater:
     updaters must be pure, StrictMode calls them twice to prove it, and the
     first version of this advanced `nextSpawn` in there — so the second call
     saw a spawn that had "already happened", took the other branch, and threw
     every mole away before it reached the screen. Deciding out here against a
     mirror keeps the updater a plain assignment, and lets a quiet tick skip
     setState altogether. */
  const roster = useRef<Live[]>([]);
  const showMoles = useCallback((next: Live[]) => {
    roster.current = next;
    setMoles(next);
  }, []);

  const finish = useCallback(() => {
    setPhase("over");
    showMoles([]);
    setMarks([]);
    setSecs(0);
    setBeaten(recordBest(scoreRef.current));
  }, [showMoles]);

  const start = useCallback(() => {
    const now = Date.now();
    startedAt.current = now;
    deadline.current = now + DURATION_MS;
    /* A beat of air before the first mole, so the round does not open with
       something already halfway out of the ground. */
    nextSpawn.current = now + 450;
    scoreRef.current = 0;
    setScore(0);
    showMoles([]);
    setMarks([]);
    setSecs(Math.round(DURATION_MS / 1000));
    setBeaten(false);
    setPhase("playing");
  }, [showMoles]);

  const tick = useCallback(() => {
    const now = Date.now();
    const left = deadline.current - now;
    if (left <= 0) {
      finish();
      return;
    }

    /* Whole seconds only. React bails out when the number is unchanged, so this
       re-renders sixty times a round rather than six hundred. */
    setSecs(Math.ceil(left / 1000));

    /* Difficulty rides wall-clock elapsed, not time remaining: the pet penalty
       moves the deadline, and keying the ramp off `left` would make a mistake
       jump the game forward in difficulty as well as cost the seconds. */
    const progress = (now - startedAt.current) / DURATION_MS;

    setMarks((prev) =>
      prev.some((m) => m.diesAt <= now) ? prev.filter((m) => m.diesAt > now) : prev,
    );

    const current = roster.current;
    /* Identical to `current` when nothing has retreated, which is what lets the
       whole update be skipped below. */
    let next = current.some((m) => m.diesAt <= now)
      ? current.filter((m) => m.diesAt > now)
      : current;

    if (now >= nextSpawn.current) {
      const gap = ramp(SPAWN_MS_START, SPAWN_MS_END, progress);
      nextSpawn.current = now + gap * (1 + (Math.random() * 2 - 1) * SPAWN_JITTER);

      const ceiling = Math.round(ramp(MAX_LIVE_START, MAX_LIVE_END, progress));
      /* One mole to a stand. Choosing among the free stands is what guarantees
         two never overlap into a single ambiguous target. */
      const taken = new Set(next.map((m) => m.slot));
      const free = STAND.map((_, i) => i).filter((i) => !taken.has(i));

      if (next.length < ceiling && free.length) {
        const life = ramp(LIFE_MS_START, LIFE_MS_END, progress);
        next = [
          ...next,
          {
            id: ++seq.current,
            slot: free[Math.floor(Math.random() * free.length)],
            kind: Math.random() < PEST_RATIO ? "pest" : "pet",
            size: SIZES[Math.floor(Math.random() * SIZES.length)],
            diesAt: now + life,
            life,
          },
        ];
      }
    }

    if (next !== current) showMoles(next);
  }, [finish, showMoles]);

  useGameClock(phase === "playing", TICK_MS, tick);

  const whack = useCallback(
    (mole: Live) => {
      const now = Date.now();
      showMoles(roster.current.filter((m) => m.id !== mole.id));

      if (mole.kind === "pest") {
        scoreRef.current += PEST_POINTS;
        setScore(scoreRef.current);
      } else {
        deadline.current -= PET_PENALTY_MS;
      }

      setMarks((prev) => [
        ...prev,
        {
          id: ++seq.current,
          slot: mole.slot,
          kind: mole.kind,
          text: mole.kind === "pest" ? `+${PEST_POINTS}` : `\u2212${PET_PENALTY_MS / 1000}s`,
          diesAt: now + MARK_MS,
        },
      ]);
    },
    [showMoles],
  );

  const playing = phase === "playing";

  return (
    <div className="pp">
      {/* ---- Scoreboard ----------------------------------------------------
          At the top of the section, under the title: it is a readout, and a
          readout belongs where the eye starts rather than tucked against the
          arena it describes. */}
      <div className="pp-hud type-caption text-ink">
        <span>
          <span className="text-ink-muted">SCORE</span> {String(score).padStart(3, "0")}
        </span>
        <span className="pp-hud__best text-ink-muted">BEST {String(best).padStart(3, "0")}</span>
        <span data-low={playing && secs <= 10 ? "1" : undefined}>
          <span className="text-ink-muted">TIME</span> {Math.floor(secs / 60)}:
          {String(secs % 60).padStart(2, "0")}
        </span>
      </div>

      {/* How to play — up until the first mole, and back again at the end. */}
      {!playing && brief}

      {/* ---- Arena --------------------------------------------------------- */}
      {/* `data-cursor-mallet` is the whole hook-up for the pointer: the site
          cursor swaps its dot for a mallet inside this box and swings it on
          press. Nothing here has to know the cursor exists. */}
      <div className="pp-arena" data-cursor-mallet>
        {playing &&
          moles.map((mole) => (
            <button
              key={mole.id}
              type="button"
              className="pp-mole"
              style={{
                left: `${STAND[mole.slot]}%`,
                ["--mole-w" as string]: `calc(var(--pp-mole) * ${mole.size})`,
                ["--life" as string]: `${Math.round(mole.life)}ms`,
              }}
              /* pointerdown, not click: it fires on the way down rather than
                 on release, which is about 100ms earlier, and it covers mouse
                 and touch through one path. */
              onPointerDown={(e) => {
                e.preventDefault();
                whack(mole);
              }}
              aria-label={mole.kind === "pest" ? "Pixel pest" : "Pixel pet"}
            >
              <MoleFigure kind={mole.kind} />
            </button>
          ))}

        {marks.map((m) => (
          <span
            key={m.id}
            aria-hidden
            className="pp-mark type-caption"
            data-kind={m.kind}
            style={{ left: `${STAND[m.slot]}%` }}
          >
            {m.text}
          </span>
        ))}

        {phase === "idle" && (
          <div className="pp-overlay">
            <button type="button" className="pp-btn type-caption" onClick={start}>
              START
            </button>
            <p className="type-caption text-ink-muted">60 SECONDS · GO</p>
          </div>
        )}

        {phase === "over" && (
          <div className="pp-overlay">
            <div className="pp-card">
              <p className="type-caption text-ink-muted">TIME UP</p>
              <p className="pp-card__score">{score}</p>
              <p className="type-caption text-ink-muted">
                {beaten ? "NEW BEST" : `BEST ${best}`}
              </p>
              <button type="button" className="pp-btn type-caption" onClick={start}>
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>

      {/* The ground the moles stand on: full-bleed, so the line runs off both
          edges of the screen the way the design draws it. */}
      <div aria-hidden className="pp-ground" />
    </div>
  );
}
