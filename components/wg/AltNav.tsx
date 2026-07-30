"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";
import { LocaleSwitcher } from "@/components/wg/LocaleSwitcher";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-line bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        aria-label={dict.menuAria}
      >
        <a
          href={localizeHref("/", locale)}
          aria-label={dict.homeAria}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="White Ghost" className="h-5 w-auto wg-float" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {dict.links.map((link) => (
            <a
              key={link.label}
              href={localizeHref(link.href, locale)}
              className="px-label text-muted transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
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
        <div className="border-t border-line bg-paper/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {dict.links.map((link) => (
              <a
                key={link.label}
                href={localizeHref(link.href, locale)}
                onClick={() => setOpen(false)}
                className="px-label px-3 py-3 text-ink transition-colors hover:text-emerald"
              >
                {link.label}
              </a>
            ))}
            <a
              href={localizeHref("/waitlist", locale)}
              onClick={() => setOpen(false)}
              className="px-label mt-2 bg-emerald px-5 py-3 text-center text-white"
            >
              {dict.cta}
            </a>
            <LocaleSwitcher locale={locale} dict={switcher} className="mt-3 px-3" />
          </div>
        </div>
      )}
    </header>
  );
}
