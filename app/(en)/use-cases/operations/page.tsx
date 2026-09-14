import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseView } from '@/components/wg/UseCaseView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

const SLUG = 'operations';
const role = dict.useCases.roles.find((r) => r.slug === SLUG);

export const metadata: Metadata = pageMeta({
  title: role ? `White Ghost — ${role.label}` : dict.meta.useCases.title,
  description: role?.blurb ?? dict.meta.useCases.description,
  path: `/use-cases/${SLUG}`,
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  if (!role) notFound();
  return <UseCaseView locale="en" dict={dict} role={role} />;
}
