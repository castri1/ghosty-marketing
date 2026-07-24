# ghosty-marketing

The Ghosty **marketing site** — the public pages on the apex `getghosty.dev`: home, docs,
changelog, privacy, terms. Split out of the ghosty monorepo's console (CAS-93, 2026-07-24) so
marketing iterates independently of console deploys and gets real SEO (server-rendered HTML).
The One Console lives at `console.getghosty.dev` (ghosty monorepo, `apps/console`); every
sign-in/join CTA here links there absolutely.

## Repo map

- `app/` — Next.js App Router pages: `/` (home), `/docs`, `/docs/[slug]`, `/changelog`,
  `/privacy`, `/terms`. `layout.tsx` is the shared shell (nav + footer + the `.mkt` scope
  wrapper), ported from the console's `MarketingLayout.tsx`.
- `styles/marketing.css` — the `.mkt`-scoped marketing theme, ported **verbatim** from the
  console's `apps/console/frontend/src/index.css`. `styles/preflight.css` is a vendored copy of
  Tailwind's preflight reset (the console compiled on top of it; without it the port isn't
  pixel-identical). Don't hand-edit ported rules.
- `lib/content.ts` — markdown loader (frontmatter parser + `marked` rendering), ported from the
  console's `marketing/content.ts`. Reads `fixtures/` at build time. **M2 (CAS-96) replaces the
  fixture source with the Firestore content registry** — keep parser/rendering identical.
- `fixtures/site/*.md`, `fixtures/releases/*.md` — interim content, copied from the ghosty
  repo's `docs/site/` and `docs/releases/` (frontmatter contract: `docs/releases/README.md`
  there). Temporary until M2.
- `components/GhostMark.tsx` — vendored from `@ghosty/ui`. **No `@ghosty/*` workspace deps** —
  anything shared is vendored by copy.
- `public/videos/` — the home-page demo video.

## Dev

- `npm install` / `npm run dev` — local dev at http://localhost:3000.
- `npm run build` — production build (`output: 'standalone'`); `npm run typecheck` — tsc.
- Production serving = `node .next/standalone/server.js`, and the build output alone is
  incomplete: `public/` and `.next/static` must be copied into `.next/standalone/` (see the
  note in `next.config.mjs`) — the M4 deploy image does this. `npm start` (`next start`) is a
  local convenience only; it is not the standalone production path.
- `NEXT_PUBLIC_CONSOLE_URL` (default `https://console.getghosty.dev`) — console CTA target,
  inlined at build time (`lib/console-url.ts`).
- Commit straight to `main` (solo, pre-cutover). No CI/deploy yet — that lands in M4; the
  service goes live on the apex in the OPS cutover (runbook 13 in the ghosty repo).

## House rules (inherited from the ghosty repo)

- **Copy stays verbatim**: marketing/docs/changelog text is approved user-facing copy — never
  reword it while restructuring; flag proposed copy changes instead of making them.
- **Vendor-free language**: nothing user-facing mentions Google internals (Cloud Run/SQL, IAM,
  TLS…) — say "the Ghosty platform" / "the Ghosty database".
- Markdown renders via `marked` + `dangerouslySetInnerHTML` because content is repo-authored
  (trusted). If content ever comes from a less-trusted source (M2's API path), revisit
  sanitization before shipping.
