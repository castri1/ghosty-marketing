/**
 * Google Tag Manager container id for the marketing site. Inlined at build
 * time (same pattern as lib/site.ts / lib/console-url.ts). The container
 * holds the GA4 tag (property G-216EHLRHKG); NEXT_PUBLIC_GTM_ID overrides it,
 * and setting it to an empty string disables tracking entirely.
 * Consent Mode v2 defaults live in app/layout.tsx and the user-facing choice
 * in components/wg/ConsentBanner.tsx.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-5SXCTHL3';

/** localStorage key where the visitor's analytics-consent choice persists. */
export const CONSENT_STORAGE_KEY = 'wg-consent';
