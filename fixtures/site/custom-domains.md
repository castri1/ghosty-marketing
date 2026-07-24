---
title: Custom domains
description: Serve your apps from your own domain — register it once, then point any subdomain at any app.
order: 20
---

Every app gets a Ghosty address the moment it deploys. When you want your
own — `tools.yourcompany.com` instead of a `getghosty.dev` address — you
register the domain once, then map as many of its subdomains to apps as
you like.

## Register your domain

1. In the console, open **Domains** → **Register domain** and enter a
   domain you own (for example `yourcompany.com`).
2. The console shows the DNS records to add at your domain provider —
   copy them in exactly as shown.
3. Ghosty verifies the records automatically. The domain shows
   **Connecting** while that happens; once verified, secure `https`
   is set up for the whole domain without any further work from you.

Verification usually completes within minutes of the DNS records
propagating, though some providers take longer.

### Finish setup within 3 days

A new registration has a 72-hour setup window. If the records verify in
time — even at the last minute — the domain is yours and stays active.
If the window ends before the domain is verified, the registration shows
**Expired** in the console: nothing is lost and nobody else has taken it
from you, but the original setup instructions stop counting. Click
**Register again** on the expired domain to restart with fresh records.

The window exists so that unverified registrations can't reserve a domain
forever — an expired domain becomes claimable by whoever registers it
next, so re-register promptly if you still want it.

## Map subdomains to apps

Once the domain is active, mapping is instant: pick a subdomain, pick an
app, done — no new DNS records, no waiting. `reports.yourcompany.com`
today, `crm.yourcompany.com` tomorrow, all under the one registration.

When you map the domain itself (`yourcompany.com` with no subdomain), the
console also offers to point `www.yourcompany.com` at the same app — some
visitors type one, some the other, so mapping both is usually what you
want. The option is pre-selected; untick it to map the bare domain alone.
The `www` address becomes a normal mapping of its own, so you can remove
it (or point it at a different app) later without touching the rest.

While a brand-new address settles, visitors see a friendly "almost ready"
page instead of an error; it switches to your app automatically.

### If a record shows as missing

The domain's details page checks your DNS records live. A record marked
**missing** means your domain's own DNS answered that no such record
exists — it isn't a propagation delay, and waiting won't fix it. Add the
record exactly as shown (type, name, and value are all listed with copy
buttons) at your domain provider, and the status updates automatically at
the next check.

## Good to know

- **Your root domain keeps working.** Registering with Ghosty only claims
  the records you add — your website, email, and everything else on the
  domain stay untouched. If a record you're asked to add would conflict
  with something already pointing elsewhere, the console warns you before
  any harm is done.
- **Removing is safe.** Removing a mapping (or the whole domain) stops
  those addresses from opening your apps, but the apps stay live at their
  Ghosty addresses. You can re-register later.
- **One owner per domain.** A domain can only be registered by one account
  at a time.
