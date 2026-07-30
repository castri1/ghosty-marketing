/**
 * Glossary entries for /glossary — static, repo-committed by design (they are
 * page copy, not operator-managed content like docs/changelog). Each
 * definition answers its question in the first sentences (answer-first), then
 * expands. New term = new object here; the pages are data-driven.
 */

export interface GlossaryEntry {
  slug: string;
  term: string;
  /** H1, phrased as the query people actually type. */
  question: string;
  /** 2-3 self-contained lines: the extractable answer. */
  definition: string;
  sections: { heading: string; body: string }[];
  related: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: 'shadow-ai',
    term: 'Shadow AI',
    question: 'What is shadow AI?',
    definition:
      'Shadow AI is the use of AI tools and AI-built software inside a company without the knowledge or oversight of IT or management. It is the AI-era version of shadow IT: employees build or adopt tools that work, but nobody governs where the data goes or who can access them.',
    sections: [
      {
        heading: 'Why it happens',
        body: 'AI assistants made building software radically easier. A sales manager can create a working dashboard in an afternoon with the assistant they already use. When the official route to deploy something takes weeks, people share these tools through personal links, spreadsheets, and chat attachments instead. The tools are useful; the invisibility is the problem.',
      },
      {
        heading: 'Why it matters',
        body: 'Every invisible tool is company data in an unmanaged place: no access control, no audit trail, no offboarding when someone leaves. Banning the tools rarely works because they genuinely help people do their jobs. The alternative is giving builders a governed place to deploy, so the company sees every app that exists, who built it, and who can reach it. That is the gap White Ghost exists to close.',
      },
    ],
    related: ['vibe-coding', 'byoc'],
  },
  {
    slug: 'vibe-coding',
    term: 'Vibe coding',
    question: 'What is vibe coding?',
    definition:
      'Vibe coding is building software by describing what you want to an AI assistant in natural language and iterating on the result, rather than writing the code yourself. The term was popularized by Andrej Karpathy in early 2025.',
    sections: [
      {
        heading: 'How it works in practice',
        body: 'You describe the app, the assistant (Claude Code, Codex, Cursor, and others) writes the code, you react to what you see, and the loop repeats. The person steering may not read the code at all. This is how a growing share of internal tools, dashboards, and prototypes get built inside companies, by people who are not engineers.',
      },
      {
        heading: 'The part nobody solved: what happens after',
        body: 'Vibe coding gets you a working app on your laptop. It does not get you hosting, a database, access control, or updates your teammates can receive. That last mile is exactly where vibe-coded apps die or become shadow AI. A deployment platform closes the gap: with White Ghost, the same assistant that built the app can publish it with one CLI, onto a URL with access rules you choose.',
      },
    ],
    related: ['shadow-ai', 'mcp-server'],
  },
  {
    slug: 'byoc',
    term: 'BYOC (bring your own coding assistant)',
    question: 'What is BYOC (bring your own coding assistant)?',
    definition:
      'BYOC means a platform works with the AI assistant you already use and pay for, instead of forcing you to use its own embedded AI. You build with Claude Code, Codex, Cursor, or another assistant; the platform handles what comes after.',
    sections: [
      {
        heading: 'Why it matters economically',
        body: 'Platforms that resell AI generation charge you twice: for the platform and for the tokens. A BYOC platform runs on the AI subscription you already pay for, so there is no second AI bill and no lock-in to a weaker embedded model. This is a founding principle of White Ghost: build with the assistant you already like, publish with the platform.',
      },
      {
        heading: 'What to look for',
        body: 'Assistant-agnostic tooling (a plain CLI with machine-readable output that any agent can drive), code in your own repositories rather than trapped in the platform, and portability: if you leave, you take the code, the data, and the history with you.',
      },
    ],
    related: ['vibe-coding', 'mcp-server'],
  },
  {
    slug: 'mcp-server',
    term: 'MCP server',
    question: 'What is an MCP server?',
    definition:
      'An MCP server is a service that exposes tools to AI assistants through the Model Context Protocol, an open standard introduced by Anthropic in 2024. Connecting one gives the assistant new abilities it can invoke directly, such as querying a database or deploying an app.',
    sections: [
      {
        heading: 'How assistants use it',
        body: "The assistant reads each tool's name and description and calls a tool when the user's request maps to its described capability. Clients such as Claude Code, Claude.ai, Codex CLI, Cursor, and VS Code can all connect to the same remote MCP server, which makes one server a distribution channel to many assistants at once.",
      },
      {
        heading: 'Why it matters for deployment',
        body: 'When a platform ships an official MCP server, the assistant does not just recommend the platform: it can operate it. Deploying becomes something the assistant does for you in the conversation. Today the ghosty CLI plays that role for White Ghost (agent-friendly, --json everywhere); an official MCP connector is the natural next step for the same channel.',
      },
    ],
    related: ['byoc', 'vibe-coding'],
  },
  {
    slug: 'pull-request-preview',
    term: 'Pull request preview',
    question: 'What is a pull request preview?',
    definition:
      'A pull request preview is a live, temporary URL where a proposed change runs before it is merged. Instead of reading a diff or trusting a screenshot, a reviewer opens the link and uses the changed app directly.',
    sections: [
      {
        heading: 'Why it matters for AI-built apps',
        body: 'When an AI assistant writes the change, the person steering often does not read the code. A preview shifts the review to the only place they can actually judge: the running app. On White Ghost every open pull request gets its preview URL automatically, updated on each push, and the URL expires when the pull request closes.',
      },
      {
        heading: 'What a preview is not',
        body: 'A preview is not a second production environment. On White Ghost it runs against the app’s development database rather than production data, and the URL is public: anyone with the link can open it, so it is shared deliberately. Production only changes when the merge lands and the normal build ships it.',
      },
    ],
    related: ['rollback', 'vibe-coding'],
  },
  {
    slug: 'oauth-device-flow',
    term: 'OAuth device flow',
    question: 'What is OAuth device flow?',
    definition:
      'OAuth device flow is a way for a tool without its own browser, like a CLI or an agent, to sign in: the tool shows a short code, the person approves it once in their browser, and the tool receives its credentials without ever seeing a password.',
    sections: [
      {
        heading: 'Why agents need it',
        body: 'An AI coding assistant driving a command line cannot click through a login page, and it should never handle a password. Device flow splits the work: the human approves once, the tool authenticates from then on. It is the sign-in pattern that makes agent-driven tooling possible at all.',
      },
      {
        heading: 'Where you meet it',
        body: 'The ghosty CLI signs in to White Ghost with a device flow. That is what lets Claude Code, Codex CLI, or any other assistant install the CLI, log in with one human approval, and then create and deploy apps end to end, with every command returning machine-readable JSON.',
      },
    ],
    related: ['mcp-server', 'byoc'],
  },
  {
    slug: 'scale-to-zero',
    term: 'Scale to zero',
    question: 'What is scale to zero?',
    definition:
      'Scale to zero means an app releases its computing resources when nobody is using it and starts again on the next request. The trade-off is the cold start: the first request after a quiet period takes longer while the app wakes up.',
    sections: [
      {
        heading: 'Why platforms do it',
        body: 'Most internal tools and side projects are idle most of the day. Keeping a server running for an app nobody is using wastes resources and money. Scaling to zero lets a platform host many mostly-idle apps sustainably, then scale each one up automatically when traffic arrives.',
      },
      {
        heading: 'What it means for your app',
        body: 'Apps deployed on White Ghost scale to zero when idle and autoscale with traffic. In practice: no babysitting and no capacity planning, in exchange for a cold start on the first request after inactivity. For dashboards, internal tools, and shared apps, that trade is almost always worth it.',
      },
    ],
    related: ['rollback', 'pull-request-preview'],
  },
  {
    slug: 'rollback',
    term: 'Rollback (deployment)',
    question: 'What is a deployment rollback?',
    definition:
      'A rollback returns an app to a previous version after a bad deploy. Instead of debugging in production while users wait, you restore the last version that worked, then fix the problem calmly.',
    sections: [
      {
        heading: 'Why it changes how you ship',
        body: 'Knowing you can undo a deploy in one step is what makes shipping often feel safe, and that matters double when an AI assistant writes the changes. The safety net is not reviewing every line: it is a preview before the merge and a rollback after it.',
      },
      {
        heading: 'How it works on White Ghost',
        body: 'Two ways back: run ghosty rollback from the command line (an assistant can run it for you), or open the app’s Deploys tab and press Redeploy on any previous build. Every build in the history keeps its commit, timing, and log, so you can also see what changed between the good version and the bad one.',
      },
    ],
    related: ['pull-request-preview', 'scale-to-zero'],
  },
];

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((e) => e.slug === slug);
}
