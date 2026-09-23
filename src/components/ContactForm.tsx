"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

/**
 * The contact form's interactive half, split out of <Contact> so the section
 * itself can stay a server component: only the fields and the two actions need
 * to run in the browser, not the campfire and the chair beside them.
 *
 * There is no backend here. Submitting opens the visitor's own mail client
 * with the message already composed, which is honest about what happens next —
 * they press send, from their own address, and the reply goes back to them.
 * The alternative (a form service) needs an account and a key, and this page
 * has neither.
 */

const PURPLE = "#8581ff";
const TO = "hiltonmelvis@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/melvis-hilton-1b2982291";

/** Shared by both actions so they are one object wearing two labels. The
 *  height is FIXED rather than padding-derived: the arrow glyph's line box is
 *  taller than the type-caption beside it, so equal padding left the pair
 *  sitting off-level. */
const actionBtn =
  "inline-flex h-11 w-full items-center justify-center gap-2 px-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8581ff]";

export default function ContactForm() {
  const fieldWell =
    "w-full bg-btn-dark px-4 text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-accent";

  // Held in React rather than read off the DOM at submit time, because the
  // mailto is assembled from all four at once and a controlled field is the
  // shorter way to say that.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    const subject = about.trim() || "Hello from your site";
    // The sender's own address goes in the body too: they may send from a
    // different account than the one they typed, and the reply should go where
    // they asked for it.
    const body = [message.trim(), "", "—", name.trim(), email.trim()]
      .join("\n")
      .trim();
    window.location.href = `mailto:${TO}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form
      className="relative bg-btn-dark/95 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      {/* Periwinkle registration square-pairs (outline + filled, meeting
          corner-to-corner) sitting fully OUTSIDE the form — they kiss the
          card at a single corner/edge point rather than overlapping its
          dark face. 10px each. Desktop only. */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 hidden lg:block">
        <span
          className="accent-flicker-a absolute -left-[20px] -top-[20px] size-[10px]"
          style={{ background: PURPLE, ["--enter" as string]: "0.9s" } as CSSProperties}
        />
        <span
          className="accent-flicker-b absolute -left-[10px] -top-[10px] size-[10px]"
          style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.1s" } as CSSProperties}
        />
      </span>
      <span aria-hidden className="pointer-events-none absolute left-full top-[140px] hidden lg:block">
        <span
          className="accent-flicker-b absolute left-0 top-0 size-[10px]"
          style={{ background: PURPLE, ["--enter" as string]: "1.3s" } as CSSProperties}
        />
        <span
          className="accent-flicker-a absolute left-[10px] -top-[10px] size-[10px]"
          style={{ border: `1px solid ${PURPLE}`, ["--enter" as string]: "1.5s" } as CSSProperties}
        />
      </span>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="type-caption text-white/70">Name</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${fieldWell} h-10`}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="type-caption text-white/70">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${fieldWell} h-10`}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="type-caption text-white/70">What it&rsquo;s About</span>
          <input
            type="text"
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className={`${fieldWell} h-10`}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="type-caption text-white/70">Message</span>
          <textarea
            rows={3}
            name="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldWell} resize-none py-3`}
          />
        </label>
      </div>

      {/* A two-column grid, not a flex row: the labels are different lengths
          ("Send" against "Go To LinkedIn"), so content-sized buttons came out
          lopsided. Equal columns give them one width, and the labels centre
          inside it. */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {/* The arrow points the way the message travels — out, to the right.
            It sat on the left pointing back at the form before. */}
        <button
          type="submit"
          className={`${actionBtn} text-white hover:brightness-110`}
          style={{ background: PURPLE }}
        >
          <span className="type-caption font-medium">Send</span>
          <span aria-hidden className="leading-none">
            &rarr;
          </span>
        </button>
        <a
          href={LINKEDIN}
          target="_blank"
          rel="noreferrer noopener"
          className={`${actionBtn} bg-white/10 text-white hover:bg-white/20`}
        >
          <span className="type-caption font-medium">Go To LinkedIn</span>
          <span aria-hidden className="text-white/70">
            &#8599;
          </span>
        </a>
      </div>
      <p className="type-caption mt-3 text-white/40">
        Opens your mail app with the message ready to send.
      </p>
    </form>
  );
}
