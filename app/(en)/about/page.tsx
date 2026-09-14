import type { Metadata } from 'next';
import { AboutView } from '@/components/wg/pages/AboutView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.about.title,
  description: dict.meta.about.description,
  path: '/about',
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <AboutView dict={dict} locale="en" />;
}
