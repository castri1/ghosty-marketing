import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { getDocPages } from '@/lib/content';
import { pageMeta } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: 'Docs — White Ghost',
  description:
    'Get started with White Ghost: set up your company, let your assistant install the CLI, and ship your first app. Plus guides for every platform capability.',
  path: '/docs',
});

/** Docs / quickstart — ported from the console's marketing/Docs.tsx. */
export default async function Docs() {
  const docPages = await getDocPages();
  return (
    <>
      <header className="docs-hero">
        <p className="kicker reveal">Quickstart</p>
        <h1 className="reveal d1">
          Get started with <em>White Ghost.</em>
        </h1>
        <p className="lede reveal d2">
          Two paths, depending on where you sit. Admins set the company up once in the control
          tower. Builders connect their coding assistant, which installs the CLI and ships apps from
          their laptop. Pick yours below.
        </p>
        <div className="docs-toc reveal d3">
          <a href="#companies">
            <span className="docs-toc-num">A</span>
            <span className="docs-toc-text">
              <strong>For companies</strong>Set up your isolated environment
            </span>
          </a>
          <a href="#builders">
            <span className="docs-toc-num">B</span>
            <span className="docs-toc-text">
              <strong>For builders</strong>Ship your first app
            </span>
          </a>
        </div>
      </header>

      {/* ── FOR COMPANIES ─────────────────────────── */}
      <section id="companies">
        <p className="section-label">For companies — the admin setup</p>

        <p className="docs-intro">
          Setup happens once, in the <a href="https://ct.whiteghost.ai">control tower</a>. You
          describe your company, point us at your GitHub organization, and submit. White Ghost then
          provisions a dedicated environment for you — your own cloud project, database, domains,
          and CI/CD. Provisioning is reviewed by us before it goes live, so this isn&apos;t
          instant; you&apos;ll watch the status move in your dashboard and your company goes live
          at <code>{'{slug}.whiteghost.ai'}</code> when it&apos;s active.
        </p>

        <div className="steps">
          <div className="step">
            <div>
              <h3>Sign in to the control tower</h3>
              <p>
                Go to <a href="https://ct.whiteghost.ai">ct.whiteghost.ai</a> and sign in with
                Google.
              </p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>Create your company</h3>
              <p>
                Pick a name and a short URL slug — the slug becomes{' '}
                <code>{'{slug}.whiteghost.ai'}</code> — and a contact email we can reach you at.
              </p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>Choose your branding</h3>
              <p>
                Set the product name your employees will see, a primary color, and an optional
                logo. This is how White Ghost shows up inside your company.
              </p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>Connect your GitHub organization</h3>
              <p>
                Install the White Ghost GitHub App into your org. Your application source code stays in{' '}
                <strong>your own GitHub organization</strong> — White Ghost creates and manages
                repositories there, but never takes custody of your code.
              </p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>
                Invite your team <span className="docs-opt">optional</span>
              </h3>
              <p>
                Add teammates by email from your Team settings — they get an email and can sign
                in right away. Members build apps; admins also help manage the company. You can
                do this any time, before or after your workspace goes live.
              </p>
            </div>
          </div>
          <div className="step">
            <div>
              <h3>Submit and watch it provision</h3>
              <p>
                Submit your company for provisioning. White Ghost stands up an isolated environment —
                its own cloud project, database, domains, and CI/CD. Track the status in your
                dashboard; when it&apos;s active, your company is live at{' '}
                <code>{'{slug}.whiteghost.ai'}</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="docs-callout">
          <h3>Why isolation matters</h3>
          <p>
            Every company gets its own dedicated environment — separate infrastructure, separate
            database, separate domains. Your apps never share a wall with another customer&apos;s.
            And because your code lives in your own GitHub organization, you can leave whenever you
            like and take everything with you: the code, the data, and the history.
          </p>
        </div>
      </section>

      {/* ── FOR BUILDERS ──────────────────────────── */}
      <section id="builders">
        <p className="section-label">For builders — ship your first app</p>

        <p className="docs-intro">
          Once your company is active, you don&apos;t touch cloud consoles, credentials, or
          pipelines. One CLI (your assistant can install it for you), a short interview, and a push.
          Everything below
          assumes your admin has set your company up and added you to the team. Building on your
          own? Start with the guides for <Link href="/deploy/claude-code">Claude Code</Link> or{' '}
          <Link href="/deploy/codex">Codex</Link>, the <Link href="/localhost">localhost</Link>{' '}
          explainer, or <Link href="/blog/ai-built-app-needs-a-database">what happens to your data</Link>.
        </p>

        <div className="docs-flow">
          <div className="docs-flow-step">
            <span className="docs-flow-num">01</span>
            <div>
              <h3>Install the CLI</h3>
              <p>One global install on macOS, Linux, or Windows. Paste the command, or ask your assistant to run it.</p>
              <div className="term">
                <span className="term-cmd">
                  <span className="term-p">$</span> npm install -g ghosty-cli
                </span>
              </div>
            </div>
          </div>

          <div className="docs-flow-step">
            <span className="docs-flow-num">02</span>
            <div>
              <h3>Sign in</h3>
              <p>
                Pass your company slug. The CLI opens your browser; sign in with your work Google
                account.
              </p>
              <div className="term">
                <span className="term-cmd">
                  <span className="term-p">$</span> ghosty login --company{' '}
                  <span className="term-arg">your-company-slug</span>
                </span>
              </div>
            </div>
          </div>

          <div className="docs-flow-step">
            <span className="docs-flow-num">03</span>
            <div>
              <h3>Create an app</h3>
              <p>
                A short interview — name, what it does, backend language, whether it needs a
                database — scaffolds a complete, working app.
              </p>
              <div className="term">
                <span className="term-cmd">
                  <span className="term-p">$</span> ghosty init
                </span>
              </div>
            </div>
          </div>

          <div className="docs-flow-step">
            <span className="docs-flow-num">04</span>
            <div>
              <h3>Provision it</h3>
              <p>
                Create the repo, build pipeline, database, and live URL for your app, and wait
                until everything is ready.
              </p>
              <div className="term">
                <span className="term-cmd">
                  <span className="term-p">$</span> ghosty provision
                </span>
              </div>
            </div>
          </div>

          <div className="docs-flow-step">
            <span className="docs-flow-num">05</span>
            <div>
              <h3>Run it locally</h3>
              <p>Frontend and backend on your machine, against your own personal dev database.</p>
              <div className="term">
                <span className="term-cmd">
                  <span className="term-p">$</span> ghosty dev
                </span>
              </div>
            </div>
          </div>

          <div className="docs-flow-step">
            <span className="docs-flow-num">06</span>
            <div>
              <h3>Ship it</h3>
              <p>
                A plain <code>git push</code> builds and deploys automatically. Your app goes live
                at <code>{'{app}.{your-company-slug}.whiteghost.ai'}</code>.
              </p>
              <div className="term">
                <span className="term-cmd">
                  <span className="term-p">$</span> git push
                </span>
                <span className="term-out">
                  <span className="term-ok">✓</span> deployed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-callout">
          <h3>Where everything lives</h3>
          <p>
            Find all of your company&apos;s apps in the catalog at{' '}
            <code>{'{your-company-slug}.whiteghost.ai'}</code>. From the console there you manage
            environment variables, logs, deploys, and your database — no cloud console required.
          </p>
        </div>

        <h2 className="docs-h2">CLI reference</h2>
        <p className="docs-intro">
          Every command supports <code>--json</code> for machine-readable output, and long-running
          commands end with a single parseable <code>ready</code> / <code>READY</code> line.
          Interactive prompts only appear on a TTY when a required value is missing — every prompt
          can be skipped with flags.
        </p>

        <div className="cmd-table">
          <div className="cmd-row cmd-head">
            <span className="cmd-name">Command</span>
            <span className="cmd-desc">What it does</span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty login</span>
            <span className="cmd-desc">
              Browser sign-in (loopback OAuth). <code>{'--company <slug>'}</code> or{' '}
              <code>{'--admin-url <url>'}</code>; <code>--no-browser</code> prints the URL.
            </span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty whoami</span>
            <span className="cmd-desc">
              Show the signed-in builder, GitHub username, and apps.
            </span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty init</span>
            <span className="cmd-desc">
              Scaffold a new app (interview; all answers available as flags; <code>--yes</code> for
              defaults).
            </span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty dev</span>
            <span className="cmd-desc">
              Run frontend + backend locally with your personal dev database.
            </span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty provision</span>
            <span className="cmd-desc">
              Create everything the app needs on the platform and wait until it&apos;s ready.
            </span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty deploys</span>
            <span className="cmd-desc">Inspect production deploy history for this app.</span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty logs</span>
            <span className="cmd-desc">Stream and inspect production logs.</span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty redeploy</span>
            <span className="cmd-desc">Trigger a fresh production deploy.</span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">{'ghosty profile --github <username>'}</span>
            <span className="cmd-desc">
              Record your GitHub username (grants push access on app repos).
            </span>
          </div>
          <div className="cmd-row">
            <span className="cmd-name">ghosty preflight</span>
            <span className="cmd-desc">Check Node, git, sign-in, and platform reachability.</span>
          </div>
        </div>

        <p className="docs-foot-note">
          Credentials live in <code>~/.ghosty/profiles.json</code> with owner-only permissions, one
          profile per company — so a single laptop can talk to more than one company.
        </p>
      </section>

      {/* ── GUIDES (docs registry entries) ────────── */}
      {docPages.length > 0 && (
        <section id="guides">
          <p className="section-label">Guides — every capability, explained</p>
          <div className="docs-toc guides-toc">
            {docPages.map((p) => (
              <Link key={p.slug} href={`/docs/${p.slug}`}>
                <span className="docs-toc-text">
                  <strong>{p.title}</strong>
                  {p.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Ready to ship something?</h2>
        <p>Create your account and go from idea to live app today.</p>
        <a className="btn" href={signupUrl('docs')}>
          Sign up — it&apos;s free
        </a>
      </section>
    </>
  );
}
