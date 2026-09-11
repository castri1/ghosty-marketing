import type { Metadata } from 'next';
import { UseCasesHubView } from '@/components/wg/pages/UseCasesHubView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.useCases.title,
  description: dict.meta.useCases.description,
  path: '/es/use-cases',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <UseCasesHubView dict={dict} locale="es" />;
}
