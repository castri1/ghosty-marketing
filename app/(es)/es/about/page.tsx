import type { Metadata } from 'next';
import { AboutView } from '@/components/wg/pages/AboutView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.about.title,
  description: dict.meta.about.description,
  path: '/es/about',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <AboutView dict={dict} locale="es" />;
}
