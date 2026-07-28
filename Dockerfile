# Production image for the Ghosty marketing site (Cloud Run service
# `marketing`, deployed by .github/workflows/deploy.yml).
#
# node:24-alpine, NOT node:20 — package.json `engines` requires Node >=23.6
# (scripts/seed.ts runs TypeScript natively); Node 24 is the current LTS
# satisfying it. Keep both stages on the same base.
FROM node:24-alpine AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# IMPORTANT: `next build` runs with NO database credentials — the content
# readers in lib/content.ts tolerate a missing store and prerender empty
# pages (ISR + revalidateTag fill them at runtime). Do not add creds here.
RUN npm run build

# ---------------------------------------------------------------------------
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
# Next standalone server binds process.env.HOSTNAME — must be 0.0.0.0 in a
# container. PORT is respected (Cloud Run injects its own PORT).
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# `next build` does NOT place public/ or .next/static inside the standalone
# dir — both must be copied in (documented in next.config.mjs).
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
