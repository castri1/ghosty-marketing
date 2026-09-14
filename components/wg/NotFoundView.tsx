import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import type { Dictionary } from '@/lib/i18n';

/**
 * Branded 404, in the language of the root layout that renders it. Next.js
 * sends a real 404 status for this page, so it stays out of the index on its
 * own; the job here is to keep the visitor (and the crawler) inside the site
 * with the nav, the footer, and the useful exits.
 */
export function NotFoundView({ dict }: { dict: Dictionary['notFound'] }) {
  return (
    <div className="bg-paper text-ink">
      <main>
        <section className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 md:pb-32 md:pt-40">
          <div className="flex items-center gap-4">
            <GhostMark />
            <p className="px-label text-muted">404</p>
          </div>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl">
            {dict.title}
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.body}
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {dict.links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group block h-full border border-line bg-surface p-6 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#D4DCD6]"
                >
                  <span className="font-display text-xl font-semibold tracking-tight text-ink">{item.title}</span>
                  <p className="mt-2 text-pretty leading-relaxed text-muted">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-muted">
            {dict.consoleLead}{' '}
            <a href={consoleUrl('/')} className="text-emerald underline underline-offset-4">
              {dict.consoleCta}
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
