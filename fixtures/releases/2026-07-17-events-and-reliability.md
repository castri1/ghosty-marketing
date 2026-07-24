---
title: Your apps can now receive events — plus a rounder, more reliable platform
summary: Stripe and other services can push verified events straight to your app, the Ghosty command line keeps itself up to date, and domain setup got friendlier.
---

The biggest piece first: connected services don't just answer your app
anymore — they can **notify it**. Enable events for an attached service
(Stripe, for example) and Ghosty gives you an events address to paste into
that service's dashboard. From then on, every notification is checked for
authenticity and delivered to your app's code — a checkout completing, a
subscription changing — with unverifiable deliveries dropped before they
ever reach you, and a Recent-events list so you can see what arrived.
Scaffolded apps include a ready-made handler: register what you care about
and the platform does the rest.

The **Ghosty command line now keeps itself current**. It quietly checks for
newer versions, tells your app's coding assistant in a way it can act on
(so updates just happen — you're never asked to run anything), and the
platform can gently retire versions that are too old to serve safely.

**Custom domains got sturdier**: a domain's verification window is now
visible while it's counting down, a domain that verifies near the deadline
is honored rather than dropped, and if one does expire you can reclaim it
yourself immediately — no support round-trip.

And a fix worth celebrating: **new apps no longer show a failed first
deploy** in their history. One deploy, the right one, from the first
minute.

[Receiving events →](/docs/integrations) ·
[Command line updates →](/docs/cli-updates) ·
[Custom domains →](/docs/custom-domains)
