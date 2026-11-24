import { ImageResponse } from "next/og";
import BrandMark from "@/components/BrandMark";

/**
 * The favicon, and the icon Google shows beside the site in search results:
 * the periwinkle mark on white. 96px, a multiple of 48 as Google asks, so it
 * stays sharp wherever it is scaled down. (It replaces the default Next.js
 * favicon the project started with.)
 */
export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BrandMark size={60} />
      </div>
    ),
    size,
  );
}
