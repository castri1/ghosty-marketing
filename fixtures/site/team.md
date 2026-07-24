---
title: Your team
description: Invite teammates to your workspace, choose their role, and remove access when someone leaves.
order: 5
---

Your company workspace is built by a team. This page covers how people get
in, what each role can do, and what happens when someone leaves.

## Inviting teammates

Go to **Settings → Team** in your company console and add a teammate by
email. That's it — there's no acceptance ceremony:

- They get an email letting them know they've been added.
- They can sign in immediately at [getghosty.dev](https://getghosty.dev)
  with that email address. Ghosty sends them a one-time sign-in link — no
  password to set, nothing to configure.
- Until their first sign-in, the team list shows them as **invited**; after
  it, **active**. If the email got lost, use **Re-send invite** on their row.

Any email address works — teammates don't need a company email domain.

Prefer not to type addresses? Create an **invite link** from the same page
and share it in chat. Anyone with the link joins as a member. Links expire
after 14 days, and you can revoke one at any time — people who already
joined keep their access.

## Roles

| Role | What they can do |
| --- | --- |
| **Owner** | The person who created the company. Everything admins can do, plus managing who the admins are. |
| **Admin** | Manage the team (add and remove members), company settings, and see every app. |
| **Member** | Build: create apps, deploy, manage their apps' settings and data. |

Only the owner can grant or remove the admin role. Owners can't be removed —
to transfer ownership, contact Ghosty support.

## Removing someone

Remove a teammate from **Settings → Team**. They lose access immediately —
the console, the workspace, and every app's controls. Their apps and code
stay: apps belong to the company, and the source lives in your company's
GitHub organization.

If you add them back later, they pick up right where the role you give them
allows — nothing extra to restore.

## What members can access

Everyone on the team signs in to the same company console and sees the
company's apps. What being on the team does **not** control is who can use
the apps you ship — each app chooses its own audience when you create it:
public, invite-only, or its own sign-in.
