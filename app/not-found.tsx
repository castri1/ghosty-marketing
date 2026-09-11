import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';

/**
 * Branded 404. Next.js sends a real 404 status for this page, so it stays out
 * of the index on its own; the job here is to keep the visitor (and the
 * crawler) inside the site with the nav, the footer, and the useful exits.
 */
export default function NotFound() {
  return (
    <div className="bg-paper text-ink">
      <main>
        <section className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-8 md:pb-32 md:pt-40">
          <div className="flex items-center gap-4">
            <GhostMark />
            <p className="px-label text-muted">404</p>
          </div>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl">
            That page is not here.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            The link may be old, or the page moved. Here is where most people were heading.
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              { href: '/', title: 'Home', body: 'What White Ghost is, in one page.' },
              { href: '/deploy', title: 'Deploy guides', body: 'Ship an app built with Claude Code, Codex, or any assistant.' },
              { href: '/docs', title: 'Docs', body: 'Creating an app, signing in, the CLI, integrations.' },
              { href: '/blog', title: 'Blog', body: 'Sharing, hosting, and keeping AI-built apps safe.' },
            ].map((item) => (
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
            Looking for your apps?{' '}
            <a href={consoleUrl('/')} className="text-emerald underline underline-offset-4">
              Open the console
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
