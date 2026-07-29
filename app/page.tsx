import type { Metadata } from 'next';
import { consoleUrl } from '@/lib/console-url';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Ghosty — Build software around your work',
  description:
    'Describe the software your work needs, shape it with the AI assistant you already like, and put it to work with Ghosty.',
  path: '/',
});

// Bounded CDN TTL: without this, Next's static default emits s-maxage=31536000 and the
// apex CDN (USE_ORIGIN_HEADERS) can serve year-old copy after a deploy (CAS-127).
export const revalidate = 3600;

/** A deliberately simple beta page: what Ghosty is, that it's in beta, how to join. */
export default function Home() {
  return (
    <main className="beta-home">
      <header className="beta-hero">
        <div className="beta-hero-copy">
          <p className="eyebrow">Ghosty beta is open</p>
          <h1>What could your software change?</h1>
          <p className="lede">
            Turn the work that matters into an app people can actually use. Build with the
            assistant you already like, then put it to work with Ghosty.
          </p>
          <div className="hero-actions">
            <a className="btn" href={consoleUrl('/signup')}>
              Join the beta <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#how">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="beta-hero-note">Individual builders can start right away. Beta access is free.</p>
        </div>

        <figure className="beta-video">
          <video autoPlay loop muted playsInline preload="metadata">
            <source src="/videos/natural-language-build.mp4" type="video/mp4" />
            A short Ghosty product demo.
          </video>
          <figcaption>From a plain-language request to a working app.</figcaption>
        </figure>
      </header>

      <section id="how" className="beta-section beta-how">
        <div className="beta-section-heading">
          <p className="eyebrow">A simple way to begin</p>
          <h2>Bring one useful idea all the way to life.</h2>
        </div>
        <div className="beta-steps">
          <article>
            <span>01</span>
            <h3>Describe the change</h3>
            <p>Start with the decision, workflow, or everyday frustration you want to improve.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Build with your assistant</h3>
            <p>Keep shaping the details in the coding assistant that already fits your workflow.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Put it to work—blazing fast.</h3>
            <p>Publish the result without turning release day into another project, while the idea is still fresh.</p>
          </article>
        </div>
        <p className="beta-compatibility">
          Use normal code and a copyable handoff prompt with Claude Code, Codex, OpenCode, Pi,
          Cursor, or another assistant you prefer.
        </p>
      </section>

      <section id="access" className="beta-section beta-access">
        <div className="beta-section-heading">
          <p className="eyebrow">Choose your starting point</p>
          <h2>Start on your own, or bring your company.</h2>
        </div>
        <div className="beta-access-grid">
          <article className="beta-access-card">
            <p className="beta-card-label">Individual beta</p>
            <h3>Build your first app today.</h3>
            <p>
              Create an account, start with an idea, and publish when it is ready. Individual
              beta access is free.
            </p>
            <a className="btn" href={consoleUrl('/signup')}>
              Join the beta <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article className="beta-access-card beta-access-company">
            <p className="beta-card-label">Company beta</p>
            <h3>Set up a shared place to build.</h3>
            <p>
              Create your account, choose <strong>My company</strong>, and tell us about your
              workspace. We review every company before its workspace is set up.
            </p>
            <p className="beta-card-note">Company terms are discussed directly; pricing is not public during beta.</p>
            <a className="btn beta-company-btn" href={consoleUrl('/signup')}>
              Apply for company beta <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
