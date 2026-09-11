import type { Metadata } from 'next';
import { IntroLoader } from '@/components/wg/IntroLoader';
import { AltHero } from '@/components/wg/AltHero';
import { AltMarquee } from '@/components/wg/AltMarquee';
import { AltProblem } from '@/components/wg/AltProblem';
import { AltHowItWorks } from '@/components/wg/AltHowItWorks';
import { AltAppsAgents } from '@/components/wg/AltAppsAgents';
import { AltControl } from '@/components/wg/AltControl';
import { AltCosts } from '@/components/wg/AltCosts';
import { AltConnect } from '@/components/wg/AltConnect';
import { AltData } from '@/components/wg/AltData';
import { AltCTA } from '@/components/wg/AltCTA';
import { copy } from '@/lib/wg-copy';
import { pageMeta, SITE_URL } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: copy.meta.home.title,
  description: copy.meta.home.description,
  path: '/',
});

// Bounded CDN TTL: without this, Next's static default emits s-maxage=31536000 and the
// apex CDN (USE_ORIGIN_HEADERS) can serve year-old copy after a deploy (CAS-127).
export const revalidate = 3600;

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'White Ghost',
  alternateName: 'Ghosty',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-mark-512.png`,
  email: 'hello@whiteghost.ai',
  // Other products share the name; say plainly which one this is.
  disambiguatingDescription:
    'White Ghost (whiteghost.ai) is a deployment platform for internal apps built with AI coding assistants such as Claude Code and Codex. Not a video-editing or media tool.',
};

const SOFTWARE_APPLICATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'White Ghost',
  url: SITE_URL,
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  description: copy.meta.home.description,
  disambiguatingDescription:
    'Deployment platform for apps built with AI coding assistants (Claude Code, Codex): a permanent URL, access rules, database, integrations, and rollback, without cloud consoles.',
};

/** The White Ghost home, ported from the design lab (GhostyHome): intro loader,
 * hero with the particle field, and the full section run. Nav and footer live
 * in the root layout. */
export default function Home() {
  return (
    <div className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APPLICATION_JSON_LD) }}
      />
      <IntroLoader dict={copy.intro} />
      <main>
        <AltHero dict={copy.home.hero} locale="en" />
        <AltMarquee dict={copy.home.marquee} />
        <AltProblem dict={copy.home.problem} />
        <AltHowItWorks dict={copy.home.how} />
        <AltAppsAgents dict={copy.home.apps} />
        <AltControl dict={copy.home.control} />
        <AltCosts dict={copy.home.costs} />
        <AltConnect dict={copy.home.connect} />
        <AltData dict={copy.home.data} />
        <AltCTA dict={copy.home.cta} locale="en" />
      </main>
    </div>
  );
}
