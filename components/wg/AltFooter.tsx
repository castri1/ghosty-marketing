import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";
import { LocaleSwitcher } from "@/components/wg/LocaleSwitcher";

export function AltFooter({
  locale,
  dict,
  switcher,
}: {
  locale: Locale;
  dict: Dictionary["footer"];
  switcher: Dictionary["localeSwitcher"];
}) {
  return (
    <footer className="border-t border-line bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-xs">
            <a href={localizeHref("/", locale)} aria-label={dict.tagline}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="White Ghost" className="h-5 w-auto" />
            </a>
            <p className="mt-5 text-sm leading-relaxed text-muted">{dict.tagline}</p>
            <LocaleSwitcher locale={locale} dict={switcher} className="mt-6" />
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-12">
            {dict.columns.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <p className="px-label text-muted">{column.heading}</p>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={localizeHref(link.href, locale)}
                        className="text-sm text-ink/90 transition-colors duration-200 hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="px-label text-muted">
            © {new Date().getFullYear()} White Ghost ▪ {dict.rights}
          </p>
          <a
            href="https://whiteghost.ai"
            className="px-label text-muted transition-colors duration-200 hover:text-emerald"
          >
            whiteghost.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
