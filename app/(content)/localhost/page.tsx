import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = "You cannot send a localhost link. How to share an app that only opens on your computer";
const DESCRIPTION = "A localhost link only works on your own machine. Why, when a tunnel is enough, and how to deploy an app built with Claude Code so your team can open it anytime.";
const PATH = "/localhost";
/** Shorter <title>; the long TITLE stays as the H1. */
const TITLE_TAG = "How to share an app that only opens on localhost";

const STEPS = [{"name": "Create the app", "text": "In the folder Claude Code has been working in, run ghosty init. It creates a repository in your own GitHub account and registers the app."}, {"name": "Let the assistant do the technical part", "text": "Every White Ghost app has Open in Claude Code and Open in Codex buttons, plus Copy the instructions: a ready prompt with the app URL and the repository URL. Paste it and Claude Code moves the project into place and pushes it."}, {"name": "Every push goes live", "text": "There is no separate publish step. Real builds on a full app have taken 53 seconds and 1 minute 27 seconds. If something breaks, ghosty rollback or the Redeploy button on any earlier build puts the previous version back."}, {"name": "Choose who can open it", "text": "Public, a shared invite code (one code for everyone, so treat it like a shared password), or a sign-in you write into the app. The mode is part of the app's code, so changing it later means editing and redeploying."}, {"name": "Share a permanent address", "text": "The app gets its own URL that does not change and does not depend on your computer. If you own a domain, point it at the app; the certificate is issued and renewed for you."}];

const FAQ = [{"q": "I built something with Claude Code and it opens at localhost:3000. How do I send it to my boss?", "a": "You cannot send that link: localhost means \"this computer\", so it only opens on yours. For a quick demo, open a temporary tunnel with a tool like ngrok and send the URL it gives you. For something your boss will keep using, deploy the app: with White Ghost you run ghosty init in the project folder, let Claude Code push it, and share the permanent URL the app gets."}, {"q": "Can I send my localhost link over WhatsApp so my team can open it?", "a": "You can send it, but nobody will be able to open it. A localhost address points to whoever's phone or laptop is reading it, not to your computer. Send a public URL instead: a tunnel URL for a short demo, or the app's own address once it is deployed."}, {"q": "Why can't my coworker open the http://localhost:5173 link that Claude Code gave me?", "a": "Because port 5173 is a door on your computer, not on theirs. Their browser looked for the app on their own machine and found nothing. To share it you either tunnel it (temporary, tied to your laptop) or deploy it to a platform so it gets a public, permanent address."}, {"q": "Claude Code made me a little web tool on my laptop. What is the easiest way to put it online so other people can use it? I am not a developer.", "a": "Deploy it instead of tunneling it. On White Ghost: run ghosty init in the folder, click Open in Claude Code on the app page so the assistant moves the code and pushes it, and every push goes live at a permanent URL. You choose whether the link is public, needs a shared invite code, or requires a sign-in you build into the app."}, {"q": "Is ngrok a good way to share my localhost app with my team permanently?", "a": "Not for permanent sharing. ngrok forwards traffic to the app running on your computer, so the link only works while your laptop is on and the app is running. The free plan does give you one fixed dev domain per account, so the address no longer changes on every restart, but visitors see a warning page first, data is capped at 1 GB a month and you cannot use your own domain. It is good for a demo. For a team tool that has to be up every day, deploy the app to a platform with a fixed address and an access mode."}];

export const metadata: Metadata = pageMeta({
  title: `${TITLE_TAG} — White Ghost`,
  description: DESCRIPTION,
  path: PATH,
  locale: "en",
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Pillar for the localhost questions (q13 to q16, q29): answer-first, with the literal questions as FAQ. */
export default function Page() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: "en",
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      inLanguage: "en",
      name: TITLE,
      description: DESCRIPTION,
      step: STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'White Ghost', item: siteUrl("/") },
        { '@type': 'ListItem', position: 2, name: TITLE, item: siteUrl(PATH) },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      <article className="docs-article">
        <p className="kicker">Sharing guide</p>
        <h1>{TITLE}</h1>
        <p className="lede">No. A link that starts with http://localhost only works on the computer where the app is running: localhost is the name every computer gives to itself. For a ten-minute demo, open a tunnel. For something your team will keep using, deploy the app so it lives on its own, with a permanent address and an access rule.</p>

        <div className="md-prose">
          <h2>Why the link does not work for anyone else</h2>
          <p>
            When Claude Code says "your app is running at http://localhost:3000", it means a small
            server is running on this computer, on door number 3000. Two things follow. The address
            is relative to whoever reads it: localhost on your machine is your machine, localhost
            on your coworker's machine is theirs. And the app only exists while your computer runs
            it: close the terminal or put the laptop to sleep and it is gone, even for you.
          </p>

          <h2>Tunnel or deployment: which one you need</h2>
          <table>
            <thead>
              <tr>
                <th>You want to...</th>
                <th>Use</th>
                <th>The catch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Show it on a call in the next five minutes</td>
                <td>A tunnel (ngrok, Cloudflare Tunnel, localtunnel)</td>
                <td>The link only works while your laptop is awake and the app is running; the free plan shows visitors a warning page first and caps monthly data; anyone with the URL gets in</td>
              </tr>
              <tr>
                <td>Let your team open it tomorrow, from their phones, without you online</td>
                <td>A deployment</td>
                <td>Vercel, Netlify, Railway or Render assume you know Git, a terminal and build settings</td>
              </tr>
              <tr>
                <td>Keep it inside the team, or behind a login, and update it every time Claude Code changes something</td>
                <td>A deployment on White Ghost</td>
                <td>Built for the person who never wants to read a build log; needs a GitHub account, where your code stays yours</td>
              </tr>
            </tbody>
          </table>

          <h2>From localhost to a link your team can open</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <h2>What else comes with it</h2>
          <p>
            Most apps built with an assistant need more than a web page. A White Ghost app includes
            a managed PostgreSQL database, file storage that is added when your code needs it,
            secrets you paste once in the console, scheduled jobs, a deploy history with logs and
            a preview URL for every open pull request. The console lists the nine pieces it
            manages for you, with the status of each.
          </p>
          <h2>Related</h2>
          <ul>
            <li>
              <Link href="/blog/cannot-send-localhost-link">A walkthrough: from localhost:3000 to a link your boss can open</Link>
            </li>
            <li>
              <Link href="/share/claude-code">How to share what you built with Claude Code with your team</Link>
            </li>
            <li>
              <Link href="/deploy/claude-code">How to deploy an app built with Claude Code</Link>
            </li>
          </ul>
          <h2>Honest limits</h2>
          <ul>
            <li>White Ghost runs Node and Python apps. A plain HTML file is not an app by itself; Claude Code can wrap it into one in a few minutes.</li>
            <li>The app scales to zero when idle, so the first visit after a quiet period takes a moment to wake up.</li>
            <li>You need a GitHub account: the code is stored in your account and you can download it as a zip whenever you want.</li>
            <li>Preview links for pull requests are public URLs; do not put production data behind a preview.</li>
          </ul>

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
        <h2>Your app deserves more than a link that dies with your laptop.</h2>
        <p>Start on the free plan: 3 apps awake, one builder, every feature included.</p>
        <a className="btn" href={signupUrl('localhost')}>
          Start free
        </a>
      </section>
    </>
  );
}
