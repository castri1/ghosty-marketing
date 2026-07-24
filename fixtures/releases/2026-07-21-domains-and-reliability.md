---
title: Smarter custom domains and steadier app setup
summary: Point www at your app in one click, get told exactly which
  DNS record is missing, and app creation now rides out temporary
  hiccups on its own.
date: 2026-07-21
---

## Your www visitors, covered

Most people type `www.` in front of a domain — but if only the bare
domain is connected to your app, those visitors hit a dead end. Now,
when you connect a domain like `yourdomain.com` to an app, Ghosty
offers to connect `www.yourdomain.com` at the same time with a
pre-checked option. One click, both addresses. The www connection is
independent, so you can remove or repoint it separately at any time.
[docs →](/docs/custom-domains)

## "Still connecting…" now tells you why

Waiting on a domain that never comes online usually means one thing:
a DNS record that was never created. The domain page now tells the
difference between a record that exists but hasn't taken effect yet
and one that's missing entirely — and when it's missing, it shows the
exact record to add at your domain provider, so you can fix it in one
visit instead of guessing. [docs →](/docs/custom-domains)

## App creation shrugs off temporary hiccups

Very occasionally, a brand-new app could show a red failure during
setup even though nothing was really wrong — a piece of the platform
was simply asked for before it had finished getting ready. Setup now
detects that situation and quietly retries until it clears, so those
false alarms are gone. And on the rare occasion something genuinely
does fail, the message you see is now written in plain language and
tells you what to do next — while the details reach our team
automatically so we're already looking into it.
