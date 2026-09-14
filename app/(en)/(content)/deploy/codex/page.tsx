import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = 'How to deploy an app built with Codex';
const DESCRIPTION =
  'Codex writes normal code. ChatGPT Sites hosts it on OpenAI hosting. For an app in your own repo with access rules you choose, deploy it with White Ghost.';

const REVIEWED = 'Reviewed by the White Ghost team, September 2026';

const REQUIREMENTS = [
  'The folder Codex has been working in, with the app running locally (the localhost link).',
  'A GitHub account. The code is stored in your own account and you can download it as a zip whenever you want.',
  'A Node or Python app. A plain HTML file is not an app by itself; Codex can wrap it into one in a few minutes.',
  'A White Ghost account. The Free plan is enough for a first app: 3 apps awake, one builder, every feature included.',
  'Codex CLI (or the Codex extension) open in that folder. It does the technical part; you approve.',
];

const PROMPT =
  'Install the ghosty CLI (npm install -g ghosty-cli), sign in with ghosty login, then run ghosty init in this folder to create the app and its repository. Push the code and run ghosty deploy until the app is live. Use --json output and tell me the final URL.';

const LIMITS = [
  'Free plan: 3 apps awake and one builder; Solo ($19 a month) raises that to 10 apps awake, custom domains and 10 GB of file storage. Team plans add unlimited seats.',
  'The app scales to zero when idle, so the first visit after a quiet period takes a moment to wake up.',
  'You need a GitHub account: that is where the code lives, and you can leave with it whenever you want.',
  'The access mode (public, shared invite code, or your own sign-in) is part of the app code: changing it later means editing and redeploying.',
  'Preview links for pull requests are public URLs; do not put production data behind a preview.',
  'No background workers or WebSockets yet: long jobs run as scheduled HTTP calls, not as always-on processes.',
];

const STEPS = [
  {
    name: 'Install the CLI once (or let your assistant do it)',
    text: 'npm install -g ghosty-cli. Every command supports --json and ends with a parseable ready line, so Codex CLI and other agents can drive the whole flow.',
    check: 'ghosty --version prints a version number.',
  },
  {
    name: 'Sign in',
    text: 'ghosty login. No passwords: magic link, Google, GitHub, or passkey.',
    check: 'The command ends with a ready line and your email; the console at console.whiteghost.ai shows you signed in.',
  },
  {
    name: 'Scaffold the app',
    text: 'ghosty init asks a few questions and creates a normal repository in your own GitHub account. Bring the code Codex wrote, or keep building inside the scaffold.',
    check: 'The app appears in the console dashboard, and the repository appears in your GitHub account.',
  },
  {
    name: 'Build with your assistant',
    text: 'ghosty dev runs the app locally. Each app ships starter instructions that teach Codex, Claude Code, and other assistants its conventions.',
    check: 'The localhost link opens the app with your latest changes.',
  },
  {
    name: 'Ship',
    text: 'git push triggers the build and rollout; real builds of a full app have taken 53 seconds and 1 minute 27 seconds. Run ghosty deploy to watch until the new version is live on its own URL, with access controls built in.',
    check: 'The Deploys tab shows the build as successful, and the app URL opens from your phone with Wi-Fi off.',
  },
];

const FAQ = [
  {
    q: 'Can a Codex site be shared publicly?',
    a: 'Yes, since ChatGPT Sites went GA in July 2026: paid subscribers can publish publicly viewable sites. The remaining difference is control: with White Ghost the app lives in your own GitHub organization and you choose between public, a shared invite code, workspace members, or the app’s own sign-in, without the app depending on a ChatGPT plan.',
  },
  {
    q: 'Does White Ghost work with Codex, or only with Claude?',
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
    option: 'White Ghost',
    bestFor: 'Apps anyone you choose can open, no AI account required, in a repo you own',
    tradeoff: 'Managed platform: less infrastructure control than assembling your own stack',
  },
];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — White Ghost`,
  description: DESCRIPTION,
  path: '/deploy/codex',
  locale: 'en',
});

// Bounded CDN TTL — see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Pillar guide for the "deploy a Codex app" question, answer-first. */
export default function DeployCodex() {
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
        { '@type': 'ListItem', position: 3, name: TITLE, item: siteUrl('/deploy/codex') },
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
          Codex writes normal code, so it can live anywhere. ChatGPT Sites will host it publicly,
          but creation requires a paid plan, the app lives with OpenAI, and access gating beyond
          public-or-workspace is limited. If you want the app in your own repository, on a
          permanent URL, with access rules you choose, deploy it with White Ghost: one CLI that Codex
          can drive for you.
        </p>

        <div className="md-prose">
          <h2>What you need before you start</h2>
          <ul>
            {REQUIREMENTS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h2>Tell Codex to do it</h2>
          <p>Paste this into Codex, in the folder of your app:</p>
          <pre>
            <code>{PROMPT}</code>
          </pre>
          <p>
            It will ask you to approve the sign-in once (a link opens in your browser) and to confirm
            the answers of the short interview. Everything else it does alone. The steps below are
            what it is doing, with how to check each one.
          </p>

          <h2>From Codex output to live URL, in five steps</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text} <em>How to check:</em> {step.check}
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

          <h2>Or start from the console and send the work to Codex</h2>
          <p>
            The bridge runs in both directions. The Overview of every app has an "Open in Codex"
            button (and one for Claude Code), plus "Copy the instructions": a ready-made prompt
            that carries the app URL and the repository URL, so the assistant picks the work up
            with full context. You do not have to explain the project to it.
          </p>

          <h2>What you get after shipping</h2>
          <p>
            Deploying is not the end of the flow. Each app comes with a deploy history (every
            build keeps its commit, timing, and log, with a Redeploy button), a live log feed,
            analytics with requests and errors per day over 7 or 30 day windows, and a live
            preview URL for every open pull request, updated on each push. Secrets are applied
            without a redeploy, scheduled jobs can call your endpoints on a timer, and a custom
            domain comes with SSL issued and renewed automatically. If a deploy breaks, ghosty
            rollback or the Redeploy button takes you back.
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

          <h2>Limits and cost</h2>
          <ul>
            {LIMITS.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          <p>
            Full plan details on the <Link href="/pricing">pricing page</Link>.
          </p>

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
              <Link href="/deploy/claude-code">How to deploy an app built with Claude Code</Link>
            </li>
            <li>
              <Link href="/blog/ai-built-app-needs-a-database">Your AI-built app needs a database. Where does it live?</Link>
            </li>
          </ul>
        </div>
      </article>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Ship it where everyone can actually open it.</h2>
        <p>Start on the free plan: 3 apps awake, one builder, every feature included.</p>
        <a className="btn" href={signupUrl('deploy/codex')}>
          Start free
        </a>
      </section>
    </>
  );
}
