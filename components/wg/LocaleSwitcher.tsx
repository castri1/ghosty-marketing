"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Dictionary, Locale } from "@/lib/i18n";
import { enPathFor, esPathFor } from "@/lib/routes";

/**
 * ES / EN toggle. Links to the twin page when one exists (lib/routes.ts);
 * otherwise to the other language's home, or its blog index when the visitor
 * is reading a post.
 */
export function LocaleSwitcher({
  locale,
  dict,
  className,
}: {
  locale: Locale;
  dict: Dictionary["localeSwitcher"];
  className?: string;
}) {
  const pathname = usePathname() ?? "/";
  const toEs = locale === "es" ? pathname : (esPathFor(pathname) ?? (pathname.startsWith("/blog") ? "/es/blog" : "/es"));
  const toEn = locale === "en" ? pathname : (enPathFor(pathname) ?? (pathname.startsWith("/es/blog") ? "/blog" : "/"));
  const item = "px-label transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald";
  return (
    <nav aria-label={dict.aria} className={cn("flex items-center gap-2", className)}>
      <a href={toEs} lang="es" hrefLang="es" aria-current={locale === "es" ? "page" : undefined} className={cn(item, locale === "es" ? "text-ink" : "text-muted")}>
        {dict.toEs}
      </a>
      <span aria-hidden="true" className="text-line">/</span>
      <a href={toEn} lang="en" hrefLang="en" aria-current={locale === "en" ? "page" : undefined} className={cn(item, locale === "en" ? "text-ink" : "text-muted")}>
        {dict.toEn}
      </a>
    </nav>
  );
}
