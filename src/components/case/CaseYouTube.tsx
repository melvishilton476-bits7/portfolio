"use client";

import { useState } from "react";
import Image from "next/image";
import { Framed } from "./Figure";

/**
 * A YouTube film in a case-study slot, embedded as a FACADE.
 *
 * Nothing of YouTube's loads until the reader asks for it: at rest this is a
 * poster frame, a play button and a link. That matters here more than usual —
 * an <iframe> on mount pulls roughly half a megabyte of player and sets
 * third-party cookies on a page whose whole subject is the absence of noise.
 * The click swaps in the real player with `autoplay=1`, so the reader pays for
 * one gesture, not for arriving.
 *
 * `youtube-nocookie.com` is the same player served from YouTube's own
 * no-tracking-until-playback domain, and `rel=0` keeps the end screen inside
 * this channel rather than offering three strangers' videos as the last thing
 * the piece says.
 *
 * NO-JS / PRE-HYDRATION: the button is wrapped in a real link to the video, so
 * a reader whose JS hasn't landed still gets to the film — they leave for
 * YouTube instead of playing in place, which is the correct degradation.
 */
export default function CaseYouTube({
  id,
  title,
  poster,
  posterAlt,
  seconds,
}: {
  /** The YouTube video id — the part after `youtu.be/`. */
  id: string;
  /** The film's own title. Names the iframe for a screen reader, so the frame
   *  announces the piece rather than "YouTube video player". */
  title: string;
  /** Still from the film. Its ratio must be the frame's 16:9, since it stands
   *  exactly where the player will. */
  poster: string;
  posterAlt: string;
  /** Runtime, spoken in the play button's label — a reader deciding whether to
   *  start something deserves to know it is 55 seconds and not 12 minutes. */
  seconds?: number;
}) {
  const [playing, setPlaying] = useState(false);

  const runtime =
    seconds != null
      ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
      : null;

  return (
    <Framed className="relative w-full" round={false} style={{ aspectRatio: "16 / 9" }}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <a
          href={`https://youtu.be/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // Only take over the click when we can actually play in place —
            // a modified click is the reader asking for a new tab, and the
            // link is the right answer to that.
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            setPlaying(true);
          }}
          className="group absolute inset-0 block cursor-pointer"
        >
          <Image
            src={poster}
            alt={posterAlt}
            fill
            sizes="(min-width: 1080px) 980px, 92vw"
            className="object-cover"
            priority
          />
          {/* The button. White on a soft scrim rather than YouTube's red — the
              page is allowed to look like itself while it borrows the player. */}
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20"
          >
            <span className="flex size-[64px] items-center justify-center rounded-full bg-white/90 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.06]">
              {/* A triangle, drawn rather than fetched — three points is less
                  code than the request for an icon file would be. */}
              <svg viewBox="0 0 24 24" className="ml-[3px] size-[24px]" fill="#171717">
                <path d="M6 4.5 20 12 6 19.5z" />
              </svg>
            </span>
          </span>
          <span className="sr-only">
            Play {title}
            {runtime ? ` — ${runtime}` : ""} (opens on YouTube if the player cannot load)
          </span>
        </a>
      )}
    </Framed>
  );
}
