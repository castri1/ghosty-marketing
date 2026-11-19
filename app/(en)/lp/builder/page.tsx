import type { Metadata } from 'next';
import { HomeView } from '@/components/wg/pages/HomeView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

/**
 * Hero A/B test, variant A (the builder): the home page with a different
 * hero. Not in lib/routes.ts on purpose (kept out of the sitemap and
 * llms.txt); noindex, canonical on `/`. Variant B lives at /lp/team.
 */
export const metadata: Metadata = pageMeta({
  title: 'White Ghost — give the app you built with AI a link your team can open',
  description:
    'Publish the app you built with Claude Code, Codex and others: a permanent link, a managed database and access rules. Free to start.',
  path: '/lp/builder',
  canonical: '/',
  robots: { index: false, follow: true },
  locale: 'en',
});

// Bounded CDN TTL, like the home (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return (
    <HomeView
      dict={dict}
      locale="en"
      heroOverride={{
        titleLead: 'Built it with your AI assistant?',
        titleEm: 'Give it a link your team can open.',
        body: 'White Ghost puts the app you built with Claude Code, Codex and others on a permanent link, with a managed database and access rules, and there is a free plan to start.',
        ctaPrimary: 'Publish your first app →',
        signupRef: 'lp-builder-hero',
      }}
    />
  );
}
