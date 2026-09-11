import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseView } from '@/components/wg/UseCaseView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

const SLUG = 'commercial';
const role = dict.useCases.roles.find((r) => r.slug === SLUG);

export const metadata: Metadata = pageMeta({
  title: role ? `White Ghost — ${role.label}` : dict.meta.useCases.title,
  description: role?.blurb ?? dict.meta.useCases.description,
  path: `/es/use-cases/${SLUG}`,
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  if (!role) notFound();
  return <UseCaseView locale="es" dict={dict} role={role} />;
}
