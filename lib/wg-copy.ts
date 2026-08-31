import { consoleUrl } from "@/lib/console-url";

/**
 * White Ghost site copy, ported VERBATIM from the design lab's English
 * dictionary (~/AI/White Ghost/lib/i18n/en.ts, bilingual es/en). This site is
 * English-only at root paths, so the i18n layer collapses to this module:
 * `Locale`, `Dictionary` and `localizeHref` keep the ported components
 * source-identical to the lab. The waitlist is gone by decision (2026-07-29):
 * every CTA that pointed at /waitlist now goes to the console sign-up.
 */

/**
 * English dictionary — same shape as `es`. Plain, non-technical voice.
 * Typed as `Dictionary` so any shape drift is caught by `tsc`.
 */
export const copy = {
  meta: {
    home: {
      title: "White Ghost — your team is already building with AI. We make it real.",
      description:
        "Your people use Claude every day to create tools and agents — but most of it gets stuck before anyone can use it. White Ghost gives your whole company one safe place to launch, share, and manage everything they build.",
    },
    about: {
      title: "White Ghost — about us",
      description:
        "We were born inside Melonn. We believe anyone in a company should be able to take an idea all the way to a useful app or agent — without losing control of their information.",
    },
    compareStack: {
      title: "White Ghost vs. piecing together your own stack (Vercel + Supabase + Railway)",
      description:
        "To publish what your team builds with AI you can wire up a technical stack yourself (Vercel + Supabase + Railway + access + permissions) or use White Ghost: one safe, governed place — no engineering required.",
    },
    story: {
      title: "White Ghost — the story",
      description:
        "A scroll-told story: from an everyday person with Claude on their laptop to apps deployed safely with White Ghost.",
    },
    compareHub: {
      title: "White Ghost vs. the alternatives — comparisons",
      description:
        "How White Ghost compares with piecing together your own stack and with tools like Vercel. Which one fits your case.",
    },
    compareVercel: {
      title: "White Ghost vs. Vercel — which one do you need?",
      description:
        "Vercel ships apps for developers. White Ghost is where your whole company launches, sees, and controls everything it builds with the AI it already has. Side by side.",
    },
    pricing: {
      title: "White Ghost — pricing",
      description:
        "Priced per company, not per seat. Unlimited users, no surprise bills. Plans are provisional while we open access.",
    },
    security: {
      title: "White Ghost — security & your data",
      description:
        "Your information belongs to your company: isolated, never used to train anything, and yours to take. How White Ghost protects your data.",
    },
    privacy: {
      title: "White Ghost — privacy",
      description: "How we handle your information at White Ghost.",
    },
    terms: {
      title: "White Ghost — terms",
      description: "Terms of use for White Ghost.",
    },
    useCases: {
      title: "White Ghost — use cases by team",
      description:
        "How each part of your company uses White Ghost: sales teams, operations, and finance. Without waiting on IT, without being technical.",
    },
  },

  nav: {
    homeAria: "White Ghost — home",
    menuAria: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    cta: "Get started",
    links: [
      { label: "Product", href: "/#product" },
      { label: "How it works", href: "/#how" },
      { label: "Compare", href: "/compare/stack" },
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Sign in", href: "/signin" },
    ],
  },

  localeSwitcher: {
    aria: "Change language",
    toEs: "ES",
    toEn: "EN",
  },

  // Analytics consent banner copy (approved 2026-08-31).
  // Vendor-free wording by house rule; the provider detail lives in /privacy.
  consent: {
    text: "We use analytics cookies to understand how visitors use this site and to improve it. Declining changes nothing about how the site works. Details in our",
    policyLabel: "Privacy Policy",
    accept: "Accept",
    decline: "Decline",
  },

  footer: {
    tagline:
      "One safe place to launch, share, and manage everything your team builds with AI.",
    rights: "all rights reserved",
    columns: [
      {
        heading: "Product",
        links: [
          { label: "How it works", href: "/#how" },
          { label: "Apps & agents", href: "/#product" },
          { label: "Security", href: "/security" },
        ],
      },
      {
        heading: "Compare",
        links: [
          { label: "vs. your stack", href: "/compare/stack" },
          { label: "vs. Vercel", href: "/compare/vercel" },
          { label: "Use cases", href: "/use-cases" },
        ],
      },
      {
        heading: "Resources",
        links: [
          { label: "Story", href: "/story" },
          { label: "Docs", href: "/docs" },
          { label: "Blog", href: "/blog" },
          { label: "Changelog", href: "/changelog" },
          { label: "Glossary", href: "/glossary" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "mailto:hello@whiteghost.ai" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
        ],
      },
    ],
  },

  intro: {
    brand: "WHITE GHOST®",
    caption: "AI MADE REAL",
  },

  home: {
    hero: {
      badge: "New — your team can now build AI agents",
      titleLead: "Your team is already building with AI.",
      titleEm: "We make it real.",
      body: "Your people use Claude every day to create tools and agents — but most of it gets stuck before anyone can use it. White Ghost gives your whole company one safe place to launch, share, and manage everything they build.",
      ctaPrimary: "Get started →",
      ctaSecondary: "See how it works",
      scroll: "Scroll",
      ticker: "Works with the AI you already pay for",
    },
    marquee: {
      aria: "Works with the AI you already use: Claude, OpenAI, Gemini",
      items: ["Works with the AI you already use", "Claude", "OpenAI", "Gemini"],
    },
    problem: {
      eyebrow: "01 — The problem",
      titleLead: "Great things are being built.",
      titleEm: "Then they get stuck.",
      intro:
        "The dashboards, tools, and agents your people create with AI are genuinely useful. But without a home, they go nowhere — and you're left guessing.",
      pains: [
        {
          title: "Trapped on one laptop",
          body: "Someone builds a brilliant little tool — and it never leaves their desk. The person who needs it most never even hears about it.",
        },
        {
          title: "Scattered everywhere",
          body: "Things end up in a dozen different places under a dozen different accounts. Nobody can say what exists or where it lives.",
        },
        {
          title: "No way to know what's safe",
          body: "You can't see who built what, what it touches, or whether your company's information is protected. So everything stays stuck.",
        },
      ],
    },
    how: {
      eyebrow: "02 — How it works",
      titleLead: "From idea to up-and-running,",
      titleEm: "in five easy steps.",
      steps: [
        {
          title: "Answer a few simple questions.",
          body: "Tell White Ghost what you want — a dashboard, a tool, an agent — in plain words. No setup, nothing to install.",
          line: '"I need a simple tool to track customer requests."',
        },
        {
          title: "White Ghost gets it ready.",
          body: "Everything is prepared behind the scenes — branded with your company's look and connected to the right information.",
          line: "getting everything ready… done ✓",
        },
        {
          title: "Your team builds with the AI they already use.",
          body: "They keep using Claude, exactly like they do today. Nothing new to learn, nothing extra to pay per use.",
          line: "same Claude. same plan. nothing extra.",
        },
        {
          title: "You stay in control.",
          body: "One dashboard shows what's been built, who built it, what's being used, and exactly what information each thing can touch.",
          line: "see everything. pause anything.",
        },
        {
          title: "Everyone shares.",
          body: "Every app and agent lives in one shared library, so anyone in your company can find and use what others have made.",
          line: "one library, open to the whole company.",
        },
      ],
    },
    apps: {
      eyebrow: "03 — Two powers, one place",
      titleLead: "Apps and agents,",
      titleEm: "side by side.",
      intro:
        "Both run on the AI your company already pays for. Both live in the same safe, shared library. No new subscriptions, no scattered tools.",
      powers: [
        {
          label: "Apps",
          title: "Tools your team dreams up, ready for everyone.",
          body: "Dashboards, trackers, calculators, little helpers — whatever your people imagine, White Ghost gives it a real home where the whole company can use it.",
          points: [
            "Made in plain words, no technical skills needed",
            "Branded with your company's look from day one",
            "Live in minutes, not months",
          ],
        },
        {
          label: "Agents",
          title: "AI agents that work alongside your people.",
          body: "Your team can now create agents too — helpers that answer questions, handle tasks, and keep things moving. Build them to work however you like.",
          points: [
            "Answer questions and handle everyday tasks",
            "Shaped around how your company actually works",
            "Run beautifully, day and night",
          ],
        },
      ],
    },
    control: {
      eyebrow: "04 — The control center",
      titleLead: "One dashboard.",
      titleEm: "Total peace of mind.",
      intro:
        "This is the control tower no AI provider will build for a company like yours: everything your people make with AI, visible and under your control — in one place.",
      dashboard: {
        title: "your company — everything at a glance",
        status: "all clear ▪ nothing needs your attention",
        stats: [
          { value: "12", label: "apps & agents live" },
          { value: "38", label: "people using them" },
          { value: "100%", label: "information accounted for" },
        ],
        rows: [
          { name: "Customer Request Tracker", by: "Maria · Operations", sees: "customer notes", uses: "214 uses this week" },
          { name: "Sales Answer Agent", by: "James · Sales", sees: "product info", uses: "163 uses this week" },
          { name: "Invoice Helper", by: "Alex · Finance", sees: "billing records", uses: "98 uses this week" },
        ],
        canSee: "can see:",
        live: "live",
      },
      features: [
        {
          title: "See everything",
          body: "Every app and agent in your company, in one calm view. What exists, who made it, and how much it's being used.",
        },
        {
          title: "Know what's safe",
          body: "See exactly what information each thing can touch — and what it can't. No more guessing, no more gray areas.",
        },
        {
          title: "Control everything",
          body: "Pause anything, change who can use it, or adjust what it can see. One tap, done. You're always in charge.",
        },
      ],
    },
    costs: {
      eyebrow: "05 — Costs under control",
      titleLead: "No surprise",
      titleEm: "bills.",
      intro:
        "Your team builds with the AI it already pays for, on its own account. White Ghost never marks up your tokens — it just gives you the brakes so no one quietly runs up a five-figure bill.",
      cards: [
        {
          title: "Budgets and caps",
          body: "Set a limit per team, per app, or for the whole company. Hit the cap and it stops. You decide the ceiling.",
        },
        {
          title: "Alerts, not surprises",
          body: "See spend live and get a heads-up before anything runs away — not when the bill arrives.",
        },
        {
          title: "Your own AI account",
          body: "Everyone builds with the AI your company already pays for (Claude, Codex, Gemini). No resold tokens, no hidden markup.",
        },
      ],
    },
    connect: {
      eyebrow: "06 — Connected to your stack",
      titleLead: "Connected to what",
      titleEm: "your company already runs on.",
      intro:
        "Apps and agents are useful from day one because they plug into your real systems — with no one having to wire up the technical plumbing. And always at the permission level of whoever uses them.",
      tilesLabel: "Connects with",
      tiles: ["Shopify", "Your CRM (HubSpot)", "Meta Ads", "Your ERP", "Google Workspace", "Your databases"],
      note: "Governed connection: each person only sees what they're already allowed to see. Nothing gets over-exposed.",
    },
    data: {
      eyebrow: "07 — Safety, simply",
      titleLead: "Your information",
      titleEm: "stays yours.",
      intro:
        "However you choose to run White Ghost, one thing never changes: your company's information belongs to your company. Full stop.",
      options: [
        {
          label: "For growing teams",
          title: "We keep it safe for you.",
          body: "White Ghost looks after everything in a protected space made just for your company. Your information is never shared, never mixed with anyone else's, and never used to train anything.",
        },
        {
          label: "For bigger companies",
          title: "Or it never leaves your walls.",
          body: "Prefer to keep everything at home? White Ghost can run entirely inside your own company's cloud — so your information stays exactly where your policies say it should.",
        },
      ],
    },
    cta: {
      titleLead: "Bring order to your",
      titleEm: "company's AI.",
      body: "Your team is already building. Give them — and yourself — the one safe place where it all comes together.",
      ctaPrimary: "Get started →",
      ctaSecondary: "See how it works",
      note: "No new AI to buy ▪ up and running in days, not months",
    },
  },

  about: {
    eyebrow: "About us",
    titleLead: "We were born solving",
    titleEm: "our own chaos.",
    intro:
      "White Ghost started inside Melonn, a logistics company for online stores in Latin America. When our own people began building incredible things with AI, we ran into the same problem every company faces today: everything got trapped on scattered laptops, with no order and no control. So we built the place we were missing.",
    missionTitle: "What we believe",
    mission:
      "We believe anyone in a company — technical or not — should be able to take an idea all the way to a useful, deployed app or agent, without taking their information out of their control and without buying another AI. White Ghost is the safe home for everything a team builds with the AI it already has.",
    teamTitle: "The team",
    teamNote: "Founders (draft for review).",
    team: [
      { name: "Alejandro Celis", role: "Co-founder · Melonn" },
      { name: "Andrés Gómez", role: "Co-founder · Melonn" },
      { name: "Daniel Castrillón", role: "Product & architecture" },
      { name: "Felipe Jaramillo", role: "Co-founder" },
      { name: "Sebastián Román", role: "Co-founder" },
    ],
    ctaTitle: "Want to see it in your company?",
    cta: "Get started →",
  },

  compareStack: {
    hero: {
      eyebrow: "Compare — White Ghost vs. your stack",
      titleLead: "Vercel ships one app.",
      titleEm: "White Ghost runs your whole company.",
      body: "To publish what your team builds with AI, a technical person could wire up a stack: Vercel for the front end, Supabase for data, Railway for the back end, plus access and permissions and oversight. White Ghost gives you all of that in one safe, governed place — without anyone needing to be technical.",
      ctaPrimary: "Get started →",
      ctaSecondary: "See the comparison",
    },
    table: {
      eyebrow: "01 — Side by side",
      titleLead: "Piecing together a stack",
      titleEm: "vs. White Ghost.",
      colStack: "Piecing together your own stack",
      colGhosty: "White Ghost",
      rows: [
        {
          capability: "What you need",
          stack: "Wire up and maintain several tools: Vercel + Supabase + Railway + access + permissions.",
          ghosty: "One place. White Ghost bundles deployment, data, access, and control.",
        },
        {
          capability: "Who it's for",
          stack: "Developers who know how to connect each piece.",
          ghosty: "Anyone in the company, technical or not.",
        },
        {
          capability: "Brings its own AI?",
          stack: "No. And you usually end up paying for a separate AI tool too.",
          ghosty: "No — it runs on the AI you already pay for (Claude, Codex, Gemini). You don't buy another AI.",
        },
        {
          capability: "Visibility & control",
          stack: "Spread across several technical dashboards. Hard to see the whole.",
          ghosty: "A control tower: see every app and agent, what it touches, who uses it, and what it costs. Switch anything off.",
        },
        {
          capability: "Built for non-technical people",
          stack: "No. Without a developer, it never starts.",
          ghosty: "Yes — a plain-language wizard turns your business questions into an app or an agent.",
        },
        {
          capability: "Your information",
          stack: "Split across several providers and accounts.",
          ghosty: "Isolated per company, your code in your own GitHub, and you can leave clean whenever you want.",
        },
      ],
    },
    choice: {
      eyebrow: "02 — When to choose each",
      titleLead: "Each path is right",
      titleEm: "for a different job.",
      stackLabel: "Piece together a stack when",
      stackBody:
        "You have developers and you want full control piece by piece, and you don't mind wiring up and maintaining several tools to get there.",
      ghostyLabel: "Choose White Ghost when",
      ghostyBody:
        "Your whole company is already building with AI and you need one safe place to launch it, see it, and control it — without buying another AI and without everyone needing to be technical.",
    },
    faq: {
      eyebrow: "03 — Questions",
      titleLead: "Common",
      titleEm: "questions.",
      items: [
        {
          q: "Can I use White Ghost together with Vercel or Supabase?",
          a: "Yes. They solve different things. Those tools are great for a developer to publish an app; White Ghost is where a whole company launches, sees, and controls what it builds with AI. Many teams will use both.",
        },
        {
          q: "Does White Ghost replace my AI tools?",
          a: "No. White Ghost runs on the AI your company already pays for — Claude, Codex, Gemini. You don't buy another AI: White Ghost is the home and control center for what your team builds with the one you already have.",
        },
        {
          q: "Is my code locked into White Ghost?",
          a: "No. Your code lives in your own GitHub organization and your data is isolated per company. If you ever leave, you export the database and the code is already yours.",
        },
        {
          q: "Do I need to be technical to use White Ghost?",
          a: "No. A plain-language wizard turns what you describe in business terms into a deployed app or agent — no coding background required.",
        },
      ],
    },
    cta: {
      titleLead: "Already building with AI?",
      titleEm: "Bring it into one place.",
      cta: "Get started →",
      note: "No new AI to buy ▪ up and running in days, not months",
    },
  },

  compareHub: {
    eyebrow: "Compare",
    titleLead: "How does",
    titleEm: "White Ghost compare?",
    intro: "It depends on what you're solving. Here's the plain-language breakdown.",
    items: [
      {
        title: "White Ghost vs. your stack",
        body: "Vercel + Supabase + Railway together vs. one safe, governed place.",
        href: "/compare/stack",
        cta: "See comparison →",
      },
      {
        title: "White Ghost vs. Vercel",
        body: "Vercel ships a developer app; White Ghost is the home for everything your company builds.",
        href: "/compare/vercel",
        cta: "See comparison →",
      },
    ],
  },

  compareVercel: {
    hero: {
      eyebrow: "Compare — White Ghost vs. Vercel",
      titleLead: "Vercel ships apps.",
      titleEm: "White Ghost puts your AI under control.",
      body: "Vercel is where developers ship and host apps. White Ghost is the safe place where your whole company — technical or not — launches, sees, and controls everything it builds with the AI it already has. Not the same fight. Here's how to choose.",
      ctaPrimary: "Get started →",
      ctaSecondary: "See the comparison",
    },
    table: {
      eyebrow: "01 — Side by side",
      titleLead: "Vercel",
      titleEm: "vs. White Ghost.",
      colVercel: "Vercel",
      colGhosty: "White Ghost",
      rows: [
        {
          capability: "What it's for",
          vercel: "Hosting and deploying websites and apps, fast.",
          ghosty: "A safe, shared home for everything your team builds with AI — apps and agents.",
        },
        {
          capability: "Who it's for",
          vercel: "Developers and engineering teams.",
          ghosty: "Anyone in the company, technical or not.",
        },
        {
          capability: "Brings its own AI?",
          vercel: "No — you bring your code.",
          ghosty: "No — it runs on the AI you already pay for (Claude, Codex, Gemini). You don't buy another AI.",
        },
        {
          capability: "Visibility & control",
          vercel: "Project-level dashboards, built for developers.",
          ghosty: "A control tower: see every app and agent, what it touches, who uses it, what it costs. Switch anything off.",
        },
        {
          capability: "Built for non-technical people",
          vercel: "Aimed at developers.",
          ghosty: "Yes — a plain-language wizard turns your business questions into an app or an agent.",
        },
        {
          capability: "Your code & data",
          vercel: "Your code stays in your Git repo.",
          ghosty: "Your code in your own GitHub, data isolated per company, and you can leave clean whenever you want.",
        },
      ],
    },
    choice: {
      eyebrow: "02 — When to choose each",
      titleLead: "Each tool is right",
      titleEm: "for a different job.",
      vercelLabel: "Choose Vercel when",
      vercelBody:
        "You're a developer or an engineering team and you want the best place to deploy and scale a website or app, with world-class performance and developer experience.",
      ghostyLabel: "Choose White Ghost when",
      ghostyBody:
        "Your whole company is already building with AI and you need one safe place to launch it, see it, and control it — without buying another AI and without everyone needing to be technical.",
    },
    faq: {
      eyebrow: "03 — Questions",
      titleLead: "Common",
      titleEm: "questions.",
      items: [
        {
          q: "Can I use White Ghost and Vercel together?",
          a: "Yes. They solve different things. Vercel is great for a developer to ship apps; White Ghost is where a whole company launches, sees, and controls what it builds with AI. Many teams will use both.",
        },
        {
          q: "Does White Ghost replace my AI tools?",
          a: "No. It runs on the AI your company already pays for — Claude, Codex, Gemini. You don't buy another AI: White Ghost is the home and control center for what your team builds with the one you already have.",
        },
        {
          q: "Is my code locked in?",
          a: "No. Your code lives in your own GitHub organization and your data is isolated per company. If you leave, you export the database and the code is already yours.",
        },
        {
          q: "Do I need to be technical?",
          a: "No. A plain-language wizard turns what you describe in business terms into a deployed app or agent.",
        },
      ],
    },
    cta: {
      titleLead: "Already building with AI?",
      titleEm: "Bring it into one place.",
      cta: "Get started →",
      note: "No new AI to buy ▪ up and running in days, not months",
    },
  },

  pricing: {
    eyebrow: "Pricing",
    titleLead: "Priced per company,",
    titleEm: "not per seat.",
    intro:
      "Unlimited users, no paying for each person, and no surprise bills. You pay one flat plan based on your company's size.",
    provisionalNote: "Prices are provisional while we open access. They may change.",
    perMonth: "/mo",
    tiers: [
      {
        name: "Starter",
        who: "Under 50 people",
        price: "~US$150–200",
        users: "Unlimited users",
        features: ["Unlimited apps & agents", "Runs on the AI you already pay for", "Control tower included"],
      },
      {
        name: "Growth",
        who: "50 to 250 people",
        price: "~US$400",
        users: "Unlimited users",
        features: ["Everything in Starter", "More capacity", "Connectors to your systems"],
      },
      {
        name: "Scale",
        who: "250 to 1,000 people",
        price: "~US$900",
        users: "Unlimited users",
        features: ["Everything in Growth", "Priority support", "Advanced controls"],
      },
      {
        name: "Enterprise",
        who: "In your own cloud",
        price: "Custom",
        users: "Unlimited users",
        features: ["Everything inside your cloud (BYOC)", "Your information never leaves", "Tailored to your policies"],
      },
    ],
    ctaTitle: "Ready to start?",
    cta: "Get started →",
    note: "No new AI to buy ▪ unlimited users on every plan",
  },

  security: {
    eyebrow: "Security & your data",
    titleLead: "Your information",
    titleEm: "belongs to your company.",
    intro:
      "No jargon: here's what we do so you can relax about what your people build.",
    points: [
      { title: "Isolated per company", body: "Everything of yours lives in a protected space, just for your company. Never mixed with anyone else's." },
      { title: "We never train on your data", body: "Your information is yours. We don't share it or use it to train any model." },
      { title: "Your code, in your GitHub", body: "What your team builds lives in your company's own GitHub organization. Yours from day one." },
      { title: "You can take it with you", body: "If you ever leave, you leave clean: export the database and the code is already in your repo. No lock-in." },
      { title: "Or it never leaves your walls", body: "Bigger companies can run White Ghost inside their own cloud, so information stays where their policies say it should." },
      { title: "You decide who gets in", body: "Every app and agent is private by default. You approve who uses it and what information it can touch." },
    ],
    ctaTitle: "Want to see it in your company?",
    cta: "Get started →",
  },

  legal: {
    draftNote: "Draft. Not legal advice; pending review.",
    updated: "Last updated: June 2026",
    privacy: {
      eyebrow: "Privacy",
      title: "Privacy policy",
      intro: "How we handle information when you use White Ghost.",
      sections: [
        { heading: "What we collect", body: "The contact details you give us (such as your email and company name) and basic usage data to operate the service." },
        { heading: "How we use it", body: "To give you access, run the service, and communicate with you. We don't sell your information or use it to train models." },
        { heading: "Your company information", body: "What your team builds and the data it connects live isolated per company and are yours. You can export and take them." },
        { heading: "Contact", body: "Privacy questions? Write to hello@whiteghost.ai." },
      ],
    },
    terms: {
      eyebrow: "Terms",
      title: "Terms of use",
      intro: "The basic rules for using White Ghost.",
      sections: [
        { heading: "The service", body: "White Ghost is an environment to launch and manage apps and agents your team builds with the AI your company already pays for." },
        { heading: "Your account and content", body: "You're responsible for your account and what your team builds. Your code and data are yours." },
        { heading: "Availability", body: "We're early-stage; the service may change as we build it with you." },
        { heading: "Contact", body: "Questions? Write to hello@whiteghost.ai." },
      ],
    },
  },

  useCases: {
    eyebrow: "Use cases",
    titleLead: "One tool",
    titleEm: "for every team.",
    intro:
      "Same thing underneath, different for your day-to-day. See how each part of your company uses it — without waiting on IT and without being technical.",
    exploreLabel: "See use case →",
    backLabel: "← All use cases",
    flowTitle: "How it works",
    resultLabel: "The result",
    ctaTitle: "Ready for your team?",
    cta: "Get started →",
    note: "No new AI to buy ▪ up and running in days",
    roles: [
      {
        slug: "commercial",
        label: "Sales teams",
        blurb: "Sales dashboards, customer tracking, and agents that answer product questions.",
        title: "For your sales team,",
        titleEm: "without waiting on IT.",
        problem:
          "Your sales people keep asking for reports and tools that the tech team can't get to. Meanwhile, customer information lives in scattered spreadsheets.",
        steps: [
          { title: "Say it in plain words", body: "\"I want a dashboard to see my pipeline\" or \"an agent that answers product questions for the team.\"" },
          { title: "White Ghost builds it", body: "Connected to your CRM and the right information, branded with your company's look." },
          { title: "The whole team uses it", body: "Each rep uses it with the AI they already have; you see who uses it and what it touches." },
        ],
        result: "Your team stops waiting and starts selling with better tools they built themselves.",
      },
      {
        slug: "operations",
        label: "Operations",
        blurb: "Order tracking, alerts, and operational dashboards in one place — not in a thousand files.",
        title: "For operations,",
        titleEm: "everything under control.",
        problem:
          "A thousand spreadsheets and scattered dashboards everywhere. Nobody knows which one is the real version or who updates it.",
        steps: [
          { title: "Say it in plain words", body: "\"I need an orders panel with alerts when something is delayed.\"" },
          { title: "White Ghost builds it", body: "Connected to your systems, in a safe and governed space." },
          { title: "One source of truth", body: "The whole team sees the same thing; you decide who gets in and what they can see." },
        ],
        result: "One source of truth, with no chasing files or guessing.",
      },
      {
        slug: "finance",
        label: "Finance",
        blurb: "Invoicing helpers, reports, and reconciliations with your information protected.",
        title: "For finance,",
        titleEm: "with your information protected.",
        problem:
          "Sensitive data scattered across personal files and emails. Reports built by hand every month.",
        steps: [
          { title: "Say it in plain words", body: "\"I want a helper that builds the monthly report\" or \"that reconciles invoices.\"" },
          { title: "White Ghost builds it", body: "With the data isolated and safe, never out of your control." },
          { title: "You control access", body: "You decide exactly who sees what; nothing is left exposed in loose files." },
        ],
        result: "Up-to-date reports without exposing sensitive data or depending on one person.",
      },
    ],
  },

  story: {
    intro: {
      eyebrow: "White Ghost — a scroll-told story",
      titleLead: "Anyone in your company can build software.",
      titleEm: "This is their story.",
      scrollHint: "Scroll and follow the path",
    },
    ch1: {
      label: "Ch. 01 — The main character",
      titleLead: "An everyday person.",
      titleEm: "Zero technical knowledge.",
      titleTail: "",
      body: "Not a developer. Not “the IT person.” Just a regular person at your company, with the AI stack the company installed on their laptop: Claude. The only AI tool they need.",
      tools: [
        { name: "Claude", desc: "chat for everyday questions" },
        { name: "Claude Cowork", desc: "their agent for day-to-day tasks and work" },
        { name: "Claude Code", desc: "to build apps" },
      ],
      toolsNote: "▸ one AI tool. installed on their laptop.",
    },
    ch2: {
      label: "Ch. 02 — The wall",
      titleLead: "They build an app…",
      titleEm: "and have nowhere to put it.",
      titleTail: "",
      body: "A server? Vercel? Railway? Backend, frontend? No idea. The creativity grinds to a halt. And then the worst happens: HTML dashboards with sensitive company data, shared all over the place.",
      files: [
        "sales_FINAL_v3.html",
        "payroll_2026.html → whatsapp",
        "customers(copy).html → personal gmail",
        "dashboard(1).html → usb",
      ],
      chaosNote: "⚠ it becomes chaos",
    },
    ch3: {
      label: "Ch. 03 — White Ghost appears",
      titleLead: "A",
      titleEm: "safe",
      titleTail: " ecosystem for your company.",
      body: "Your people already work with one AI tool. White Ghost gives them the place to deploy what they build, safely, controlling who gets in and who doesn't.",
      badges: ["safe deploy ✓", "access control ✓", "your company, your rules ✓"],
    },
    ch4: {
      label: "Ch. 04 — The wizard",
      titleLead: "You answer questions.",
      titleEm: "White Ghost does the heavy lifting.",
      titleTail: "",
      body: "When you build an app, a simple wizard asks what matters — and White Ghost sets it all up in a safe cloud.",
      wizardHeader: "white ghost · new app",
      rows: [
        { q: "Want a database?", a: "yes" },
        { q: "Connect Shopify or VTEX?", a: "yes" },
        { q: "HubSpot or another CRM?", a: "yes" },
        { q: "Your company data? Your ERP?", a: "yes" },
        { q: "Your Google Workspace?", a: "yes" },
        { q: "Login-protected or public?", a: "login" },
      ],
      create: "▸ create",
      doneText: "white ghost does the heavy lifting…",
      doneOk: "safe cloud ✓",
    },
    ch5: {
      label: "Ch. 05 — Building with no brakes",
      titleLead: "Their own tool.",
      titleEm: "No extra tokens, no surprise charges.",
      titleTail: "",
      body: "They build dashboards with real data, reach secure information, and develop with the latest best practices thanks to the skills White Ghost gives them. The result: a stunning app.",
      chips: [
        "skill · ui-design ✓",
        "skill · data-viz ✓",
        "skill · dev-best-practices ✓",
        "0 extra tokens",
        "0 extra charges",
      ],
      resultNote: "▸ result: a stunning app.",
    },
    ch6: {
      label: "Ch. 06 — “Deploy”",
      titleLead: "One word, and the app",
      titleEm: "comes to life.",
      titleTail: "",
      body: "They tell Claude Code “deploy” and White Ghost ships the front end, the back end, and everything needed to share it in the safe workspace, with the security required.",
      cmd: "deploy",
      labels: ["frontend", "backend", "data", "security"],
      shared: "shared in your safe workspace",
    },
    outro: {
      titleLead: "Everyone happy, collaborating with",
      titleEm: "one single AI tool.",
      ctaPrimary: "Start with White Ghost →",
      ctaSecondary: "See the product",
      note: "no new AI to buy ▪ safe by design",
    },
  },

};

export type Dictionary = typeof copy;
export type Locale = "en";

/**
 * Lab shim: the lab prefixed hrefs with the locale; here paths are already
 * canonical. The one mapping left: the retired waitlist becomes the console.
 */
export function localizeHref(href: string, _locale?: Locale): string {
  if (href === "/waitlist") return consoleUrl("/signup");
  if (href === "/signin") return consoleUrl("/login");
  return href;
}
