import type { Metadata } from 'next';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { pageMeta, siteUrl } from '@/lib/site';

const TITLE = "How to share what you built with Claude Code with your team";
const DESCRIPTION = "Three ways to share a Claude Code app, from a zip to a deployed tool with a login. Which one fits, and how to do the last one without learning Git or servers.";
const PATH = "/share/claude-code";

const STEPS = [{"name": "Create the app", "text": "In the folder Claude Code has been working in, run ghosty init. It creates a repository in your own GitHub account and registers the app. You need a GitHub account; that is where your code lives, so it stays yours."}, {"name": "Hand the rest to the assistant", "text": "Every White Ghost app has Open in Claude Code and Open in Codex buttons, plus Copy the instructions: a ready prompt with the app URL and the repository URL. Paste it and Claude Code moves the project into place, adds the access mode you chose, and pushes."}, {"name": "Every push goes live", "text": "No separate publish step. Real builds on a full app have taken 53 seconds and 1 minute 27 seconds. ghosty rollback, or the Redeploy button on any earlier build, puts the previous version back."}, {"name": "Send one link", "text": "The app's URL is permanent. If you own a domain, point it at the app and the certificate is issued and renewed for you. When Claude Code changes something, push again and everyone sees the new version at the same address."}];

const FAQ = [{"q": "How do I share a Claude artifact with my team so they can use it every day without a Claude account?", "a": "Turn it into a deployed app instead of a shared artifact. An artifact link is a snapshot inside the AI product; a deployed app is a normal website. On White Ghost you run ghosty init, let Claude Code move the artifact's code into the app and push it, and your team opens it at a permanent URL without any Claude account. You choose whether it is public, behind a shared invite code, or behind a sign-in you build in."}, {"q": "I made a dashboard with Claude Code for my team. How do I share it so only people at my company can open it?", "a": "Deploy it with an access mode. On White Ghost the honest answer for \"only people at my company\" is your own sign-in: the app asks for a login you write into it, with Claude Code's help. A shared invite code is simpler but it is one code for everyone, so treat it like a shared password."}, {"q": "How do I put a tool I built with AI online with a password so only my team can see it?", "a": "Choose the shared invite code mode when you create the app on White Ghost: everyone who opens the link is asked for the code you hand them. It is one code for the whole team, not per-person passwords. For named accounts, use the own sign-in mode instead."}, {"q": "What is the simplest way to publish a small internal app made with Claude Code without learning Git or servers?", "a": "Run ghosty init in the project folder and hand the rest to Claude Code through the Open in Claude Code button. You type one command; the assistant creates the repository, pushes, and the app goes live at a permanent URL. You do need a GitHub account, because the code is stored there and stays yours."}, {"q": "Does my team need a Claude account or any AI account to use the app?", "a": "No. A deployed White Ghost app is a normal website at a normal URL. The only thing they may need is the invite code or the sign-in you chose."}];

export const metadata: Metadata = pageMeta({
  title: `${TITLE} — White Ghost`,
  description: DESCRIPTION,
  path: PATH,
  locale: "en",
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Pillar for the 'how do I share this with my team' questions (q17, q19, q20, q22): answer-first, literal questions as FAQ. */
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
        <p className="lede">Deploy it. Sending the folder, a zip or a localhost link gives your coworkers a copy or a dead link, not a tool they can open every day. A deployed app lives at one permanent address, updates every time Claude Code changes something, and you decide who can open it. On White Ghost that takes one command and the assistant does the rest.</p>

        <div className="md-prose">
          <h2>The three ways to share, honestly</h2>
          <table>
            <thead>
              <tr>
                <th>Way</th>
                <th>What your team gets</th>
                <th>What breaks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The folder or a zip</td>
                <td>A copy of the code they have to run themselves</td>
                <td>Everyone needs the tools installed; every change means sending it again; no shared data</td>
              </tr>
              <tr>
                <td>A localhost or tunnel link</td>
                <td>A window into the app on your laptop</td>
                <td>Dies when your computer sleeps; the free tunnel URL changes on restart; anyone with the URL gets in</td>
              </tr>
              <tr>
                <td>A deployed app</td>
                <td>One permanent URL, one database, one place to update</td>
                <td>Most platforms expect Git, a terminal and build settings. White Ghost is the one built for the person who has none of that</td>
              </tr>
            </tbody>
          </table>

          <h2>Who can open it: the three access modes</h2>
          <ul>
            <li><strong>Public.</strong> Anyone with the link.</li>
            <li><strong>A shared invite code.</strong> People need a code you hand them. It is one code for everyone, not a list of named guests, so treat it like a shared password.</li>
            <li><strong>Your own sign-in.</strong> The app asks for a login you write into it, for example with Claude Code's help. This is the mode for "only people at my company".</li>
          </ul>
          <p>
            The mode is part of the app's code, so changing it later means editing and redeploying
            rather than flipping a switch. Viewers never need an account on any AI platform.
          </p>

          <h2>From your laptop to your team, in four steps</h2>
          <ol>
            {STEPS.map((step) => (
              <li key={step.name}>
                <strong>{step.name}.</strong> {step.text}
              </li>
            ))}
          </ol>
          <h2>What your team's tool gets for free</h2>
          <p>
            A managed PostgreSQL database (so everyone works on the same data, not on copies), file
            storage that is added when your code needs it, secrets you paste once in the console
            and never in the code, integrations with services like Slack, Stripe or OpenAI without
            pasting API keys, scheduled jobs, analytics with requests and errors per day, and a
            preview URL for every open pull request so you can check a change before it ships.
          </p>
          <h2>Honest limits</h2>
          <ul>
            <li>White Ghost runs Node and Python apps. A single HTML file goes inside a small web app; Claude Code does that in minutes.</li>
            <li>The app scales to zero when idle, so the first visit after a quiet period takes a moment to wake up.</li>
            <li>The shared invite code is not a guest list: there is no per-person revocation. If that matters, use your own sign-in.</li>
            <li>Preview links for pull requests are public URLs; keep production data out of previews.</li>
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
        <h2>Your team deserves a tool, not a copy of one.</h2>
        <p>Individual builders can start right away. Beta access is free.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Join the beta
        </a>
      </section>
    </>
  );
}
