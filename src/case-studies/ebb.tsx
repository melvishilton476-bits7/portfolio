import type { CSSProperties } from "react";
import Beat, { P } from "@/components/case/Beat";
import CaseOverview from "@/components/case/CaseOverview";
import CaseYouTube from "@/components/case/CaseYouTube";

const PURPLE = "#8581ff";

/** The film's own runtime, in seconds — spoken by the play button. */
const RUNTIME = 55;
const VIDEO_ID = "UnPGHSczKy4";

/**
 * EBB — a spec motion piece for Headspace.
 *
 * The short page in this repo, deliberately. The other three case studies
 * argue a process: research, exploration, the decision that turned, the thing
 * that went wrong. This one has a film and an honest label on it. Dressing 55
 * seconds of self-directed spec work in the same apparatus would claim a
 * client engagement that never happened, so the page carries a header, the
 * film, a paragraph and the meta block, and stops.
 *
 * NO <CaseHero>. The hero's job is to put the best frame the project owns
 * above the copy — but the best frame here is the poster on the player, and a
 * hero plate would show the reader that same still twice in a row before
 * letting them press anything. So the header is text, and the film IS the
 * opening image: it sits at the top of the page holding its own poster.
 *
 * The Headspace name and lockup appear throughout the film. This page says so
 * in the first line of the meta block rather than in a footnote, because a
 * spec piece that has to be scrolled before it admits it is spec is doing
 * something else.
 */
export default function EbbCaseStudy() {
  return (
    <>
      <header className="pt-32 sm:pt-40">
        <div className="page-container">
          <div className="relative mx-auto max-w-[820px] text-center">
            {/* The hero's registration marks, kept even without the hero — they
                are the site's own, and the title still wants pinning. */}
            <span
              aria-hidden
              className="accent-flicker-a absolute -left-[10px] top-[54px] hidden size-[10px] lg:block"
              style={{ background: PURPLE, ["--enter" as string]: "0.5s" } as CSSProperties}
            />
            <span
              aria-hidden
              className="accent-flicker-b absolute -right-[10px] top-[54px] hidden size-[10px] lg:block"
              style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "0.7s" } as CSSProperties}
            />

            <p className="type-caption text-ink-muted uppercase tracking-[0.14em]">
              Motion — Spec
            </p>
            <h1 className="type-display text-ink-hero mt-5">ebb — Headspace</h1>
            <p
              className="type-lead mx-auto mt-6 max-w-[560px] text-balance"
              style={{ letterSpacing: "-0.02em", fontWeight: 300 }}
            >
              A short motion piece introducing ebb, Headspace&rsquo;s calm-focused companion.
            </p>
          </div>
        </div>
      </header>

      <div className="page-container flex flex-col gap-24 pb-32 pt-14 sm:gap-32 sm:pt-20">
        {/* Wider than the 620px reading measure and wider than a figure's 880:
            this is the page's whole argument, not an illustration of one. */}
        <div className="mx-auto w-full max-w-[980px]">
          <CaseYouTube
            id={VIDEO_ID}
            title="Headspace — Ebb | Finding Your Way Back to Stillness"
            poster="/case/ebb/poster.webp"
            posterAlt="The film's closing frame: the ebb character asleep above the Headspace lockup and the line “Calm can always find its way home”."
            seconds={RUNTIME}
          />
        </div>

        <Beat kicker="The film" title="Strip everything away and see what is left.">
          <P>
            A 55-second motion piece imagining ebb, a calm-focused companion for Headspace.
            The film opens in sensory overload — notifications, motion, static — and slowly
            strips away sound and clutter until only breath and calm remain.
          </P>
          <P>
            Self-directed spec project: script, animation, and edit all done solo in After
            Effects, with voice generated via ElevenLabs.
          </P>
        </Beat>

        <CaseOverview
          rows={[
            {
              label: "Role",
              value: "Solo — concept, script, animation, and edit in After Effects",
            },
            {
              label: "Team",
              value:
                "None. Personal spec piece using the Headspace brand, not commissioned by them",
            },
            { label: "Timeline", value: "~2 weeks" },
            {
              label: "Stage",
              value: "Self-published — posted on my reel, not a Headspace release",
            },
            { label: "Surface", value: "Personal reel / portfolio" },
            { label: "Voice", value: "Script written by me; VO generated via ElevenLabs" },
          ]}
          scope={["Motion Design", "Concept", "Scriptwriting", "Editing"]}
        />
      </div>
    </>
  );
}
