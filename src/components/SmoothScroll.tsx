"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Lenis smooth scrolling for the whole site.
 *
 * Wheel and trackpad only: touch keeps the platform's own scrolling, which is
 * already smooth and which people notice when it is taken away. Off entirely
 * under reduced motion.
 *
 * Lenis still moves the real window scroll, so every scroll-linked effect on
 * the site (the scrubbed headings, the window video, the funnel) keeps reading
 * `scroll` events and `getBoundingClientRect` exactly as before.
 *
 * On a route change the new page starts at the top immediately. Without this
 * Lenis would ease from the old page's offset, or fight Next's own reset.
 */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ duration: 1.1, autoRaf: true, anchors: true });
    lenis.current = l;
    return () => {
      l.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
