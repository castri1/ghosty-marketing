import type { Dictionary, Locale } from "@/lib/wg-copy";

/**
 * Lab shim: the design lab is bilingual and its nav/footer render a locale
 * switcher. This site is English-only (decision 2026-07-29), so the switcher
 * renders nothing while the ported components stay source-identical.
 */
export function LocaleSwitcher(_props: {
  locale: Locale;
  dict: Dictionary["localeSwitcher"];
  className?: string;
}) {
  return null;
}
