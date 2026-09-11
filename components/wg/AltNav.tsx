"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";
import { LocaleSwitcher } from "@/components/wg/LocaleSwitcher";
import { NavMenu } from "@/components/wg/NavMenu";

const linkClass =
  "px-label py-2 text-muted transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald";

/**
 * Fixed top nav. Left: logo + four items (two dropdowns, two direct links).
 * Right: the account block (sign in, language, CTA) set apart by a hairline.
 * Below md the items collapse into a drawer grouped the same way.
 */
export function AltNav({
  locale,
  dict,
  switcher,
}: {
  locale: Locale;
  dict: Dictionary["nav"];
  switcher: Dictionary["localeSwitcher"];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile drawer: Escape closes it and the page behind does not scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const direct = dict.items.filter((item) => item.href !== undefined);
  const grouped = dict.items.filter((item) => item.groups !== undefined);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open || openMenu
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        aria-label={dict.menuAria}
      >
        <div className="flex items-center gap-10">
          <a
            href={localizeHref("/", locale)}
            aria-label={dict.homeAria}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="White Ghost" className="h-5 w-auto wg-float" />
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {dict.items.map((item) =>
              item.groups ? (
                <NavMenu
                  key={item.label}
                  label={item.label}
                  groups={item.groups}
                  locale={locale}
                  open={openMenu === item.label}
                  onOpen={() => setOpenMenu(item.label)}
                  onClose={() => setOpenMenu((current) => (current === item.label ? null : current))}
                />
              ) : (
                <a key={item.label} href={localizeHref(item.href, locale)} className={linkClass}>
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <a href={localizeHref(dict.signIn.href, locale)} className={cn(linkClass, "hidden md:inline-block")}>
            {dict.signIn.label}
          </a>
          <span aria-hidden="true" className="hidden h-4 w-px bg-line md:block" />
          <LocaleSwitcher locale={locale} dict={switcher} className="hidden sm:flex" />
          <a
            href={localizeHref("/waitlist", locale)}
            className="px-label hidden bg-emerald px-5 py-2.5 text-white shadow-[4px_4px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-px hover:-translate-y-px hover:shadow-[6px_6px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald sm:inline-block"
          >
            {dict.cta}
          </a>
          <button
            type="button"
            className="p-2 text-ink md:hidden"
            aria-expanded={open}
            aria-label={open ? dict.closeMenu : dict.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col px-5 py-4">
            {/* Direct links first, as plain rows. */}
            {direct.map((item) => (
              <a
                key={item.label}
                href={localizeHref(item.href ?? "/", locale)}
                onClick={() => setOpen(false)}
                className="px-label px-3 py-3 text-ink transition-colors hover:text-emerald"
              >
                {item.label}
              </a>
            ))}

            {/* Then every group of the dropdowns, two columns, like the footer. */}
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line px-3 pt-6">
              {grouped.flatMap((item) => item.groups ?? []).map((group) => (
                <div key={group.heading}>
                  <p className="px-label text-muted">{group.heading}</p>
                  <ul className="mt-3.5 flex flex-col gap-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={localizeHref(link.href, locale)}
                          onClick={() => setOpen(false)}
                          className="text-sm text-ink/90 transition-colors hover:text-emerald"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5">
              <a
                href={localizeHref("/waitlist", locale)}
                onClick={() => setOpen(false)}
                className="px-label bg-emerald px-5 py-3 text-center text-white"
              >
                {dict.cta}
              </a>
              <a
                href={localizeHref(dict.signIn.href, locale)}
                onClick={() => setOpen(false)}
                className="px-label px-3 py-3 text-center text-muted transition-colors hover:text-ink"
              >
                {dict.signIn.label}
              </a>
              <LocaleSwitcher locale={locale} dict={switcher} className="justify-center px-3 py-1" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
