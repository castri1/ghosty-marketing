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
import type { Dictionary, Locale } from '@/lib/i18n';
import { SITE_URL, siteUrl } from '@/lib/site';

/** Other products share the name; say plainly which one this is, per language. */
const DISAMBIGUATION: Record<Locale, { org: string; app: string }> = {
  en: {
    org: 'White Ghost (whiteghost.ai) is a deployment platform for internal apps built with AI coding assistants such as Claude Code and Codex. Not a video-editing or media tool.',
    app: 'Deployment platform for apps built with AI coding assistants (Claude Code, Codex): a permanent URL, access rules, database, integrations, and rollback, without cloud consoles.',
  },
  es: {
    org: 'White Ghost (whiteghost.ai) es una plataforma para publicar apps internas construidas con asistentes de programación con IA como Claude Code y Codex. No es una herramienta de edición de video ni de medios.',
    app: 'Plataforma para publicar apps hechas con asistentes de IA (Claude Code, Codex): URL permanente, reglas de acceso, base de datos, integraciones y rollback, sin consolas de nube.',
  },
};

/** The White Ghost home, ported from the design lab (GhostyHome): intro loader,
 * hero with the particle field, and the full section run. Nav and footer live
 * in the root layout. Bilingual via {dict, locale}. */
export function HomeView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'White Ghost',
    alternateName: 'Ghosty',
    url: SITE_URL,
    logo: `${SITE_URL}/logo-mark-512.png`,
    email: 'hello@whiteghost.ai',
    disambiguatingDescription: DISAMBIGUATION[locale].org,
  };
  const softwareApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'White Ghost',
    url: locale === 'es' ? siteUrl('/es') : SITE_URL,
    inLanguage: locale,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: dict.meta.home.description,
    disambiguatingDescription: DISAMBIGUATION[locale].app,
  };

  return (
    <div className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />
      <IntroLoader dict={dict.intro} />
      <main>
        <AltHero dict={dict.home.hero} locale={locale} />
        <AltMarquee dict={dict.home.marquee} />
        <AltProblem dict={dict.home.problem} />
        <AltHowItWorks dict={dict.home.how} />
        <AltAppsAgents dict={dict.home.apps} />
        <AltControl dict={dict.home.control} />
        <AltCosts dict={dict.home.costs} />
        <AltConnect dict={dict.home.connect} />
        <AltData dict={dict.home.data} />
        <AltCTA dict={dict.home.cta} locale={locale} />
      </main>
    </div>
  );
}
