/**
 * Google Tag Manager container id for the marketing site. Inlined at build
 * time (same pattern as lib/site.ts / lib/console-url.ts). The container
 * holds the GA4 tag (property G-216EHLRHKG); NEXT_PUBLIC_GTM_ID overrides it,
 * and setting it to an empty string disables tracking entirely.
 * Consent Mode v2 defaults live in components/wg/RootShell.tsx (the inline
 * CONSENT_AND_GTM script) and the user-facing choice in
 * components/wg/ConsentBanner.tsx.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-5SXCTHL3';

/** localStorage key where the visitor's analytics-consent choice persists. */
export const CONSENT_STORAGE_KEY = 'wg-consent';

/**
 * Regions whose visitors start with every consent signal DENIED until they
 * choose in the banner (ISO 3166-1 alpha-2, the form Consent Mode's `region`
 * parameter takes): the EU-27, the non-EU EEA states, the United Kingdom and
 * Switzerland. Everyone else starts granted. A stored banner choice overrides
 * both, everywhere.
 */
export const CONSENT_DENIED_REGIONS = [
  // EU-27
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  // EEA outside the EU
  'IS', 'LI', 'NO',
  // United Kingdom, Switzerland
  'GB', 'CH',
] as const;
