import Placeholder from "./Placeholder";
import Chair from "./Chair";

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

        {/* Illustrations — campfire + chair resting on a horizon line, the
            way the section reads: "come have a seat" by the fire. The column
            aligns to the bottom of the grid row (items-end on the parent) so
            the horizon line sits level with the base of the form box, the
            pieces standing on the same ground line. Campfire art is still a
            placeholder pending the real asset. */}
        <div className="relative w-full">
          <div className="flex items-end justify-center gap-6 sm:gap-10">
            <Placeholder
              label="Campfire"
              ratio={1}
              maxWidth={180}
              variant="neutral"
              className="shrink-0"
            />
            <Chair
              color="#3FA35C"
              className="h-auto w-[clamp(240px,30vw,380px)] shrink-0"
            />
          </div>
          {/* The ground the pieces stand on — snug with the form's bottom. */}
          <div aria-hidden className="h-px w-full bg-ink/15" />
        </div>
      </div>
    </section>
  );
}
