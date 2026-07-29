import type { Metadata } from 'next';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'How to deploy an app built with Codex';
const DESCRIPTION =
  'Codex writes normal code. ChatGPT Sites hosts it on OpenAI hosting. For an app in your own repo with access rules you choose, deploy it with Ghosty.';

const STEPS = [
  {
    name: 'Install the CLI once',
    text: 'npm install -g ghosty-cli. Every command supports --json and ends with a parseable ready line, so Codex CLI and other agents can drive the whole flow.',
  },
  {
    name: 'Sign in',
    text: 'ghosty login. No passwords: magic link, Google, GitHub, or passkey.',
  },
  {
    name: 'Scaffold the app',
    text: 'ghosty init asks a few questions and creates a normal repository in your own GitHub organization. Bring the code Codex wrote, or keep building inside the scaffold.',
  },
  {
    name: 'Build with your assistant',
    text: 'ghosty dev runs the app locally. Each app ships starter instructions that teach Codex, Claude Code, and other assistants its conventions.',
  },
  {
    name: 'Ship',
    text: 'git push triggers the build and rollout; run ghosty deploy to watch until the new version is live on its own URL, with access controls built in.',
  },
];

const FAQ = [
  {
    q: 'Can a Codex site be shared publicly?',
    a: 'Yes, since ChatGPT Sites went GA in July 2026: paid subscribers can publish publicly viewable sites. The remaining difference is control: with Ghosty the app lives in your own GitHub organization and you choose between public, invite only, workspace members, or the app’s own sign-in, without the app depending on a ChatGPT plan.',
  },
  {
    q: 'Does Ghosty work with Codex, or only with Claude?',
    a: 'It is assistant-agnostic. The apps are normal repositories and the ghosty CLI is plain command-line tooling with --json output, so Codex CLI, Claude Code, Cursor, OpenCode, and other assistants can all drive it.',
  },
  {
    q: 'Can I move an app out of ChatGPT Sites?',
    a: 'The code Codex wrote is yours; recreate it as a repository, run ghosty init in that folder, and ship. From then on the app lives in your own GitHub organization with a database, file storage, and access rules you control.',
  },
  {
    q: 'What does a company get beyond hosting?',
    a: 'An isolated environment per company (its own database, domains, and build pipeline) plus team management: who can build, who can view, and every app in one place.',
  },
];

const OPTIONS = [
  {
    option: 'ChatGPT Sites (Codex)',
    bestFor: 'Paid ChatGPT subscribers publishing a site fast on OpenAI hosting',
    tradeoff:
      'The app lives with OpenAI, creation needs a paid plan, and access gating beyond public-or-workspace is limited',
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
    option: 'Ghosty',
    bestFor: 'Apps anyone you choose can open, no AI account required, in a repo you own',
    tradeoff: 'Managed platform: less infrastructure control than assembling your own stack',
  },
];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — Ghosty`,
  description: DESCRIPTION,
  path: '/deploy/codex',
});

/** Pillar guide for the "deploy a Codex app" question, answer-first. */
export default function DeployCodex() {
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
        { '@type': 'ListItem', position: 1, name: 'Ghosty', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: TITLE, item: siteUrl('/deploy/codex') },
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
          Codex writes normal code, so it can live anywhere. ChatGPT Sites will host it publicly,
          but creation requires a paid plan, the app lives with OpenAI, and access gating beyond
          public-or-workspace is limited. If you want the app in your own repository, on a
          permanent URL, with access rules you choose, deploy it with Ghosty: one CLI that Codex
          can drive for you.
        </p>

        <div className="md-prose">
          <h2>From Codex output to live URL, in five steps</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <p>
            Shortcut: paste this into your assistant and let it do everything above.
            <br />
            <code>
              Install the ghosty CLI, initialize this project with ghosty init, and ship it. Use
              --json output.
            </code>
          </p>

          <h2>Where can a Codex app live? The honest map</h2>
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
        <h2>Ship it where everyone can actually open it.</h2>
        <p>Individual builders can start right away. Beta access is free.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Join the beta
        </a>
      </section>
    </>
  );
}
