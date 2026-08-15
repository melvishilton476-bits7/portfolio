import type { ComponentType } from "react";
import TitanCaseStudy from "./titan";

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
};

export const CASE_STUDY_SLUGS = Object.keys(CASE_STUDIES);
