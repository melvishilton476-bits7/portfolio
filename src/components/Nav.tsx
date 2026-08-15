"use client";

import { Home, User, Gamepad2, PenLine } from "lucide-react";
import { NavBar } from "./ui/tubelight-navbar";

/* Root-relative, not bare hashes: the nav now renders on case-study routes too,
   where a bare "#about" would resolve against /work/<slug> and go nowhere. The
   leading slash sends it back to the home page and then to the anchor. */
const NAV_ITEMS = [
  { name: "Home", url: "/#top", icon: Home },
  { name: "About", url: "/#about", icon: User },
  { name: "Playground", url: "/#playground", icon: Gamepad2 },
  { name: "Blogs", url: "/#blogs", icon: PenLine },
];

/**
 * Top navigation — the tubelight navbar (a floating pill with a sliding,
 * glowing active indicator). Fixed to the top on desktop / bottom on mobile.
 * In-page anchors are stubs for now; wire to real routes later.
 */
export default function Nav() {
  return <NavBar items={NAV_ITEMS} />;
}
