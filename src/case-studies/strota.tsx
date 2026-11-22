import Image from "next/image";
import CaseHero from "@/components/case/CaseHero";
import Beat, { P } from "@/components/case/Beat";
import CaseKicker from "@/components/case/CaseKicker";
import CaseOverview from "@/components/case/CaseOverview";
import DashRule from "@/components/DashRule";
import Highlight from "@/components/case/Highlight";
import { BoilDefs } from "@/components/case/BoiledArt";
import ScrubText from "@/components/case/ScrubText";
import Phone from "@/components/case/strota/Phone";
import HowRow, { type RowLayout, type RowSpec } from "@/components/case/strota/HowRow";
import UiFilm, { type FilmPhone } from "@/components/case/strota/UiFilm";
import how1 from "@/components/case/strota/layouts/how-1-742.json";
import how2 from "@/components/case/strota/layouts/how-2-810.json";
import how3 from "@/components/case/strota/layouts/how-3-930.json";
import how4 from "@/components/case/strota/layouts/how-4-1015.json";
import how5 from "@/components/case/strota/layouts/how-5-safety.json";
import { ChannelsDiagram, FiveWhys } from "@/components/case/strota/Diagrams";
import { fromTop, untilFirstScroll } from "@/components/case/strota/timeline";
import { VIEWS } from "@/components/case/strota/views";

/**
 * STROTA — a phone app for field reporters and a dashboard for the desk they
 * report to, so a breaking story has one home from the first voice note to
 * the draft.
 *
 * Built from the v4 Figma page (Strota — Case Study Page, node 35:78) and the
 * handoff that came with it. All copy is the Figma text layers verbatim; the
 * layout is the site's own case-study vocabulary (crop-mark kickers, two-column
 * spreads, full-bleed dashed rules, the Zenxo ruled table) so the page reads
 * as one of the set rather than a pasted-in design.
 *
 * Colour: the site's ink and grey tokens throughout. Strota's orange (#E8792B)
 * is kept for what is Strota's own — the time labels on each step, "The call",
 * the Solution headline — so it reads as the product's voice, not the site's.
 *
 * Built from the final handoff (strota-handoff/HANDOFF.md, Figma frame
 * 154:1870): How it works rows are composed from layouts/how-*.json, the
 * Solution clip opens with a camera film, and every phone is the flat frame.
 *
 * Open (the author's): whether d_complete belongs in the hero (the hero is
 * the photo for now, so it is not shown).
 */

/** Strota's own accent, from the handoff. */
const ORANGE = "#e8792b";

/** The page's 1100px measure inside the site container — the Figma artboard's
 *  content width. */
const MEASURE = "mx-auto w-full max-w-[1100px]";

/** Section heads: the redraw's heading voice, as Zenxo sets it. */
const HEAD: React.CSSProperties = {
  fontWeight: 400,
  lineHeight: 1.3,
  letterSpacing: "-0.02em",
};

/** Running copy for the two-column spreads (as on Zenxo). */
function Body({ children, className = "", justify = true }: { children: React.ReactNode; className?: string; justify?: boolean }) {
  return (
    <p
      className={`${justify ? "prose-justified" : ""} text-pretty ${className}`}
      style={{ fontSize: "0.9375rem", lineHeight: 1.6, fontWeight: 300, color: "var(--color-ink)" }}
    >
      {children}
    </p>
  );
}

/** Heading left, body across from it: the spread every section opens on. */
function Spread({ head, children, scrub }: { head: string; children: React.ReactNode; scrub?: boolean }) {
  return (
    <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-x-28">
      {scrub ? (
        <ScrubText
          text={head}
          on={ORANGE}
          off="#c1c1c1"
          className="font-display max-w-[640px] text-balance"
          style={{ ...HEAD, fontSize: "clamp(1.75rem, 1.1rem + 2vw, 2.75rem)", lineHeight: 1.15 }}
        />
      ) : (
        <h2 className="type-subheading text-ink-alt max-w-[460px] text-balance" style={HEAD}>
          {head}
        </h2>
      )}
      <div className="lg:mt-1">{children}</div>
    </div>
  );
}

/* ── Research: the ruled insights table ───────────────────────────────── */

/** Same ink and rhythm as <DashRule>, stood on end. */
const DASH_V =
  "repeating-linear-gradient(to bottom, rgba(23,23,23,0.16) 0px, rgba(23,23,23,0.16) 10px, transparent 10px, transparent 18px)";

const EAGER = { threshold: 0, rootMargin: "0px 0px 12% 0px" } as const;

/** Two full-bleed hairlines 50px apart, where the table opens and closes. */
function DoubleRule() {
  return (
    <div aria-hidden className="relative hidden h-[50px] lg:block">
      <DashRule edge="top" {...EAGER} />
      <DashRule edge="bottom" {...EAGER} />
    </div>
  );
}

const THIRDS = ["calc(100% / 3)", "calc(200% / 3)"] as const;

const INSIGHTS = [
  {
    label: "01 — Before the CMS",
    img: { src: "/case/strota/diagrams/illustration-pile.png", w: 201, h: 201 },
    alt: "A hand reaching up out of a heap of loose papers",
    saw: "Newsroom systems work once a story is structured, not while it’s being gathered.",
    meant: "The gap sits before publishing, not at it.",
  },
  {
    label: "02 — Chat is the system",
    img: { src: "/case/strota/diagrams/illustration-chat.png", w: 193, h: 193 },
    alt: "A phone open on an office chat, with message bubbles and a call icon spilling out of it",
    saw: "Voice notes, photos and updates live in WhatsApp and calls that nobody else can see.",
    meant: "A new home has to be as quick as a chat, or reporters won’t leave the chat.",
  },
  {
    label: "03 — Lost in switching",
    img: { src: "/case/strota/diagrams/illustration-switching.png", w: 176, h: 264 },
    alt: "A figure with many arms juggling a phone, a laptop, a keyboard, notes and a chart at once",
    saw: "Under pressure, information arrives scattered and time goes on moving between apps.",
    meant: "The problem isn’t a missing tool. It’s the gaps between tools.",
  },
] as const;

function Insights() {
  return (
    <section aria-label="Insights">
      {/* A live line boil on the three drawings, each on its own rhythm, as
          the hand-drawn art elsewhere on the site does. Off under reduced
          motion (globals.css → .strota-boil). */}
      <BoilDefs id="strota-insights" count={INSIGHTS.length} />
      <DoubleRule />
      <div className="relative grid grid-cols-1 gap-y-14 py-10 lg:grid-cols-3 lg:gap-y-0 lg:py-0">
        {THIRDS.map((x) => (
          <span key={x} aria-hidden className="pointer-events-none absolute inset-y-0 hidden w-px lg:block" style={{ left: x, backgroundImage: DASH_V }} />
        ))}
        {THIRDS.flatMap((x) =>
          (["top", "bottom"] as const).map((edge) => (
            <span
              key={`${x}-${edge}`}
              aria-hidden
              className="pointer-events-none absolute z-10 hidden size-[7px] rounded-full bg-[#171717] lg:block"
              style={{ left: x, [edge]: 0, transform: `translate(-50%, ${edge === "top" ? "-50%" : "50%"})` }}
            />
          )),
        )}
        {INSIGHTS.map((ins, i) => (
          <article key={ins.label} className="flex flex-col lg:px-[clamp(20px,3vw,48px)] lg:py-[60px]">
            <div className="flex h-[200px] items-end justify-center lg:h-[264px]">
              <Image
                src={ins.img.src}
                alt={ins.alt}
                width={ins.img.w}
                height={ins.img.h}
                sizes="264px"
                className="strota-boil h-auto max-h-full w-auto object-contain"
                style={{ filter: `url(#boil-strota-insights-${i})` }}
              />
            </div>
            <h3 className="mt-6 font-display text-[1.125rem] font-medium uppercase leading-[1.45] tracking-[0.01em] text-ink">
              {ins.label}
            </h3>
            <div className="mt-3.5 flex flex-col gap-3.5 type-caption-prose text-ink-muted">
              <p className="m-0">
                <span className="text-ink">What we saw:</span> {ins.saw}
              </p>
              <p className="m-0">
                <span className="text-ink">What it meant:</span> {ins.meant}
              </p>
            </div>
          </article>
        ))}
      </div>
      <DoubleRule />
    </section>
  );
}

/* ── How it works ─────────────────────────────────────────────────────── */

/** A single dashed line across the whole page, between rows. */
function StepRule() {
  return (
    <div aria-hidden className="relative h-px">
      <DashRule edge="top" />
    </div>
  );
}

/** The five rows, each composed from its Figma layout file. Copy is the
 *  layout's own text layers. */
const ROWS: RowSpec[] = [
  {
    layout: how1 as unknown as RowLayout,
    // Record, waveform, stop: the part of First Signal's clip that happens on
    // its resting frame. The screen does not scroll in this row.
    views: { home: VIEWS.home, "first-signal": untilFirstScroll(VIEWS.firstSignal) },
    side: "left",
    time: "7:42 PM · In the field",
    title: "The first update takes one screen, not four apps.",
    body: "Voice first, media one tap below, beat and urgency as taps. The goal: urgent news to the desk in under ten seconds, without a form.",
    call: ["A form gives the desk clean data and loses the reporter.", "So voice comes first, and structure is added by tapping."],
    notes: ["phone:first-signal", "phone:first-signal", "phone:first-signal"],
    lines: ["phone:first-signal", "phone:first-signal", "phone:first-signal"],
  },
  {
    layout: how2 as unknown as RowLayout,
    views: { stories: VIEWS.stories, "field-log": VIEWS.fieldLog },
    side: "right",
    time: "8:10 PM · The story grows",
    title: "Every update lands in the story, not in a chat.",
    body: "Once sent, a signal becomes a story. Updates, photos, audio and a senior reporter’s notes collect in its Field Log.",
    call: ["Chats are organised by people, so one story gets split across every conversation.", "So the story, not the conversation, is the container."],
    extraNotes: [
      { n: "02", title: "Mentoring, inside the story", desc: "Seniors guide juniors in the same log.", box: [450, 149.2, 240, 47] },
    ],
    notes: ["phone:field-log", "phone:field-log", "card:fl_query"],
    lines: ["phone:field-log", "phone:field-log", "card:fl_query"],
  },
  {
    layout: how3 as unknown as RowLayout,
    views: { verification: VIEWS.verification },
    side: "left",
    time: "9:30 PM · Before the draft",
    title: "Checks happen in the field, while gaps can still be filled.",
    body: "Verification is the Field Log’s third tab, not a step after the draft. A missing number doesn’t mean another call once the reporter has left",
    call: ["At the desk, a missing number means another call to a reporter who has already left.", "So verification happens in the field, inside the log."],
    notes: ["card:v_progress", "card:v_critical", "card:v_save"],
    lines: ["card:v_progress", "card:v_critical", "card:v_save"],
  },
  {
    layout: how4 as unknown as RowLayout,
    views: { "drafts-submit": VIEWS.draftsSubmit, "drafts-filing": VIEWS.draftsFiling },
    side: "right",
    time: "10:15 PM · Filing",
    title: "The draft builds itself from the log.",
    body: "A completeness check reads the same log, so it names exactly what’s missing before the draft goes to the CMS. Nothing gets typed twice.",
    call: ["Every fact was already captured once, in the field.", "So the draft is written from the log, and the check names exactly what’s missing."],
    notes: ["card:d_complete", "card:d_auto"],
    lines: ["card:d_complete", "card:d_auto"],
    // The 200-wide phone inside its 260 × 230 window, top part only.
    cropped: { "drafts-filing": { phoneW: 200, dx: 30, dy: 14 } },
  },
  {
    layout: how5 as unknown as RowLayout,
    views: { safety: VIEWS.safety, profile: VIEWS.profile },
    side: "left",
    time: "Throughout · Safety",
    title: "Safety stays in the reporter’s hands.",
    body: "The emergency signal, live location and check-ins sit one screen from the work, and the reporter controls what the bureau sees.",
    call: ["Bureau Chiefs need to know reporters are safe. Reporters don’t want to feel watched.", "So every tracking setting belongs to the reporter."],
    notes: ["card:p_visibility", "card:p_protocol"],
    lines: [],
  },
];

/** The order the three roles were designed in (Figma 154:2127): boxes joined
 *  by short connectors with ring nodes at each end. */
const ROLES = [
  { name: "Junior reporter", order: "Designed 1st", lead: true },
  { name: "Senior reporter", order: "Designed 2nd" },
  { name: "Bureau Chief", order: "Designed 3rd" },
] as const;

function Link52() {
  return (
    <svg aria-hidden width="60" height="8" viewBox="0 0 60 8" className="mt-4 hidden shrink-0 sm:block">
      <path d="M4 4 H56" stroke="#8a8a8a" strokeWidth="1" />
      <circle cx="4" cy="4" r="3" fill="#fff" stroke="#2c2c2c" strokeWidth="1" />
      <circle cx="56" cy="4" r="3" fill="#fff" stroke="#2c2c2c" strokeWidth="1" />
    </svg>
  );
}

function DesignedBottomUp() {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,690px)_minmax(0,330px)] lg:justify-between">
      {/* A row of three from sm up; on a phone the boxes stack and drop the links. */}
      <ol className="m-0 flex list-none flex-col gap-y-4 p-0 sm:flex-row sm:items-start">
        {ROLES.map((r, i) => (
          <li key={r.name} className="flex items-start">
            {i > 0 ? <Link52 /> : null}
            <div className="flex flex-col gap-2.5">
              <span
                className="flex h-10 w-[220px] items-center justify-center whitespace-nowrap border border-solid bg-white px-3 type-caption-prose text-ink sm:w-[min(190px,22vw)]"
                style={{ borderColor: "lead" in r ? ORANGE : "#d9d9d9", borderWidth: "lead" in r ? 1.5 : 1 }}
              >
                {r.name}
              </span>
              <span
                className="type-caption uppercase leading-[1.2] tracking-[0.04em]"
                style={{ color: "lead" in r ? ORANGE : "var(--color-ink-muted)" }}
              >
                {r.order}
              </span>
            </div>
          </li>
        ))}
      </ol>
      <p className="m-0 type-caption-prose text-ink lg:mt-1">
        Everything the desk sees starts with something a reporter puts in, so we designed from the reporter up.
      </p>
    </div>
  );
}

/* ── Solution: the UI clip and its intro film ─────────────────────────── */

const FILM_PHONES: FilmPhone[] = [
  { n: "01", title: "One update instead of four", body: "Voice, photos, beat and urgency leave the field together.", view: fromTop(VIEWS.firstSignal), alt: "First Signal" },
  { n: "02", title: "Verification in the field", body: "Checks live inside the story’s log.", view: fromTop(VIEWS.verification), alt: "Verification" },
  { n: "03", title: "A draft from the log", body: "Nothing gets retyped.", view: fromTop(VIEWS.draftsFiling), alt: "Drafts & Filing" },
  { n: "04", title: "Safety the reporter controls", body: "They choose who sees their location.", view: fromTop(VIEWS.safety), alt: "Safety" },
];

function UiClip() {
  return (
    // The Figma frame's own warm wash (image 15, 154:2056) behind the clip,
    // cropped the way the frame crops it: the band shows the image from about
    // a third of the way down.
    <section
      aria-label="Strota's four core screens"
      className="relative overflow-hidden bg-[#f8ecdd] pb-8 pt-14"
      style={{
        backgroundImage: "url(/case/strota/solution-ground.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "50% 33%",
      }}
    >
      <div className="page-container">
        <div className="mx-auto w-full max-w-[1100px]">
          <UiFilm phones={FILM_PHONES} />
        </div>
      </div>
    </section>
  );
}

/* ── Outcomes: the 7:42 note, recorded, then inside its story ─────────── */

function Payoff() {
  return (
    <div className="mt-14 flex flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-start sm:gap-0">
      {(
        [
          [VIEWS.firstSignal, "7:42 PM · Recorded", "First Signal, the voice note recorded"],
          [VIEWS.fieldLog, "8:10 PM · Inside its story", "Field Log, the same note inside its story"],
        ] as const
      ).map(([view, caption, alt], i) => (
        <div key={caption} className="flex items-start">
          {i > 0 ? (
            <svg aria-hidden width="136" height="8" viewBox="0 0 136 8" className="mx-0 mt-[188px] hidden sm:block">
              <path d="M38 4 H98" stroke="#8a8a8a" strokeWidth="1" />
              <circle cx="38" cy="4" r="3" fill="#fff" stroke="#2c2c2c" strokeWidth="1" />
              <circle cx="98" cy="4" r="3" fill="#fff" stroke="#2c2c2c" strokeWidth="1" />
            </svg>
          ) : null}
          <figure className="m-0 w-[180px]">
            <Phone view={view} mode="static" alt={alt} />
            <figcaption className="mt-4 text-center type-caption uppercase tracking-[0.04em] text-ink-muted">
              {caption}
            </figcaption>
          </figure>
        </div>
      ))}
    </div>
  );
}

export default function StrotaCaseStudy() {
  return (
    <>
      <CaseHero
        eyebrow="Product design · Strota · College project"
        title="STROTA"
        dek="News doesn’t break in a CMS. It breaks in the field. Strota gives a story one home before it gets there."
        dekTone="ink"
        dekWidth={560}
        titleMarks
        frameLabel="The Strota Stories screen on a phone, lying on a sunlit wooden desk beside a keyboard"
        image={{ src: "/case/strota/hero.jpg", ratio: 1100 / 620 }}
        fade={false}
      />

      {/* ── PROBLEM ─────────────────────────────────────────────────────── */}
      <div className="page-container pt-24 sm:pt-28">
        <section className={MEASURE}>
          <Spread head="Reporters weren’t short of tools. They were losing time moving between them.">
            <Body>
              A story breaks at 7:42 PM as a reporter’s voice note. By morning, it is in print. In between, its pieces
              live across WhatsApp, the camera roll, email, phone calls and notes.
            </Body>
          </Spread>
          <div className="mt-14 sm:mt-16">
            <ChannelsDiagram />
          </div>
          <p className="type-caption-prose mx-auto mt-12 max-w-[780px] text-center text-ink-muted">
            One story, five channels, no shared record. At that speed, remembering where everything is becomes work in
            itself.
          </p>
        </section>
      </div>

      {/* ── RESEARCH ────────────────────────────────────────────────────── */}
      <div className="page-container pt-28 sm:pt-36">
        <section className={MEASURE}>
          <CaseKicker>Research</CaseKicker>
          <div className="mt-12">
            <Spread head="We watched how newsrooms work under pressure.">
              <Body justify={false}>
                The project was inspired by Khabar Lahariya, a rural newsroom we came across through the documentary
                Writing With Fire. It made us ask what any newsroom needs when the reporting happens in the field.
              </Body>
            </Spread>
          </div>

          <dl className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {(
              [
                ["8", "interviews with reporters, editors and bureau staff"],
                ["6", "national and regional newsrooms, incl. HT, NDTV, TOI"],
                ["4", "newsroom tools reviewed, incl. Wolftech and AP ENPS"],
              ] as const
            ).map(([n, what]) => (
              <div key={what} className="flex flex-col-reverse gap-2">
                <dt className="max-w-[300px] type-caption-prose text-ink-muted">{what}</dt>
                <dd className="m-0 font-display text-[4.5rem] font-light leading-none tracking-[-0.03em] text-ink">{n}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 text-center font-display text-[1.1875rem] leading-[1.6] tracking-[-0.5px] text-ink">
            <p className="m-0">What they said, again and again:</p>
            <p className="m-0 mt-1">
              “We use WhatsApp.” “Calls take time.” <Highlight>“We lose files.”</Highlight>
            </p>
          </div>
        </section>
      </div>

      <div className="page-container mt-14">
        <div className={MEASURE}>
          <Insights />
        </div>
      </div>

      <div className="page-container pt-20 sm:pt-24">
        <section className={MEASURE}>
          <p className="m-0 text-center font-display text-[1.1875rem] leading-[1.6] tracking-[-0.5px] text-ink">
            We traced it with a Five Whys. Each answer led to the next.
          </p>
          <div className="mt-10 sm:mt-14">
            <FiveWhys />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-14 sm:mt-20 lg:grid-cols-[minmax(0,510px)_minmax(0,335px)] lg:justify-between">
            <div>
              <CaseKicker>The problem</CaseKicker>
              <Body justify={false} className="mt-7">
                <span>
                  In the hours after news breaks, a story is spread across WhatsApp, calls, the camera roll and email.
                </span>{" "}
                <span className="font-normal">Reporters lose time tracking where everything is, and the desk receives updates with no structure.</span>
              </Body>
            </div>
            <div>
              <CaseKicker>How might we</CaseKicker>
              <Body className="mt-7">
                How might we give a story one home before it reaches the CMS, without slowing down the reporter who has
                to feed it?
              </Body>
            </div>
          </div>
        </section>
      </div>

      {/* ── SOLUTION ────────────────────────────────────────────────────── */}
      <div className="page-container pt-28 sm:pt-36">
        <section className={MEASURE}>
          <CaseKicker>Solution</CaseKicker>
          <div className="mt-10">
            <Spread head="Strota: one home for the story, from the first signal to the draft." scrub>
              <Body justify={false}>
                A phone app for field reporters and a dashboard for the people they report to. The finished draft goes
                to the newsroom’s existing CMS.
              </Body>
            </Spread>
          </div>
          <Body justify={false} className="mt-10 max-w-[1100px]">
            Strota connects what reporters already use instead of adding a sixth place to look. It links to Slack and
            Media Cloud, and publishing stays where it is.
          </Body>
        </section>
      </div>
      <div className="mt-12">
        <UiClip />
      </div>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <div className="page-container pt-28 sm:pt-32">
        <section className={MEASURE}>
          <CaseKicker>How it works</CaseKicker>
          <div className="mt-12">
            <Spread head="One story, followed from the field to the draft.">
              <Body justify={false}>
                A story breaks at 7:42 PM. Here is where it goes in Strota, from the reporter’s first update to the
                draft in the CMS.
              </Body>
            </Spread>
          </div>
          <div className="mt-14">
            <DesignedBottomUp />
          </div>
        </section>
      </div>

      <div className="page-container mt-14">
        <div className={MEASURE}>
          <StepRule />
          {ROWS.map((row) => (
            <div key={row.time}>
              <div className="py-14">
                <HowRow spec={row} />
              </div>
              <StepRule />
            </div>
          ))}
        </div>
      </div>

      {/* ── OUTCOMES, REFLECTION, META ──────────────────────────────────── */}
      <div className="page-container pt-28 sm:pt-36">
        <section className={MEASURE}>
          <CaseKicker>Outcomes</CaseKicker>
          <h2 className="type-subheading text-ink-alt mt-10 max-w-[820px] text-balance" style={HEAD}>
            Strota is a complete prototype, and the 7:42 PM voice note finally has one place to live.
          </h2>
          <Body justify={false} className="mt-8 max-w-[820px]">
            We delivered a Figma prototype across three roles: the junior reporter’s mobile app, senior reporter
            screens and the Bureau Chief dashboard. The voice note from the opening now reaches the Bureau Chief’s
            intake queue with its photos, beat and urgency attached, and every later update joins the same story until
            the draft goes to the CMS.
          </Body>

          <Payoff />
        </section>
      </div>

      <div className="page-container pt-28 sm:pt-32">
        <Beat kicker="Reflection" title="What I learned" titleStyle={HEAD}>
          <h3 className="type-subheading-sm text-ink-alt">Ask how it could work, not why it won’t.</h3>
          <P>
            Most of the shift on this project was mindset. While we built pages, every one of us was at some point the
            person explaining why something wouldn’t work. There are always plenty of people to play that part. Being
            the one who asks how we can make it work is the harder route, and it’s what moves a team forward.
          </P>
          <h3 className="type-subheading-sm text-ink-alt mt-2">Be the first to act.</h3>
          <P>
            Each time we said why something wouldn’t work, playing the other role in that moment would have moved us
            further, faster, and maybe unlocked new ideas. Next time I want to take that role early and try the idea
            before arguing against it.
          </P>
        </Beat>
      </div>

      <div className="page-container pt-24 pb-32 sm:pt-32">
        <CaseOverview
          rows={[
            { label: "Client", value: "College project" },
            {
              label: "Role",
              value:
                "Main designer on the junior reporter mobile app: the home dashboard, First Signal and the story flow. Researched and synthesised with the team.",
            },
            {
              label: "Team",
              value: "Five. Harsh, Kush and me on UX and product design; Jahnvi and Arnav on research",
            },
            { label: "Timeline", value: "3 months" },
            { label: "Surface", value: "Mobile (reporter), Web (Bureau Chief)" },
            { label: "Stage", value: "Concept, Figma prototype" },
          ]}
          scope={["User Research", "Problem Framing", "Mobile UI", "Interaction Design", "Systems Design"]}
        />
      </div>
    </>
  );
}
