import type { Metadata } from 'next';
import { StoryJourney } from '@/components/wg/StoryJourney';
import { copy } from '@/lib/wg-copy';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: copy.meta.story.title,
  description: copy.meta.story.description,
  path: '/story',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/**
 * Ported from the design lab (app/[locale]/story/page.tsx), English-only.
 * The lab gave this page its own minimal header; here the global chrome from
 * the root layout takes that role.
 */
export default function StoryPage() {
  return (
    <div className="bg-paper text-ink">
      <main className="relative">
        <StoryJourney locale="en" dict={copy.story} />
      </main>
    </div>
  );
}
