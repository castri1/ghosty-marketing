import { StoryJourney } from '@/components/wg/StoryJourney';
import type { Dictionary, Locale } from '@/lib/i18n';

/**
 * Ported from the design lab (app/[locale]/story/page.tsx). The lab gave this
 * page its own minimal header; here the global chrome takes that role.
 */
export function StoryView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className="bg-paper text-ink">
      <main className="relative">
        <StoryJourney locale={locale} dict={dict.story} />
      </main>
    </div>
  );
}
