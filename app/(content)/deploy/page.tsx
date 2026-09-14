import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'How to deploy an app built with an AI assistant';
const DESCRIPTION =
  'You built something with Claude Code, Codex, or another AI assistant and it only opens on your computer. These guides show how to put it on a real link your team can open.';

const GUIDES = [
  {
    href: '/deploy/ai-coding-assistant',
    title: 'Any AI coding assistant',
    body: 'The general guide: what "deploy" means, what your options are, and how an assistant can ship the app for you through the CLI.',
  },
  {
    href: '/deploy/claude-code',
    title: 'Claude Code',
    body: 'From a folder on your laptop to a URL with access rules, driven from the Claude Code conversation.',
  },
  {
    href: '/deploy/codex',
    title: 'Codex',
    body: 'The same flow for apps written with OpenAI Codex, including how to share the result publicly or only with your team.',
  },
];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — White Ghost`,
  description: DESCRIPTION,
  path: '/deploy',
});

// Bounded CDN TTL — see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Hub for the deploy guides: one entry per assistant, plus the plain-language framing. */
export default function DeployHubPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Deploy guides', item: siteUrl('/deploy') },
    ],
  };
  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: TITLE,
    itemListElement: GUIDES.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: siteUrl(g.href),
    })),
  };

  return (
    <main className="legal">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <p className="meta">
        <GhostMark /> Deploy guides
      </p>
      <h1>{TITLE}</h1>
      <p>
        Your assistant finished the app and it runs at an address like <code>localhost:3000</code>.
        That address only works on your own computer: nobody else can open it, not even on the same
        Wi-Fi in most offices, and sending it on WhatsApp does not change that. Putting the app on
        the internet, on a link that stays up and that you can restrict to your team, is what people
        call deploying. Pick the guide for the assistant you used.
      </p>
      <ul>
        {GUIDES.map((g) => (
          <li key={g.href}>
            <Link href={g.href}>
              <strong>{g.title}</strong>
            </Link>
            : {g.body}
          </li>
        ))}
      </ul>
      <h2>The short version</h2>
      <ol>
        <li>
          Install the CLI once, or ask your assistant to: <code>npm install -g ghosty-cli</code>. Every command supports{' '}
          <code>--json</code>, so the assistant can run it for you.
        </li>
        <li>
          Sign in without a password: <code>ghosty login</code> (magic link, Google, GitHub, or passkey).
        </li>
        <li>
          <code>ghosty init</code> creates a normal repository in your own GitHub, and each push
          becomes a live version on its own URL, with access rules you choose.
        </li>
      </ol>
      <p>
        Ready to try it? <a href={signupUrl('deploy')}>Create an account</a> or read the{' '}
        <Link href="/docs">docs</Link>.
      </p>
    </main>
  );
}
