"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AltNav } from "@/components/wg/AltNav";
import { AltFooter } from "@/components/wg/AltFooter";
import { ConsentBanner } from "@/components/wg/ConsentBanner";
import type { Dictionary, Locale } from "@/lib/i18n";

export type ChromeDict = Pick<Dictionary, "nav" | "footer" | "localeSwitcher" | "consent">;

/** The locale a pathname belongs to: /es and /es/... are Spanish. */
export function localeFromPathname(pathname: string | null): Locale {
  return pathname === "/es" || pathname?.startsWith("/es/") ? "es" : "en";
}

/**
 * Site chrome (fixed nav + footer + consent banner) in the language of the
 * current path. The shell (components/wg/RootShell.tsx) is shared by the
 * English pages at the root and the Spanish pages under /es, so the chrome
 * picks its dictionary from the pathname; only the nav/footer/consent slices
 * of each dictionary reach the client. `<html lang>` is set by the root
 * layout of each language group (app/(en), app/(es)), server-side.
 */
export function Chrome({
  en,
  es,
  withConsent,
  children,
}: {
  en: ChromeDict;
  es: ChromeDict;
  withConsent: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const dict = locale === "es" ? es : en;

  return (
    <>
      <AltNav locale={locale} dict={dict.nav} switcher={dict.localeSwitcher} />
      {children}
      <AltFooter locale={locale} dict={dict.footer} switcher={dict.localeSwitcher} />
      {withConsent ? <ConsentBanner dict={dict.consent} /> : null}
    </>
  );
}
