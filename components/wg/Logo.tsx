import { cn } from "@/lib/cn";

/**
 * Official White Ghost mark (ADR-012, 29-jul-2026): white body with an ink
 * outline and ink eyes. `onDark` switches to the on-dark variant (white body,
 * no outline, eyes punched out so the background shows through).
 */
export function GhostMark({
  className,
  eyeClassName,
  float = true,
  blink = false,
  onDark = false,
}: {
  className?: string;
  /** Override the eye fill class (defaults to the official ink eyes). */
  eyeClassName?: string;
  /** Gentle idle up/down bob. On by default so the logo always feels alive;
   *  pass `false` when a parent (e.g. framer-motion) drives the transform. */
  float?: boolean;
  /** Occasional eye blink (one per view is plenty). */
  blink?: boolean;
  /** On-dark variant: white body, punched-out eyes, no outline. */
  onDark?: boolean;
}) {
  const maskId = onDark ? "wg-eyes-mask" : undefined;
  return (
    <svg
      viewBox="-2 -2 60 70"
      className={cn(float && "wg-float", blink && "wg-eyes", className)}
      aria-hidden="true"
    >
      {onDark && (
        <defs>
          <mask id={maskId}>
            <rect x="-2" y="-2" width="60" height="70" fill="#fff" />
            <rect x="17.5" y="24" width="7" height="15" rx="2" fill="#000" />
            <rect x="31.5" y="24" width="7" height="15" rx="2" fill="#000" />
          </mask>
        </defs>
      )}
      <path
        d="M28 0C12.536 0 0 12.536 0 28v30a7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0V28C56 12.536 43.464 0 28 0Z"
        fill="#FFFFFF"
        stroke={onDark ? "none" : "#10251C"}
        strokeWidth={onDark ? 0 : 2.5}
        mask={maskId ? `url(#${maskId})` : undefined}
      />
      {!onDark && (
        <>
          <rect x="17.5" y="24" width="7" height="15" rx="2" className={eyeClassName ?? "fill-ink"} />
          <rect x="31.5" y="24" width="7" height="15" rx="2" className={eyeClassName ?? "fill-ink"} />
        </>
      )}
    </svg>
  );
}
