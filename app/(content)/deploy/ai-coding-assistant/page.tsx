import type { Metadata } from 'next';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'How to deploy an app built with an AI coding assistant';
const DESCRIPTION =
  'Your AI-built app is a normal web app. White Ghost deploys it: the assistant drives one CLI end to end, and the console can brief the assistant back.';

const STEPS = [
  {
    name: 'Install the CLI once',
    text: 'npm install -g ghosty-cli. Every command supports --json, so Claude Code, Codex CLI, Cursor, and other agents can drive the whole flow without you touching a terminal.',
  },
  {
    name: 'Sign in',
    text: 'ghosty login uses a device flow: the CLI shows a code, you approve it once, and the agent keeps working. No passwords, no browser embedded in the tool.',
  },
  {
    name: 'Scaffold or adopt the app',
    text: 'ghosty init asks a few questions (name, what it does, backend language, whether it needs a database) and creates a normal repository in your own GitHub account. Bring the code your assistant already wrote, or keep building inside the scaffold.',
  },
  {
    name: 'Build with your assistant',
    text: 'ghosty dev runs the app locally while you keep shaping it. Each app ships starter instructions that teach the assistant its conventions.',
  },
  {
    name: 'Ship',
    text: 'Every push to the repository builds and goes live on its own. Run ghosty deploy to watch until the new version is live on its URL, with access controls built in.',
  },
];

const MANAGED_PIECES = [
  'Deployment pipeline',
  'Database',
  'Build accelerator',
  'App registry entry',
  'Preview database',
  'Code repository',
  'Starter code',
  'Live service',
  'App identity',
];

const FAQ = [
  {
    q: 'Can the assistant deploy the app without me?',
    a: 'Yes. The ghosty CLI signs in with a device flow (you approve it once) and every command supports --json, so an agent can create, configure, and ship an app end to end. The console exists so you can watch and manage; it is not required for deploying.',
  },
  {
    q: 'I built the app with Cursor, not Claude Code or Codex. Does this work?',
    a: 'Yes. The platform is assistant-agnostic. The console has one-click "Open in Claude Code" and "Open in Codex" buttons, and a "Copy the instructions" option that produces a ready-made prompt with your app URL and repository URL for Cursor or any other assistant. Underneath, everything is a plain CLI any agent can drive.',
  },
  {
    q: 'Do viewers need an AI account to open my app?',
    a: 'No. Apps deployed with White Ghost live on a normal URL with access rules you choose: public, a shared invite code, workspace members, or the app’s own sign-in. Viewers never need an account on any AI platform.',
  },
  {
    q: 'How fast is a deploy?',
    a: 'Fast. Real builds of a full app with a frontend and a backend have measured 53 seconds and 1 minute 27 seconds from push to live. The app scales to zero when idle, so the first request after inactivity takes a cold start.',
  },
  {
    q: 'What if a deploy breaks something?',
    a: 'Run ghosty rollback, or open the Deploys tab and press Redeploy on any previous build in the history. Every build keeps its commit, timing, and log.',
  },
  {
    q: 'Can I take the app somewhere else later?',
    a: 'Yes. The code lives in your own GitHub account from day one, and the console also offers a .zip download of the source at any time. You can leave with the code and the history.',
  },
];

const OPTIONS = [
  {
    option: 'Artifact and site links (Claude artifacts, ChatGPT Sites)',
    bestFor: 'Showing a prototype quickly inside the AI platform you already use',
    tradeoff:
      'The app lives with the AI vendor: hosting, database, and access rules are limited to what that platform offers',
  },
  {
    option: 'Developer platforms (Vercel, Netlify, Railway, and similar)',
    bestFor: 'Engineers who want to assemble and operate their own stack',
    tradeoff: 'You wire hosting, database, secrets, auth, and permissions yourself',
  },
  {
    option: 'AI app builders (Replit, Lovable, and similar)',
    bestFor: 'Building and hosting inside one vendor’s editor and AI',
    tradeoff: 'You build with their embedded AI, not with the assistant you already use and pay for',
  },
  {
    option: 'White Ghost',
    bestFor: 'Shipping real apps with the AI assistant you already have, onto URLs with access rules you choose',
    tradeoff: 'Managed platform: less infrastructure control than assembling your own stack',
  },
];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — White Ghost`,
  description: DESCRIPTION,
  path: '/deploy/ai-coding-assistant',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Anchor pillar for the "I built an app with an AI assistant, how do I ship it" question. */
export default function DeployAiCodingAssistant() {
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
        {
          '@type': 'ListItem',
          position: 2,
          name: TITLE,
          item: siteUrl('/deploy/ai-coding-assistant'),
        },
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
          You built something with Claude Code, Codex, Cursor, or another assistant, and now you
          want people to use it. The app itself is a normal web application; what it needs is a
          home: hosting, a database, access control, and a way to ship updates. With White Ghost
          the same assistant that built the app can also deploy it. The ghosty CLI is designed for
          agents, and the console can hand your assistant ready-made instructions for the trip
          back.
        </p>

        <div className="md-prose">
          <h2>From your folder to a live URL, in five steps</h2>
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

          <h2>The bridge runs in both directions</h2>
          <p>
            Most platforms treat the AI assistant as something outside. White Ghost connects to it
            from both ends:
          </p>
          <ul>
            <li>
              <strong>Assistant to platform.</strong> The ghosty CLI signs in with a device flow
              and supports --json on every command, so an agent can create an app, configure it,
              and deploy it end to end without a human opening the console.
            </li>
            <li>
              <strong>Platform to assistant.</strong> The Overview of every app has "Open in
              Claude Code" and "Open in Codex" buttons, plus "Copy the instructions": a ready-made
              prompt that carries the app URL and the repository URL, so you can paste it into
              Cursor or any other assistant and it picks the work up from there.
            </li>
          </ul>

          <h2>What the platform manages so you do not have to</h2>
          <p>
            The Overview of each app lists the pieces White Ghost provisions and runs for you,
            each with its status and last update:
          </p>
          <ul>
            {MANAGED_PIECES.map((piece) => (
              <li key={piece}>{piece}</li>
            ))}
          </ul>
          <p>
            You never assembled any of it. Secrets are applied without a redeploy, scheduled jobs
            can call your app’s endpoints on a timer, a custom domain comes with SSL issued and
            renewed automatically, and every open pull request gets a live preview URL that
            updates on each push.
          </p>

          <h2>The honest part: what White Ghost does not do</h2>
          <ul>
            <li>
              It is not a no-code builder. The assistant writes real code into a real repository;
              White Ghost deploys and manages it.
            </li>
            <li>
              No WebSockets or background workers today: apps serve HTTP requests, so real-time
              chat or long-running jobs need a different shape.
            </li>
            <li>
              The backend language (Node or Python) is chosen when the app is created; switching
              later means creating a new app.
            </li>
            <li>
              Apps scale to zero when idle, which keeps them free of babysitting but means a cold
              start on the first request after inactivity.
            </li>
          </ul>

          <h2>Where can an AI-built app live? The honest map</h2>
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
        <h2>The assistant built it. Let it ship it too.</h2>
        <p>Individual builders can start right away. Beta access is free.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Join the beta
        </a>
      </section>
    </>
  );
}
