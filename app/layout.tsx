import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { SITE_URL } from '@/lib/site';
import '@/styles/preflight.css';
import '@/styles/marketing.css';

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
 * Shared, light editorial shell for all public White Ghost pages — nav + footer
 * ported from the console's MarketingLayout. The `.mkt` wrapper scopes the
 * verbatim-ported marketing CSS. The site is anonymous: sign-in CTAs are
 * absolute links into the console (lib/console-url.ts).
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
      </head>
      <body>
        <div className="mkt">
          <div className="mkt-atmosphere" />
          <div className="shell">
            <nav className="mkt-nav" aria-label="Primary navigation">
              <Link className="wordmark" href="/">
                <GhostMark className="ghost-mark mark-favicon" />
                <span>White Ghost</span>
              </Link>
              <div className="nav-links">
                <a href="/#how" className="hide-sm">How it works</a>
                <a href="/#access" className="hide-sm">Beta access</a>
                <Link href="/docs" className="hide-sm">Docs</Link>
                <a href={consoleUrl('/login')}>Sign in</a>
                <a className="btn btn-small" href={consoleUrl('/signup')}>Join beta</a>
              </div>
            </nav>

            {children}

            <footer className="mkt-footer">
              <div>
                <Link className="wordmark footer-wordmark" href="/">
                  <GhostMark className="ghost-mark mark-favicon" />
                  <span>White Ghost</span>
                </Link>
                <p>Build software around the way your work actually happens.</p>
              </div>
              <div className="links">
                <Link href="/docs">Docs</Link>
                <Link href="/changelog">Changelog</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/glossary">Glossary</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
                <a href="mailto:hello@getghosty.dev">Contact</a>
              </div>
              <span className="copyright">© 2026 White Ghost</span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
