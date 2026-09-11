import type { Metadata } from 'next';
import { StoryView } from '@/components/wg/pages/StoryView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.story.title,
  description: dict.meta.story.description,
  path: '/es/story',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <StoryView dict={dict} locale="es" />;
}
