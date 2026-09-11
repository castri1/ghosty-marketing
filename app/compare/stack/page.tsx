import type { Metadata } from 'next';
import { CompareStackView } from '@/components/wg/pages/CompareStackView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareStack.title,
  description: dict.meta.compareStack.description,
  path: '/compare/stack',
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareStackView dict={dict} locale="en" />;
}
