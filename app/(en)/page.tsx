import type { Metadata } from 'next';
import { HomeView } from '@/components/wg/pages/HomeView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.home.title,
  description: dict.meta.home.description,
  path: '/',
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <HomeView dict={dict} locale="en" />;
}
