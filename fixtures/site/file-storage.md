---
title: File storage
description: Private file storage for every app — uploads, downloads, and expiring share links, with zero setup.
order: 30
---

Any Ghosty app can have its own private file storage: a place to keep
uploads, generated documents, exports — anything that doesn't belong in
the database. Files are private to the app by default; sharing happens
through links that expire.

## Enable it

Set `"fileStorage": true` in your app's `app.config.json` and run
`ghosty provision`. That's the same flip-a-flag flow as the database —
Ghosty creates the storage and connects the app to it. Apps scaffolded
with file storage in mind arrive with the flag already set.

## Use it from your code

Scaffolded apps include a small helper — `files.ts` (Node) or `files.py`
(Python) — that is the only thing your code touches:

- **save** a file and get its name back
- **read** it later
- **list** what's stored
- **delete** what you no longer need
- **share** — create a link that works for anyone, until it expires

You never configure credentials or storage locations; the platform wires
the app to its storage on deploy.

## Sharing files

Share links are the only way a file leaves the app: each link is scoped to
one file and carries an expiry you choose (minutes to days). When the link
expires, access ends — the file itself stays put. There is no way to make
the storage itself public.

## See what's stored — the Files tab

Every app with file storage gets a **Files** tab on its console page. It
shows everything the app has stored, organized by folder:

- **Browse** folders and files, with sizes and last-updated times.
- **Preview** images, PDFs, and text files right in the console
  (up to 10 MB per file).
- **Download** any file through the console (up to 50 MB — larger files
  stay accessible to the app itself).
- **Delete** files the app no longer needs. Deleting is permanent, and the
  app may stop showing content that depended on the file.

The Files tab is a management view, not a sharing tool: previews and
downloads only work for signed-in members of your workspace. If you want a
file in front of someone else, use your app's own sharing features — the
expiring links described above.

## Local development

`ghosty dev` needs no setup: locally, the same helper stores files in a
git-ignored folder inside your backend, so you develop against the
identical API with nothing to install and no cloud account.

## Good to know

- Each app's storage is its own — apps never see each other's files, even
  within the same company.
- Storage is created when you enable the flag and removed if the app is
  deleted; files survive deploys and rollbacks.
