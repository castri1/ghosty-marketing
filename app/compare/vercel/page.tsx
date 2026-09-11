import type { Metadata } from 'next';
import { CompareVercelView } from '@/components/wg/pages/CompareVercelView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareVercel.title,
  description: dict.meta.compareVercel.description,
  path: '/compare/vercel',
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareVercelView dict={dict} locale="en" />;
}
