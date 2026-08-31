'use client';

import { useEffect, useState } from 'react';
import { CONSENT_STORAGE_KEY } from '@/lib/gtm';

type ConsentDict = {
  text: string;
  policyLabel: string;
  accept: string;
  decline: string;
};

/**
 * Consent Mode v2 update: dataLayer.push must receive the `arguments` object
 * (not an array) for GTM to recognize the consent command.
 */
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  (window as unknown as { dataLayer: unknown[] }).dataLayer.push(arguments);
}

/**
 * Analytics consent banner. The Consent Mode v2 *default* (denied, or the
 * stored choice on repeat visits) is set inline in app/layout.tsx before GTM
 * loads; this component only renders the first-visit choice and pushes the
 * consent *update*. Vendor-free copy per house rules — the provider detail
 * lives in /privacy.
 */
export function ConsentBanner({ dict }: { dict: ConsentDict }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_STORAGE_KEY)) return;
    } catch {
      // Storage unavailable (private mode): keep consent at the denied default.
      return;
    }
    // The home intro (#wg-intro, z-9999) covers the whole viewport on the
    // first visit of a session — exactly when this banner first shows. Wait
    // for it to unmount instead of rendering underneath it.
    if (!document.getElementById('wg-intro')) {
      setOpen(true);
      return;
    }
    const poll = window.setInterval(() => {
      if (!document.getElementById('wg-intro')) {
        window.clearInterval(poll);
        setOpen(true);
      }
    }, 400);
    return () => window.clearInterval(poll);
  }, []);

  if (!open) return null;

  const decide = (granted: boolean) => {
    setOpen(false);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
    } catch {
      // Choice won't persist, but still applies to this page load.
    }
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    const mode = granted ? 'granted' : 'denied';
    gtag('consent', 'update', {
      ad_storage: mode,
      ad_user_data: mode,
      ad_personalization: mode,
      analytics_storage: mode,
    });
    w.dataLayer.push({ event: granted ? 'wg_consent_granted' : 'wg_consent_denied' });
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={dict.policyLabel}
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-line bg-surface p-4 shadow-lg sm:flex-row sm:items-center">
        <p className="m-0 flex-1 text-sm leading-snug text-muted">
          {dict.text}{' '}
          <a href="/privacy" className="text-ink underline underline-offset-2">
            {dict.policyLabel}
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-muted hover:text-ink"
          >
            {dict.decline}
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-surface hover:opacity-90"
          >
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
