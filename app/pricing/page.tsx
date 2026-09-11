import type { Metadata } from 'next';
import { PricingView } from '@/components/wg/pages/PricingView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.pricing.title,
  description: dict.meta.pricing.description,
  path: '/pricing',
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <PricingView dict={dict} locale="en" />;
}
