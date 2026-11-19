import type { Metadata } from 'next';
import { HomeView } from '@/components/wg/pages/HomeView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

/**
 * Hero A/B test, variant B (the team): the home page with a different hero.
 * Not in lib/routes.ts on purpose (kept out of the sitemap and llms.txt);
 * noindex, canonical on `/`. Variant A lives at /lp/builder.
 */
export const metadata: Metadata = pageMeta({
  title: 'White Ghost — one safe place for everything your team builds with AI',
  description:
    'A permanent home for the apps and agents your people build with the AI you already pay for, with access rules and one dashboard for all of it.',
  path: '/lp/team',
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
        titleLead: 'One safe place for',
        titleEm: 'everything your team builds with AI.',
        body: 'Your people already build apps and agents with the AI you pay for. White Ghost gives them a permanent home, with access rules and one dashboard that shows who built what and what it can touch.',
        ctaPrimary: 'Get started →',
        signupRef: 'lp-team-hero',
      }}
    />
  );
}
