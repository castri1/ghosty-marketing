# ghosty-marketing

The Ghosty **marketing site** — the public pages on the apex `getghosty.dev`: home, docs,
changelog, privacy, terms. Split out of the ghosty monorepo's console (CAS-93, 2026-07-24) so
marketing iterates independently of console deploys and gets real SEO (server-rendered HTML).
The One Console lives at `console.getghosty.dev` (ghosty monorepo, `apps/console`); every
sign-in/join CTA here links there absolutely.

## Repo map

- `app/` — Next.js App Router pages: `/` (home), `/docs`, `/docs/[slug]`, `/changelog`,
  `/privacy`, `/terms`, plus the content API under `app/api/content/`. `layout.tsx` is the
  shared shell (nav + footer + the `.mkt` scope wrapper), ported from the console's
  `MarketingLayout.tsx`.
- `lib/content-types.ts` — **the content-type registry** (CAS-96). Every generic surface
  (API, cached readers, seed — and M3's sitemap/llms.txt/RSS) iterates this one file.
- `lib/content.ts` — registry-driven cached readers + the `marked` renderer the pages use.
- `lib/firestore.ts` / `lib/content-auth.ts` — content store client + write-token gate.
- `scripts/seed.ts` — imports a ghosty-checkout's `docs/site` + `docs/releases` markdown
  through the content API (frontmatter contract: `docs/releases/README.md` in the ghosty repo).
- `components/` — `GhostMark` (vendored from `@ghosty/ui` — **no `@ghosty/*` workspace deps**,
  shared things are vendored by copy) and `ContentList`/`ContentDetail` (the default templates
  new content types compose).
- `styles/marketing.css` — the `.mkt`-scoped marketing theme, ported **verbatim** from the
  console's `apps/console/frontend/src/index.css`. `styles/preflight.css` is a vendored copy of
  Tailwind's preflight reset (the console compiled on top of it; without it the port isn't
  pixel-identical). Don't hand-edit ported rules.
- `public/videos/` — the home-page demo video.

## Content system (CAS-96)

Docs and changelog entries live in the `ghosty-central` Firestore database (collections
`marketing_docs` / `marketing_changelog` — additive alongside the platform's collections) and
are managed through the content API. There is no repo-committed content.

### API

- `GET /api/content/:type` — public, sorted list (`{items}`); `:type` is a registry key
  (`docs`, `changelog`); unknown type → 404.
- `GET /api/content/:type/:id` — public single entry; 404 when absent.
- `PUT /api/content/:type/:id` — upsert. Requires `Authorization: Bearer
  $MARKETING_CONTENT_TOKEN` (constant-time compare; 401 wrong/missing, 503 when the server has
  no token configured). Body is validated against the type's zod schema (400 with `issues` on
  mismatch), and `:id` must equal the type's canonical id for the body (docs: `slug`;
  changelog: `YYYY-MM-DD-<slug>`). `updatedAt` is server-stamped — don't send it.
- `DELETE /api/content/:type/:id` — same auth; 404 when absent.

API reads hit the store directly (always fresh). Page reads go through `unstable_cache`
tagged with the type key; every successful write calls `revalidateTag`, so pages update
immediately — the 300s ISR revalidate on pages is only the backstop.

Publish examples (the `/rollout` path):

```bash
curl -X PUT "https://getghosty.dev/api/content/changelog/2026-08-01-faster-builds" \
  -H "Authorization: Bearer $MARKETING_CONTENT_TOKEN" -H "content-type: application/json" \
  -d '{"slug":"faster-builds","date":"2026-08-01","title":"Faster builds",
       "summary":"Builds now start in seconds.","bodyMd":"Build starts dropped from…"}'

curl -X PUT "https://getghosty.dev/api/content/docs/webhooks" \
  -H "Authorization: Bearer $MARKETING_CONTENT_TOKEN" -H "content-type: application/json" \
  -d '{"slug":"webhooks","title":"Webhooks","description":"Receive events from services.",
       "order":70,"bodyMd":"…markdown body…"}'
```

### Fields per type

- shared: `slug` (lowercase/digits/dashes), `title`, `bodyMd` (markdown), `updatedAt`
  (server-set ISO string).
- `docs`: + `order` (int, sidebar position, default 999 = last), `description?`.
- `changelog`: + `date` (`YYYY-MM-DD`), `summary?`. Entry id = `YYYY-MM-DD-<slug>`.

### Trust invariant (why raw HTML rendering is OK)

Markdown renders via `marked` + `dangerouslySetInnerHTML` **only because content is writable
solely through the bearer-token API** — authors are trusted operators/automation. If content
ever gets a less-trusted write path (public submissions, per-author tokens…), add
sanitization before shipping that path.

### How to add a content type

1. Add a registry entry in `lib/content-types.ts`: key, collection (`marketing_<key>`),
   `urlBase`, zod schema extending the shared base, `idFor`, `compare`, and the
   `{sitemap, llmsTxt, rss}` flags. The API, caching, seed shape — and M3's sitemap/llms.txt/
   RSS — pick it up from the registry with zero surface code.
2. Create `app/<urlBase>/page.tsx` + `app/<urlBase>/[slug]/page.tsx` composing the default
   templates. List page:

   ```tsx
   import { ContentList } from '@/components/ContentList';
   import { listContent } from '@/lib/content';
   import { CONTENT_TYPES } from '@/lib/content-types';
   export const revalidate = 300;
   export default async function Page() {
     const type = CONTENT_TYPES.find((t) => t.key === 'articles')!;
     const items = await listContent(type);
     return <ContentList heading="Articles" urlBase={type.urlBase} items={items} />;
   }
   ```

   Detail page: fetch the entry from `listContent`, render `<ContentDetail title=… html={render(entry.bodyMd)} />`,
   `redirect(type.urlBase)` when absent (see `app/docs/[slug]/page.tsx` for the full pattern
   incl. `generateStaticParams`/`generateMetadata`).
3. Optionally customize presentation — docs and changelog are examples of fully bespoke pages
   over the same readers.

### Caching / build rules

- Readers swallow store-unavailable errors and return empty: **`next build` needs no database
  credentials** (pages prerender empty; ISR + `revalidateTag` fill them at runtime). Don't
  "fix" the try/catch in `lib/content.ts` — M4's Docker build depends on it.
- After publishing, pages reflect the change on the next request (tag invalidation); worst
  case 300s if an invalidation is missed.

## Dev

- `npm install` / `npm run dev` — local dev at http://localhost:3000.
- **Store access locally = operator ADC**: `gcloud auth application-default login` (reads/writes
  the real `ghosty-central` collections — be deliberate). For isolated hacking, the Firestore
  emulator works out of the box: `gcloud emulators firestore start --host-port=localhost:8791`,
  then run dev/seed with `FIRESTORE_EMULATOR_HOST=localhost:8791`.
- Writes need `MARKETING_CONTENT_TOKEN` in `.env.local` (any value locally; prod value lives in
  the platform secret store, wired in M4).
- Seed: `MARKETING_CONTENT_TOKEN=… npm run seed -- ~/projects/claude-cli/ghosty` (env
  `MARKETING_URL` targets a non-local server; PUT = upsert, so re-runs converge). The operator
  runs this against the live service in OPS O1.
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
- **Vendor-free language**: nothing user-facing (page copy, API error messages) mentions Google
  internals (Cloud Run/SQL, IAM, TLS…) — say "the Ghosty platform" / "the Ghosty database".
  Internal repo docs (this file) may name Firestore.
