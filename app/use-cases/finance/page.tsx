import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UseCaseView } from '@/components/wg/UseCaseView';
import { copy } from '@/lib/wg-copy';
import { pageMeta } from '@/lib/site';

const SLUG = 'finance';
const role = copy.useCases.roles.find((r) => r.slug === SLUG);

export const metadata: Metadata = pageMeta({
  title: role ? `White Ghost — ${role.label}` : copy.meta.useCases.title,
  description: role?.blurb ?? copy.meta.useCases.description,
  path: `/use-cases/${SLUG}`,
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Ported from the design lab (app/[locale]/use-cases/finance), English-only. */
export default function Page() {
  if (!role) notFound();
  return <UseCaseView locale="en" dict={copy} role={role} />;
}
