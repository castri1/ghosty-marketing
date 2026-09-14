import type { Metadata } from 'next';
import { PricingView } from '@/components/wg/pages/PricingView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.pricing.title,
  description: dict.meta.pricing.description,
  path: '/es/pricing',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <PricingView dict={dict} locale="es" />;
}
