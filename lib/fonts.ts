import { DM_Sans, IBM_Plex_Mono } from 'next/font/google';

/**
 * Self-hosted White Ghost faces (next/font/google: downloaded at build time,
 * served from /_next/static/media — no render-blocking request to a third-party
 * stylesheet). Same faces the old Google Fonts <link> loaded:
 *
 * - DM Sans, the shared face: the variable font with its optical-size axis
 *   (opsz 9..40, so large headings keep their display cut). next/font only
 *   allows extra axes on the full variable weight range.
 * - IBM Plex Mono 400/500, reserved for compact labels and code.
 *
 * next/font keeps the real family names on its @font-face rules ('DM Sans',
 * 'IBM Plex Mono'), so the existing CSS (styles/marketing.css, styles/wg.css)
 * resolves them unchanged; only the class names are hashed. RootShell puts
 * both `.variable` classes on <html> so the font CSS ships with every page.
 * Every subset's @font-face is kept (unicode-range, as before); `subsets` only
 * picks what is preloaded. Plex Mono isn't preloaded: it only sets small
 * labels, and preloading it would compete with the hero for bandwidth.
 */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--wg-font-dm-sans',
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
  variable: '--wg-font-plex-mono',
});

/** Class names for <html>: they ship the @font-face CSS with every page. */
export const FONT_CLASSES = `${dmSans.variable} ${plexMono.variable}`;
