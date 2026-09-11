import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Chrome, type ChromeDict } from '@/components/wg/Chrome';
import { AnalyticsPageView } from '@/components/wg/AnalyticsPageView';
import { en } from '@/lib/i18n/en';
import { es } from '@/lib/i18n/es';
import { CONSENT_STORAGE_KEY, GTM_ID } from '@/lib/gtm';
import { SITE_URL } from '@/lib/site';
import '@/styles/preflight.css';
import '@/styles/marketing.css';
import '@/styles/wg.css';

/** The official White Ghost mark, as a data-URI favicon. */
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 60 70'%3E%3Cpath d='M28 0C12.536 0 0 12.536 0 28v30a7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0V28C56 12.536 43.464 0 28 0Z' fill='%23ffffff' stroke='%2310251C' stroke-width='2.5'/%3E%3Crect x='17.5' y='24' width='7' height='15' rx='2' fill='%2310251C'/%3E%3Crect x='31.5' y='24' width='7' height='15' rx='2' fill='%2310251C'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  // metadataBase resolves relative OG/Twitter image paths (/og.png) to
  // absolute URLs; per-page tags come from pageMeta() in lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: 'White Ghost — Build software around your work',
  description:
    'Describe the software your work needs, shape it with the AI assistant you already like, and put it to work with White Ghost.',
  icons: { icon: FAVICON },
};

export const viewport: Viewport = {
  colorScheme: 'light',
};

/**
 * Consent Mode v2 defaults + the GTM loader, as one inline script so the
 * consent default is ALWAYS set before GTM boots (Google's required order).
 * Everything starts denied; on repeat visits the stored choice from the
 * consent banner (localStorage) seeds the default so returning visitors who
 * accepted are measured from the first pageview. url_passthrough keeps ad
 * click ids across pages while consent is denied.
 */
const CONSENT_AND_GTM = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var wgc = null;
try { wgc = localStorage.getItem('${CONSENT_STORAGE_KEY}'); } catch (e) {}
var g = wgc === 'granted' ? 'granted' : 'denied';
gtag('consent', 'default', {
  ad_storage: g,
  ad_user_data: g,
  ad_personalization: g,
  analytics_storage: g,
  wait_for_update: 500
});
gtag('set', 'url_passthrough', true);
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
`;

/** Only the chrome slices of a dictionary cross to the client. */
function chromeDict(d: typeof en): ChromeDict {
  return { nav: d.nav, footer: d.footer, localeSwitcher: d.localeSwitcher, consent: d.consent };
}

/**
 * Shared shell for all public White Ghost pages (English at the root, Spanish
 * under /es: the chrome picks its language from the path, see Chrome.tsx). The chrome (fixed nav +
 * footer) is the design-lab system, ported verbatim (components/wg, copy in
 * lib/wg-copy.ts) and deliberately rendered OUTSIDE any `.mkt` scope so the
 * console-ported element rules in styles/marketing.css cannot reach it.
 * Content pages re-enter `.mkt` via app/(content)/layout.tsx. The site is
 * anonymous: sign-in CTAs are absolute links into the console
 * (lib/console-url.ts).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DM Sans is the shared White Ghost face; Plex Mono is reserved for
            compact labels and code — same loads as the console today. */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {GTM_ID ? <script dangerouslySetInnerHTML={{ __html: CONSENT_AND_GTM }} /> : null}
      </head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        <div className="wg-atmosphere" />
        <Chrome en={chromeDict(en)} es={chromeDict(es)} withConsent={Boolean(GTM_ID)}>
          {children}
        </Chrome>
        {GTM_ID ? <AnalyticsPageView /> : null}
      </body>
    </html>
  );
}
