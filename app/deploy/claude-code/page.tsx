import type { Metadata } from 'next';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'How to deploy an app built with Claude Code';
const DESCRIPTION =
  'Claude Code writes normal web apps, so you have real options: developer platforms, artifact links, or a managed platform like White Ghost. How to choose and ship.';

const STEPS = [
  {
    name: 'Install the CLI once',
    text: 'npm install -g ghosty-cli. Every command supports --json and ends with a parseable ready line, so Claude Code can drive the whole flow for you.',
  },
  {
    name: 'Sign in',
    text: 'ghosty login. No passwords: magic link, Google, GitHub, or passkey.',
  },
  {
    name: 'Scaffold the app',
    text: 'ghosty init asks a few questions (name, what it does, backend language, whether it needs a database) and creates a normal repository in your own GitHub organization.',
  },
  {
    name: 'Build with Claude Code',
    text: 'ghosty dev runs the app locally while you keep shaping it with your assistant. Each app ships starter instructions that teach the assistant its conventions.',
  },
  {
    name: 'Ship',
    text: 'git push triggers the build and rollout; run ghosty deploy to watch until the new version is live on its own URL, with access controls built in.',
  },
];

const FAQ = [
  {
    q: 'Can Claude Code deploy the app by itself?',
    a: 'Yes. The ghosty CLI is designed to be driven by an agent: every command supports --json and long-running commands end with a parseable ready line. You can ask Claude Code to install, initialize, and ship without leaving the conversation.',
  },
  {
    q: 'Do viewers need a Claude account to open my app?',
    a: 'No. Apps deployed with White Ghost live on a normal URL with access rules you choose: public, invite only, workspace members, or the app’s own sign-in. Viewers never need an account on any AI platform.',
  },
  {
    q: 'Is an app made with Claude Code a special kind of app?',
    a: 'No. Claude Code writes standard web applications. That is why any hosting works in principle; the real question is how much infrastructure (database, access control, updates) you want to assemble yourself.',
  },
  {
    q: 'What happens to the database and files?',
    a: 'White Ghost provisions managed storage per app, isolated per company, and integrations are proxied by the platform so provider keys never live in the repo.',
  },
  {
    q: 'Can I leave later?',
    a: 'Yes. The code lives in your own GitHub organization from day one: you can leave whenever you like and take the code, the data, and the history with you.',
  },
];

const OPTIONS = [
  {
    option: 'Claude artifacts',
    bestFor: 'Showing a prototype right now',
    tradeoff:
      'A capture of work, not an application: single page, no backend or database, and retention policies or sharing toggles can kill the link',
  },
  {
    option: 'Vercel / Netlify / Cloudflare',
    bestFor: 'Engineers shipping public production software',
    tradeoff: 'You assemble hosting, database, auth, and permissions yourself',
  },
  {
    option: 'Railway / Render / Fly.io',
    bestFor: 'Apps needing persistent servers and workers',
    tradeoff: 'Same assembly, plus infrastructure to operate',
  },
  {
    option: 'White Ghost',
    bestFor: 'Builders and teams shipping real apps with the AI assistant they already have',
    tradeoff: 'Managed platform: less infrastructure control than assembling your own stack',
  },
];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — White Ghost`,
  description: DESCRIPTION,
  path: '/deploy/claude-code',
});

/** Pillar guide for the "deploy a Claude Code app" question, answer-first. */
export default function DeployClaudeCode() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: TITLE,
      description: DESCRIPTION,
      step: STEPS.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'White Ghost', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: TITLE, item: siteUrl('/deploy/claude-code') },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}

      <article className="docs-article">
        <p className="kicker">Deploy guide</p>
        <h1>{TITLE}</h1>
        <p className="lede">
          Claude Code writes normal web applications, so you have real options: a developer
          platform you assemble yourself, a temporary artifact link, or a managed platform. With
          White Ghost the whole flow is one CLI that Claude Code can drive for you, and the app goes
          live with access controls built in.
        </p>

        <div className="md-prose">
          <h2>From local folder to live URL, in five steps</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <p>
            Shortcut: paste this into Claude Code and let it do everything above.
            <br />
            <code>
              Install the ghosty CLI, initialize this project with ghosty init, and ship it. Use
              --json output.
            </code>
          </p>

          <h2>Where can a Claude Code app live? The honest map</h2>
          <table>
            <thead>
              <tr>
                <th>Option</th>
                <th>Best for</th>
                <th>The trade-off</th>
              </tr>
            </thead>
            <tbody>
              {OPTIONS.map((row) => (
                <tr key={row.option}>
                  <td>
                    <strong>{row.option}</strong>
                  </td>
                  <td>{row.bestFor}</td>
                  <td>{row.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Questions people actually ask</h2>
          {FAQ.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </article>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Your app deserves more than a temporary link.</h2>
        <p>Individual builders can start right away. Beta access is free.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Join the beta
        </a>
      </section>
    </>
  );
}
