export interface GhostMarkProps {
  className?: string;
  /** Optional eye colour override; defaults to the official ink eyes. */
  eyeColor?: string;
}

/**
 * The official White Ghost mark (brand system of 2026-07-29): white body with
 * an ink outline and ink eyes. Same silhouette as always — only the colours
 * changed with the White Ghost rebrand (Ghosty remains the mascot's name).
 */
export function GhostMark({ className = 'h-6 w-6', eyeColor }: GhostMarkProps) {
  return (
    <svg className={className} viewBox="-2 -2 60 70" aria-hidden="true">
      <path
        d="M28 0C12.536 0 0 12.536 0 28v30a7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0V28C56 12.536 43.464 0 28 0Z"
        fill="#FFFFFF"
        stroke="#10251C"
        strokeWidth={2.5}
      />
      <rect x="17.5" y="24" width="7" height="15" rx="2" fill={eyeColor ?? '#10251C'} />
      <rect x="31.5" y="24" width="7" height="15" rx="2" fill={eyeColor ?? '#10251C'} />
    </svg>
  );
}
