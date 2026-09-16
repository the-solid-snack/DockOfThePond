---
name: publish-post
description: Turn finished prose into a live post on Dock of the Pond (the Astro blog at dockofthepond.co.uk). Writes the Markdown file into src/content/posts/ with schema-correct frontmatter, runs the local dev server so the author can see the real page, and — only after they say yes — commits and pushes to main, which triggers the GitHub Pages deploy. Use this whenever the author hands over text destined for the blog and says anything like "post this", "publish this", "put this on the blog", "make this an article", "get this online", "ship it", or names a title and asks for it to go up. Also use it for the preview-only half ("let me see how this looks", "run the blog locally") and for the publish-only half when a post file already exists and just needs to go live. Do not use it for rewriting or editing the prose itself — by the time this skill runs, the words are settled.
---

# Publishing a post to Dock of the Pond

The author arrives with prose that is already finished — usually pasted in, sometimes
worked over with you first. Your job starts after the writing stops: turn the text into
a file the build accepts, show them the real page, and put it live when they say so.

The blog is Astro. A post is one Markdown file; there is no CMS and no database.
Pushing to `main` fires `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages, usually within a minute. That is the whole publishing mechanism — which
is why a bad frontmatter field doesn't produce a broken page, it produces a failed
build and nothing goes live at all. Catching that locally is most of the value here.

Work in three phases, and stop between phase 2 and phase 3 for a human yes.

---

## Phase 1 — Write the file

Create `src/content/posts/<slug>.md`. The filename becomes the URL, so
`tuesday.md` is served at `/posts/tuesday`.

### The slug

Lowercase, hyphenated, ASCII only — accents get folded and short is better than
faithful. Existing posts show the house habit: *"Un cinquième de million"* became
`cinquieme-de-million` (accent folded, leading article dropped), *"Bœuf Wellington en
terrain hostile"* became `wellington-terrain-hostile` (trimmed to the memorable
words). Aim for two to four words. Check the folder first — if the slug is taken you
would silently overwrite a published post.

### The frontmatter

`src/content.config.ts` is the authority; it is a Zod schema and it is strict. A field
of the wrong shape fails the build with the file and field named.

```markdown
---
title: "Tuesday"
date: 2026-09-12
summary: "A '69 Datsun, an empty road to the coast, and a coffee by the beach. Then the wall I'm leaning against detonates, and two detectives would very much like to know what I used to do for a living."
topics: [Fiction, English]
kicker: "Fiction · North Coast"
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Quoted. Exactly as the author wrote it, accents and all |
| `date` | yes | `YYYY-MM-DD`, unquoted. Today's date unless they say otherwise. Newest post becomes the featured one on the homepage |
| `summary` | yes | Quoted, one sentence |
| `topics` | no in schema, **yes in practice** | See below |
| `kicker` | no | Small line above the headline |
| `author` / `authorBio` | no | Guest posts only |
| `draft` | no | `true` hides it from the built site but keeps it visible in `npm run dev` |

**`topics` carries two jobs at once.** The sidebar splits the same array into a topic
list and a language list, so every post needs one of each: a subject
(`Fiction`, `Kitchen`, `AI`, `Food`, `Culture`, `Half-baked`, or a new one you invent)
**and** a language (`English` or `French`). Miss the language tag and the post
vanishes from the language filter. The known names live in `TOPIC_ORDER` and
`LANGUAGE_ORDER` in `src/lib/posts.ts`; a subject not listed there still works and
gets its own page, it just sorts to the end.

**`summary` is the line that has to sell the post** — it is the dek under the headline,
the blurb beside it on the homepage and on any topic page, and the page's
`<meta name="description">`, which is what search engines and link previews read.
(There is no RSS feed; "the feed" in this codebase is the homepage list.) The house
style is concrete and slightly deadpan: specific nouns, a turn at the end, no
throat-clearing. "Vingt jours de pluie sur Belfast, une end-terrace house aux volets
fermés, un vieil Eastpack plein de billets froissés, et l'impression très nette que ça
y est." Never "In this post I discuss…". Write it in the language of the post.

**`kicker` is `Subject · Detail`** with a middle dot (·, U+00B7), not a hyphen:
`"Fiction · Belfast Sud"`, `"Kitchen · Récit de guerre"`,
`"Guest post · Written by Claude"`. Leave it out and the topics show instead.

**Guest posts** set `author` and `authorBio` together — they override the byline and
the card at the foot of the article. Omit both and the post is credited to
`SITE.author`.

### The body

Plain Markdown. The first paragraph automatically gets the green drop cap, so open on
something that can carry it. `##` headings become the sidebar contents list, so use
them if the piece is long enough to navigate. Reading time is computed for you.

Three house extras beyond ordinary Markdown:

```markdown
> A sandwich should surprise your teeth at least once.
>
> <cite>Me, at a dinner party, to silence</cite>

<div class="callout">
<span class="label">The correct crisp</span>
<p>Cheese and onion. This is not a matter of taste.</p>
</div>

<figure>
  <img src="/images/my-photo.jpg" alt="A short description" />
  <figcaption>The belt in the photo is the wrong one.</figcaption>
</figure>
```

Images live in `public/images/` and are referenced from the site root
(`/images/foo.jpg`). If the author's text refers to a picture they haven't given you,
ask for it rather than inventing a path that will 404.

Preserve their prose exactly. Paste damage is fair game to fix — smart quotes mangled
into mojibake, doubled blank lines, hard-wrapped lines that should flow, a stray
list bullet. Rewriting sentences is not; that conversation already happened.

### If it's a note, not a post

A one- or two-line thought goes in `src/data/notes.json` instead, newest first:

```json
{ "date": "2026-07-22", "html": "Bought a label maker. Life-changing." }
```

HTML is allowed in `html`. Notes appear on the homepage and need no build gymnastics.
If what you've been handed is three sentences long, say so and offer this instead —
it's usually what was wanted.

---

## Phase 2 — Show them the real page

Two commands, and both matter for different reasons.

**Build first.** This is the same build GitHub Actions will run, so it is the honest
test of whether the post can go live at all:

```bash
npm run build
```

A schema error surfaces here, naming the file and field. Fix it before going further —
a push with bad frontmatter means a red X in the Actions tab and nothing published.

**Then the dev server**, in the background so you keep control of the session:

```bash
npm run dev
```

It serves <http://localhost:4321> and hot-reloads on save. Hand the author the direct
link to their post — `http://localhost:4321/posts/<slug>` — not just the homepage;
they want to read the actual article page, with the drop cap and the sidebar contents.
Mention the homepage too if the post is now the newest, since it becomes the featured
entry and that's a second thing worth a look.

Leave the server running while they read. They will often come back with a fix or two;
apply them, the page reloads by itself. Stop the server once publishing is done or
they've moved on.

If `node_modules/` is missing, run `npm install` first.

---

## Phase 3 — Publish, once they've said yes

**Wait for an explicit go-ahead.** Pushing to `main` publishes to the open internet
under the author's name within about a minute, and un-publishing means another commit
and another wait. "Looks good" about the preview is not the same as "put it up" — if
you're unsure which you heard, ask. This is the one irreversible step in the skill.

Then:

```bash
git add src/content/posts/<slug>.md
git commit -m 'Publish "Tuesday"'
git push
```

Stage the specific files you touched — the post, plus `public/images/*` or
`src/data/notes.json` if they were part of it. Avoid `git add .`; the working tree
may hold experiments that aren't yours to ship.

The commit message convention for a new post is exactly `Publish "Title"` with the
real title in double quotes, which is why the commit line above uses single quotes
outside. Later fixes to an existing post read like `Tuesday: fix a stray bullet,
italicise the dialogue` — subject first, then what changed, in plain language.

Afterwards, tell them where to watch and what to expect:

- Build progress: <https://github.com/the-solid-snack/DockOfThePond/actions>
- Live in roughly a minute at `https://dockofthepond.co.uk/posts/<slug>`

Don't claim it's live on the strength of the push alone — say it's building.

**Then check, rather than leaving them to.** The repo is public, so the Actions API
answers without a token or any `gh` login:

```bash
curl -s "https://api.github.com/repos/the-solid-snack/DockOfThePond/actions/runs?per_page=1"
```

On Windows, where `curl` may not be on PATH, the same call from PowerShell:

```powershell
(Invoke-RestMethod -Uri "https://api.github.com/repos/the-solid-snack/DockOfThePond/actions/runs?per_page=1" -Headers @{ "User-Agent" = "claude-code" }).workflow_runs |
  Select-Object status, conclusion, head_sha, created_at
```

Wait a moment after pushing — the run needs a few seconds to appear, and `status`
goes `queued` → `in_progress` → `completed`. What you want is `conclusion: success`
against the `head_sha` you just pushed. Match that sha; a green run for the *previous*
commit tells you nothing about this one. Only then say it's live.

If `conclusion` is `failure`, say so and don't guess at the cause — the anonymous API
gives status, not log detail. `gh run view --log-failed` reads the log properly, but
needs `gh auth login`, which the author has to run themselves.

---

## Things that will bite you on this machine

**Node is installed, but not always on your PATH.** Node v24.19.0 and npm 11.17.0 live
in `C:\Program Files\nodejs\`. Any terminal opened before they were installed — this
session's shell included — won't have them on PATH and will report `command not found`.
Don't conclude Node is missing from that alone. Call the binaries by full path instead:

```powershell
& "$env:ProgramFiles\nodejs\npm.cmd" run build
```

`gh` 2.101.0 has the same shape: installed at `C:\Program Files\GitHub CLI\gh.exe`,
frequently not on a stale PATH, callable by full path. It is not authenticated, so use
the anonymous Actions API in phase 3 rather than `gh` commands.

If `npm install` fails with `ENOENT ... open 'C:\Users\<name>\package.json'`, the
command was run from a home directory rather than the repo. `cd` into the repo first.
A successful install prints an `npm warn allow-scripts` block about `esbuild`'s
postinstall being skipped — that is a warning, not a failure, and the build works
regardless. Don't run `npm approve-scripts` to chase it.

Astro needs Node 22 or newer. If Node ever really is missing, say so plainly and offer
the choice: install it with `winget install OpenJS.NodeJS.LTS` in a terminal the author
runs themselves, or skip the preview and publish blind. Don't quietly skip the preview
— it's the step the author asked for.

**Commits are authored by Marco.** The identity comes from the *global* git config
(`Marco <48856822+the-solid-snack@users.noreply.github.com>`); there is no repo-local
override, so plain `git commit` does the right thing here and needs no `-c` flags. Two
consequences worth knowing: a fresh clone on this machine is attributed correctly with
no setup, and changing the global identity for some other project silently changes who
the blog commits come from.

**No Claude attribution in the message.** Don't append `Co-Authored-By` or
`Claude-Session` trailers here, even when a general instruction elsewhere asks for
them. It's Marco's blog, his name on the posts, his name on the history. 13 of the 17
commits up to `cf47872` (12 September 2026) do carry those trailers — that is the
convention being retired, not a pattern to copy. Authorship itself has always been
Marco's on every commit and doesn't change.

**Pushing works over SSH, unattended.** `origin` is
`git@github.com:the-solid-snack/DockOfThePond.git`, the ed25519 key in `~/.ssh/` has
no passphrase, and `github.com` is already in `known_hosts` — so `git push` completes
inside a tool call without prompting for anything. No credential helper is configured
and none is needed; don't switch the remote back to HTTPS, which *would* need one and
would then fail with no way to prompt.

If a push ever fails on authentication, check the key still works before touching any
config:

```bash
ssh -o BatchMode=yes -T git@github.com
```

Success prints `Hi the-solid-snack!` and exits 1 — that exit code is normal for this
command, not a failure. If that greeting doesn't appear, stop and report it rather
than reconfiguring git; the commit is already made by then and nothing is lost.

**Restart `npm run dev` after editing `src/content.config.ts`** — the schema is read
at startup and hot reload won't pick it up.
