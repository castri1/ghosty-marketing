export interface GhostMarkProps {
  className?: string;
  /** Optional eye colour for marks shown on a contrasting surface. */
  eyeColor?: string;
}

/**
 * The Ghosty ghost mark, vendored verbatim from the ghosty monorepo's
 * @ghosty/ui (CAS-93 — this repo takes no workspace dependencies). The body
 * fills with `currentColor`; the eyes punch through in the page background
 * token.
 */
export function GhostMark({ className = 'h-6 w-6', eyeColor }: GhostMarkProps) {
  return (
    <svg className={className} viewBox="0 0 56 66" aria-hidden="true">
      <path
        d="M28 0C12.536 0 0 12.536 0 28v30a7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0V28C56 12.536 43.464 0 28 0Z"
        fill="currentColor"
      />
      <rect x="17.5" y="24" width="7" height="15" rx="2" fill={eyeColor ?? 'rgb(var(--bg, 255 255 255))'} />
      <rect x="31.5" y="24" width="7" height="15" rx="2" fill={eyeColor ?? 'rgb(var(--bg, 255 255 255))'} />
    </svg>
  );
}
