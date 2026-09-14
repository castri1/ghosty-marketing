import type { Metadata } from 'next';
import { StoryView } from '@/components/wg/pages/StoryView';
import { en as dict } from '@/lib/i18n/en';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.story.title,
  description: dict.meta.story.description,
  path: '/story',
  locale: 'en',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <StoryView dict={dict} locale="en" />;
}
