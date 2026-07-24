---
title: Keeping the CLI up to date
description: How the ghosty CLI notices new versions, what coding agents see, and how to turn the check off.
order: 40
---

The ghosty CLI keeps itself honest about its own version so you never have to
wonder whether a problem is "my install is stale." It tells the Ghosty
platform which version it is on every request, and once a day it quietly
checks whether a newer version has been published.

## What you'll see

When a newer CLI exists, commands still run exactly as before. After a
command finishes, a single note appears:

```
! A newer ghosty CLI is available (0.17.0 → 0.18.0): npm i -g ghosty-cli@latest
```

That one line is the whole experience — no prompts, no blocked commands, no
nagging on every run. Updating when convenient is enough.

## For coding agents

If you drive the CLI with `--json`, the update signal is machine-readable and
never disturbs the output contract:

- When an update is pending, the **first** JSON line of a run is
  `{"event":"cli-update","current":"0.17.0","latest":"0.18.0"}`. The final
  ready line of every command is unchanged — keep treating the last JSON line
  as the result.
- If the platform requires a newer CLI than the one installed, the command
  fails with exit code **3** and a final JSON line of
  `{"ok":false,"code":"CLI_OUTDATED","error":"…"}`. The right response is to
  run `npm i -g ghosty-cli@latest` and retry the command — agents should
  absorb the update themselves rather than surface it to the user.

Apps created on Ghosty come with this behavior built in: the app's bundled
agent guidance tells the in-repo coding agent to apply CLI updates itself,
silently, and the app's `/doctor` pre-publish check looks for updates
whenever it can (applying one on the spot if found). If you work in a Ghosty
app through its coding agent, you never need to think about CLI versions at
all.

## When an update is required

Occasionally a platform change is big enough that older CLIs can no longer
talk to it safely. When your platform has set a minimum CLI version and your
install is below it, commands stop with one clear message instead of failing
strangely:

```
This version of the Ghosty CLI is no longer supported — update to continue.
```

Run `npm i -g ghosty-cli@latest` and re-run your command — nothing else
changes. In `--json` mode this is the exit-code-3 / `CLI_OUTDATED` case
described above, so agents handle it the same way. Most platforms never set a
minimum; when one is set, the CLI's daily check will almost always have
nudged you long before it matters.

## Turning the check off

The version check never runs in CI (`CI` set), and you can disable it
anywhere by setting `GHOSTY_NO_UPDATE_CHECK=1`. Pipelines that pin a specific
CLI version stay pinned and silent. The check is a single small request at
most once per day, stores only a timestamp and the latest version number in
`~/.ghosty/version-check.json`, and never sends anything about you or your
apps.
