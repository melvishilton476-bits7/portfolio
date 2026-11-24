import { ImageResponse } from "next/og";
import BrandMark from "@/components/BrandMark";

/** Home-screen icon for iPhones and iPads: the same mark, square on white
 *  (iOS rounds the corners itself). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BrandMark size={110} />
      </div>
    ),
    size,
  );
}
