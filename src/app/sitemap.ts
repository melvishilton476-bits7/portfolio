import type { MetadataRoute } from "next";
import { CASE_STUDY_SLUGS } from "@/case-studies/registry";

const SITE = "https://melvishilton.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/playground", "/blogs", ...CASE_STUDY_SLUGS.map((s) => `/work/${s}`)];
  return paths.map((p) => ({ url: `${SITE}${p}` }));
}
