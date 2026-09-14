import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'How to deploy an app built with Claude Code';
const DESCRIPTION =
  'Claude Code writes normal web apps, so you have real options: developer platforms, artifact links, or a managed platform like White Ghost. How to choose and ship.';
const REVIEWED = 'Reviewed by the White Ghost team, September 2026';

const REQUIREMENTS = [
  'The folder Claude Code has been working in, with the app running locally (the localhost link).',
  'A GitHub account. The code is stored in your own account and you can download it as a zip whenever you want.',
  'A Node or Python app. A plain HTML file is not an app by itself; Claude Code can wrap it into one in a few minutes.',
  'A White Ghost account. The Free plan is enough for a first app: 3 apps awake, one builder, every feature included.',
  'Claude Code open in that folder. It does the technical part; you approve.',
];

const PROMPT =
  'Install the ghosty CLI (npm install -g ghosty-cli), sign in with ghosty login, then run ghosty init in this folder to create the app and its repository. Push the code and run ghosty deploy until the app is live. Use --json output and tell me the final URL.';

const STEPS = [
  {
    name: 'Install the CLI once (or let your assistant do it)',
    text: 'npm install -g ghosty-cli. Every command supports --json and ends with a parseable ready line, so Claude Code can drive the whole flow for you.',
    check: 'ghosty --version prints a version number.',
  },
  {
    name: 'Sign in',
    text: 'ghosty login. No passwords: magic link, Google, GitHub, or passkey.',
    check: 'The command ends with a ready line and your email; the console at console.whiteghost.ai shows you signed in.',
  },
  {
    name: 'Scaffold the app',
    text: 'ghosty init asks a few questions (name, what it does, backend language, whether it needs a database) and creates a normal repository in your own GitHub account.',
    check: 'The app appears in the console dashboard, and the repository appears in your GitHub account.',
  },
  {
    name: 'Build with Claude Code',
    text: 'ghosty dev runs the app locally while you keep shaping it with your assistant. Each app ships starter instructions that teach the assistant its conventions.',
    check: 'The localhost link opens the app with your latest changes.',
  },
  {
    name: 'Ship',
    text: 'git push triggers the build and rollout; real builds of a full app have taken 53 seconds and 1 minute 27 seconds. Run ghosty deploy to watch until the new version is live on its own URL, with access controls built in.',
    check: 'The Deploys tab shows the build as successful, and the app URL opens from your phone with Wi-Fi off.',
  },
];

const LIMITS = [
  'Free plan: 3 apps awake and one builder; Solo ($19 a month) raises that to 10 apps awake, custom domains and 10 GB of file storage. Team plans add unlimited seats.',
  'The app scales to zero when idle, so the first visit after a quiet period takes a moment to wake up.',
  'You need a GitHub account: that is where the code lives, and you can leave with it whenever you want.',
  'The access mode (public, shared invite code, or your own sign-in) is part of the app code: changing it later means editing and redeploying.',
  'Preview links for pull requests are public URLs; do not put production data behind a preview.',
  'No background workers or WebSockets yet: long jobs run as scheduled HTTP calls, not as always-on processes.',
];

const FAQ = [
  {
    q: 'Can Claude Code deploy the app by itself?',
    a: 'Yes. The ghosty CLI is designed to be driven by an agent: it signs in with a device flow you approve once, every command supports --json, and long-running commands end with a parseable ready line. You can ask Claude Code to install, initialize, and ship without leaving the conversation.',
  },
  {
    q: 'Do viewers need a Claude account to open my app?',
    a: 'No. Apps deployed with White Ghost live on a normal URL with access rules you choose: public, a shared invite code, workspace members, or the app’s own sign-in. Viewers never need an account on any AI platform.',
  },
  {
    q: 'What if a deploy breaks something?',
    a: 'Run ghosty rollback, or open the Deploys tab and press Redeploy on any previous build. Every build in the history keeps its commit, timing, and log.',
  },
  {
    q: 'Is an app made with Claude Code a special kind of app?',
    a: 'No. Claude Code writes standard web applications. That is why any hosting works in principle; the real question is how much infrastructure (database, access control, updates) you want to assemble yourself.',
  },
  {
    q: 'What happens to the database and files?',
    a: 'Every app gets a managed PostgreSQL database, and file storage you can enable per app, with signed download links that expire. Integration credentials are injected securely by the platform, so provider keys never live in the repo.',
  },
  {
    q: 'Can I leave later?',
    a: 'Yes. The code lives in your own GitHub account from day one: you can leave whenever you like and take the code, the data, and the history with you.',
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
  locale: 'en',
});

// Bounded CDN TTL — see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Pillar guide for the "deploy a Claude Code app" question, answer-first. */
export default function DeployClaudeCode() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'en',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      inLanguage: 'en',
      name: TITLE,
      description: DESCRIPTION,
      step: STEPS.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: `${s.text} How to check: ${s.check}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'White Ghost', item: siteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Deploy guides', item: siteUrl('/deploy') },
        { '@type': 'ListItem', position: 3, name: TITLE, item: siteUrl('/deploy/claude-code') },
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
        <p className="kicker">Deploy guide · {REVIEWED}</p>
        <h1>{TITLE}</h1>
        <p className="lede">
          Claude Code writes normal web applications, so you have real options: a developer
          platform you assemble yourself, a temporary artifact link, or a managed platform. With
          White Ghost the whole flow is one CLI that Claude Code can drive for you, and the app goes
          live with a permanent URL, a database, and access rules you choose. It takes one
          conversation.
        </p>

        <div className="md-prose">
          <h2>What you need before you start</h2>
          <ul>
            {REQUIREMENTS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h2>Tell Claude Code to do it</h2>
          <p>Paste this into the Claude Code conversation, in the folder of your app:</p>
          <pre>
            <code>{PROMPT}</code>
          </pre>
          <p>
            It will ask you to approve the sign-in once (a link opens in your browser) and to confirm
            the answers of the short interview. Everything else it does alone. The steps below are
            what it is doing, with how to check each one.
          </p>

          <h2>From local folder to live URL, in five steps</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text} <em>How to check:</em> {step.check}
              </li>
            ))}
          </ol>

          <h2>Or start from the console and send the work to Claude Code</h2>
          <p>
            The bridge runs in both directions. The Overview of every app has an "Open in Claude
            Code" button, plus "Copy the instructions": a ready-made prompt that carries the app
            URL and the repository URL, so the assistant picks the work up with full context. You
            do not have to explain the project to it.
          </p>

          <h2>What you get after shipping</h2>
          <p>
            Deploying is not the end of the flow. Each app comes with a deploy history (every
            build keeps its commit, timing, and log, with a Redeploy button), a live log feed,
            analytics with requests and errors per day over 7 or 30 day windows, and a live
            preview URL for every open pull request, updated on each push. Secrets are applied
            without a redeploy, scheduled jobs can call your endpoints on a timer, and a custom
            domain comes with SSL issued and renewed automatically.
          </p>

          <h2>Limits and cost</h2>
          <ul>
            {LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p>
            Full plan details on the <Link href="/pricing">pricing page</Link>.
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

          <h2>Related</h2>
          <ul>
            <li>
              <Link href="/localhost">You cannot send a localhost link: how to share an app that only opens on your computer</Link>
            </li>
            <li>
              <Link href="/share/claude-code">How to share what you built with Claude Code with your team</Link>
            </li>
            <li>
              <Link href="/blog/ai-built-app-needs-a-database">Your AI-built app needs a database. Where does it live?</Link>
            </li>
          </ul>
        </div>
      </article>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Your app deserves more than a temporary link.</h2>
        <p>Start on the free plan: 3 apps awake, one builder, every feature included.</p>
        <a className="btn" href={signupUrl('deploy/claude-code')}>
          Start free
        </a>
      </section>
    </>
  );
}
