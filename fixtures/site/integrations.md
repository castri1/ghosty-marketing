---
title: Integrations
description: Connect third-party services — AI models, payments, email, messaging — to your apps without ever putting a key in your code.
order: 10
---

Ghosty apps use third-party services without holding the credentials for
them. You save a key once, attach the service to an app, and the platform
injects the real credential into each request on the way out. Your code,
your repository, and your deploys never contain a secret.

## Connect a service

1. In the console, open **Integrations** and pick a service.
2. Paste the API key (and any account settings the service needs).
3. Save. The key is encrypted immediately and becomes **write-only** — no
   screen or API will ever display it again. You can replace it or delete
   the connection at any time.

## Attach it to an app

On the app's **Integrations** tab, attach the connection. Attaching is
instant — no redeploy. Each app can hold one connection per service, and
detaching cuts access on the very next call.

## Use it from your code

Your app receives two environment variables when its first integration is
attached: `GHOSTY_INTEGRATIONS_URL` and `GHOSTY_INTEGRATIONS_TOKEN`. Call
the service through that URL — same paths and request shapes as the
provider's own API, prefixed with the service name:

```
POST {GHOSTY_INTEGRATIONS_URL}/openai/v1/chat/completions
Authorization: Bearer {GHOSTY_INTEGRATIONS_TOKEN}
```

The platform swaps your app token for the real credential and passes the
response straight through — streaming included. Scaffolded apps include a
ready-made helper, so in practice this is one function call.

For local development, the app's Integrations tab has a **Local
development** block with the URL and token to drop into `.env.local`.

## Receiving events from a service

Some services don't just answer your app's calls — they *notify* it.
Stripe, for example, tells your app when a checkout completes or a
subscription changes. Ghosty receives those notifications for you, checks
that each one genuinely came from the provider, and hands only verified
events to your app.

1. On the app's **Integrations** tab, find the attached service and click
   **Enable events**. You get a **Ghosty events URL**.
2. Paste that URL where the provider asks for a webhook or event
   destination (for Stripe: Dashboard → Developers → Webhooks), and pick
   the events your app cares about.
3. The provider gives you a **signing secret** for that destination —
   paste it back into the Events section. Like every credential, it's
   write-only from that moment.

Scaffolded apps come with a ready-made handler — register what you care
about and the platform does the rest:

```js
import { onEvent } from './lib/events';

onEvent('stripe', async (event) => {
  if (event.type === 'checkout.session.completed') {
    // mark the order paid
  }
});
```

Anything that can't be verified — a bad signature, a stale delivery — is
dropped before it reaches your code, and shows up in the app's **Recent
events** list so you can spot a mispasted secret at a glance. If your app
is briefly down, deliveries are retried, and the provider's own retry
schedule keeps events safe for longer outages.

## Sharing (company plans)

A connection belongs to whoever created it. On a company plan the creator
can share it with the team — then any builder can attach it to their apps.
Un-sharing or deleting the connection revokes every attachment at once.

## Available services

| Category | Services |
|---|---|
| AI | OpenAI, Anthropic, Google Gemini, Groq, ElevenLabs, Replicate, Firecrawl, Exa |
| Commerce | Melonn (Sellers API) |
| Search | Algolia, Pinecone |
| Payments | Stripe |
| Email | Resend, SendGrid, Postmark |
| Messaging | Twilio, Slack, Discord, Telegram |
| Maps | Mapbox |
| Monitoring | Sentry |
| Analytics | PostHog |
| Productivity | GitHub, Notion, Linear, Airtable |

More services are added regularly — watch the [changelog](/changelog).

## Rotating a key

Save a new value on the connection and it takes effect on the next call
from every attached app. To cut access entirely, delete the connection or
detach the app.

## Seeing what your app does

Each app's **Integrations** tab includes a usage view: calls per connected
service over the last 7 or 30 days, response times, and any errors —
updated automatically as your app runs.

To keep shared services healthy, the platform applies a fair-use limit per
app and service. An app that exceeds it briefly receives a clear
"try again shortly" response (with a `Retry-After` hint) instead of a
provider error; normal traffic is never affected.
