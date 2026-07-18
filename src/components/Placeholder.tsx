import type { CSSProperties } from "react";

type PlaceholderProps = {
  /** Short label shown centered in the block. */
  label?: string;
  /** width / height, e.g. 493 / 256. Drives the reserved box shape. */
  ratio?: number;
  /** Optional fixed max width in px. */
  maxWidth?: number;
  className?: string;
  /** Accent variant tints the block (used for the green rebrand cards). */
  variant?: "neutral" | "accent" | "dark";
  style?: CSSProperties;
};

/**
 * Shaped placeholder standing in for real assets (hero animation, project
 * shots, illustrations). Preserves the source aspect ratio so layout is
 * final; swap for <Image /> when the real asset lands.
 */
export default function Placeholder({
  label = "Asset",
  ratio = 16 / 9,
  maxWidth,
  className = "",
  variant = "neutral",
  style,
}: PlaceholderProps) {
  const variants: Record<NonNullable<PlaceholderProps["variant"]>, string> = {
    neutral: "bg-surface text-ink-muted border-black/10",
    accent: "bg-accent/25 text-accent-ink border-accent/40",
    dark: "bg-btn-dark text-white/60 border-white/10",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-[var(--radius-md)] border border-dashed ${variants[variant]} ${className}`}
      style={{ aspectRatio: String(ratio), maxWidth, width: "100%", ...style }}
      role="img"
      aria-label={`${label} placeholder`}
    >
      <span className="type-caption uppercase tracking-widest opacity-70">
        {label}
      </span>
    </div>
  );
}
