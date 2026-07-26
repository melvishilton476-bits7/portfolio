// import Vase from "./Vase"; // commented out for now
import Chair from "./Chair";
import Fire from "./Fire";
import Fireplace from "./Fireplace";
import Fumes from "./Fumes";
import CodeMotes from "./CodeMotes";

/**
 * "Come have a seat!" — contact section. Dark form on the left, playful
 * illustrations (campfire + chair) on the right. Submission is stubbed;
 * wire "Book a Slot" / "Go To LinkedIn" to real endpoints later.
 */
export default function Contact() {
  const fieldWell =
    "w-full bg-btn-dark px-4 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-accent";

  return (
    <section id="contact" className="page-container py-24 sm:py-32">
      <header className="mb-12">
        <h2 className="type-heading text-ink">Come have a seat!</h2>
        <p className="type-lead mt-2">Let&rsquo;s have a chat.</p>
      </header>

      <div className="grid items-end gap-14 lg:grid-cols-[minmax(0,410px)_1fr]">
        {/* Form */}
        <form
          className="bg-btn-dark/95 p-6 sm:p-8"
          /* TODO: wire onSubmit to backend / form service */
        >
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">Name</span>
              <input type="text" className={`${fieldWell} h-11`} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">Email</span>
              <input type="email" className={`${fieldWell} h-11`} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">What it&rsquo;s About</span>
              <input type="text" className={`${fieldWell} h-11`} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="type-caption text-white/70">Message</span>
              <textarea rows={4} className={`${fieldWell} resize-none py-3`} />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-accent px-5 py-3 text-accent-ink"
            >
              <span aria-hidden>←</span>
              <span className="type-caption font-medium">Book a Slot</span>
            </button>
            <a
              href="#"
              className="inline-flex items-center bg-white/10 px-5 py-3 text-white"
            >
              <span className="type-caption font-medium">Go To LinkedIn</span>
            </a>
          </div>
        </form>

        {/* Illustrations — a flower vase + chair resting on a horizon line,
            the way the section reads: "come have a seat." The column aligns to
            the bottom of the grid row (items-end on the parent) so the horizon
            line sits level with the base of the form box, the pieces standing
            on the same ground line. The vase's bouquet breathes and its blooms
            pulse gently (Vase.tsx + globals.css → VASE). */}
        <div className="relative w-full">
          <div className="flex items-end justify-center gap-6 sm:gap-10">
            {/* Commented out for now.
            <Vase className="h-auto w-[clamp(140px,18vw,210px)] shrink-0" />
            */}
            {/* Campfire: the looping Lottie flames (made in AE) burning behind
                a smaller wood-log pile on a grey stone hearth (the user's own
                illustration, texture stripped to clean flat shapes). The logs
                sit in front of the flames so the fire reads as coming from
                within the pile rather than floating over it. */}
            <div className="relative h-[clamp(95px,12vw,145px)] w-[clamp(130px,17vw,200px)] shrink-0">
              <Fire className="absolute bottom-[6%] left-1/2 z-0 h-auto w-[72%] -translate-x-1/2" />
              <Fireplace className="absolute bottom-0 left-1/2 z-10 h-auto w-[58%] -translate-x-1/2" />
              {/* Smoke, on top of everything and free to drift out past the
                  container's top edge (nothing here clips). */}
              <Fumes className="pointer-events-none absolute inset-0 z-20" />
              {/* Code glyphs rising with the smoke — the "engineer" wink. */}
              <CodeMotes className="pointer-events-none absolute inset-0 z-30" />
            </div>
            <Chair
              color="#3FA35C"
              className="h-auto w-[clamp(240px,30vw,380px)] shrink-0"
            />
          </div>
          {/* The ground the pieces stand on — snug with the form's bottom. The
              left end stays at the illustration column; the right end runs full
              bleed to the viewport edge. That extension = the container's right
              padding + its centring margin (0 until the viewport passes the
              1280px frame), so the right edge lands exactly on the viewport. */}
          <div
            aria-hidden
            className="h-px bg-ink/15"
            style={{
              width:
                "calc(100% + clamp(1.25rem, 5vw, 4rem) + max(0px, (100vw - var(--container-page)) / 2))",
            }}
          />
        </div>
      </div>
    </section>
  );
}
