import type { ComponentType } from "react";
import TitanCaseStudy from "./titan";
import NagarholeCaseStudy from "./nagarhole";

/**
 * Slug → case study. The dynamic route reads this for both its static params
 * and its per-page metadata, so adding the next case study is one entry here
 * plus its own composition file — no route changes.
 *
 * `title` / `description` feed <head>; `name` is the human label used in the
 * back-link and breadcrumbs.
 */
export type CaseStudy = {
  name: string;
  title: string;
  description: string;
  Component: ComponentType;
};

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "titan-rebrand": {
    name: "Titan",
    title: "TITAN — Rebuilding a legacy name as performance eyewear",
    description:
      "A three-month self-directed brand build: identity, a custom typeface cut from Morgant, a material-derived colour system, collateral and campaign — all traced back to one thesis, that nature is the perfect design.",
    Component: TitanCaseStudy,
  },
  "nagarhole-wayfinding": {
    name: "Nagarhole",
    title: "Signage that recedes into Nagarhole, except where it can't afford to",
    description:
      "A concept signage system for Nagarhole National Park. Every sign was built to disappear into the forest; the warning family breaks that rule on purpose, because camouflaged danger is a design failure.",
    Component: NagarholeCaseStudy,
  },
};

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDIES);
