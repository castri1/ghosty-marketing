import type { Metadata } from 'next';
import { CompareToolView } from '@/components/wg/pages/CompareToolView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

const PATH = '/compare/replit';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareReplit.title,
  description: dict.meta.compareReplit.description,
  path: PATH,
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareToolView dict={dict} locale="en" tool="compareReplit" path={PATH} />;
}
