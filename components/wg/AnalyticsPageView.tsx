'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * SPA pageview bridge. Most site chrome navigates with full-page <a> loads
 * (GTM's All Pages trigger covers those), but the content routes (docs, blog,
 * glossary) use next/link client transitions. This pushes a `spa_page_view`
 * dataLayer event on every client-side route change AFTER the initial load,
 * so GTM can fire a GA4 page_view without double-counting the landing hit.
 * Keep GA4's enhanced-measurement "page changes based on browser history
 * events" OFF — this event is the one source of SPA pageviews.
 */
export function AnalyticsPageView() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (last.current === null) {
      last.current = pathname;
      return;
    }
    if (last.current === pathname) return;
    last.current = pathname;
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: 'spa_page_view',
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
