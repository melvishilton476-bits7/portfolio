import type { CSSProperties } from "react";

/**
 * The hand-drawn asterisk / splat mark, from the supplied SVG. The source
 * baked in a Gaussian blur; here it's just the raw path so callers can set the
 * colour and decide blur/size/opacity per instance — sharp in the foreground,
 * blurred and dimmed for the depth layers.
 */
export default function Asterisk({
  color = "var(--color-splat-purple)",
  className = "",
  style,
}: {
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 173 178"
      fill="none"
      aria-hidden
      className={className}
      style={style}
    >
      <path
        d="M142.127 35.9119C147.546 45.1028 153.717 54.641 159.373 63.7504C143.713 72.8647 124.976 81.9605 108.456 89.312C125.983 99.9914 139.616 110.434 155.477 123.132C153.208 125.538 150.28 129.201 148.077 131.806C143.186 137.621 138.264 143.411 133.313 149.177C119.508 138.136 103.445 121.902 92.5725 107.984C89.5869 124.158 84.6318 139.764 79.3997 155.342C78.4272 158.238 77.3715 161.122 76.5379 164.058C73.2092 162.824 69.4143 161.139 66.0969 159.764L45.4923 151.252C51.1899 137.665 57.4752 124.324 64.3289 111.273L70.86 98.8169C51.1646 100.276 33.2548 101.168 13.4985 99.8439L15.8453 66.7169C18.3546 67.1239 21.0422 67.4343 23.5794 67.7314C40.1626 69.6684 56.2625 72.2024 72.5515 75.7939C70.6508 71.4663 68.3727 64.74 66.7326 60.2077C62.1685 47.5328 57.9322 34.7405 54.0252 21.8455C62.219 19.9995 70.3748 17.6956 78.5506 15.7404C81.4327 15.0511 84.3537 14.3007 87.2042 13.5C87.8971 17.9994 89.3867 23.7199 90.251 28.3671C92.7721 41.9215 95.5241 56.0259 95.991 69.8108C106.917 61.2468 117.991 52.8724 129.208 44.6914C131.847 42.777 139.598 37.0356 142.127 35.9119Z"
        fill={color}
      />
    </svg>
  );
}
