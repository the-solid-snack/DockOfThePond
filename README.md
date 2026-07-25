# Dock of the Pond

A personal blog. Plain HTML and CSS, built by [Astro](https://docs.astro.build) from
Markdown files. No database, no server, no CMS — you write a text file, push it, and
the site rebuilds itself.

---

## Writing a post

Create a file in `src/content/posts/`. The filename becomes the URL, so
`crisp-sandwich.md` is published at `/posts/crisp-sandwich`.

```markdown
---
title: "In defence of the crisp sandwich"
date: 2026-07-22
summary: "One line that appears on the homepage and in the RSS feed."
topics: [Food, Half-baked]
kicker: "Food · A hill I will die on"
draft: false
---

Your first paragraph gets the big green drop cap automatically.

## A heading like this appears in the sidebar contents

Normal text. **Bold**, *italic*, `inline code`, [a link](https://example.com).
```

### The frontmatter fields

| Field | Required | What it does |
|---|---|---|
| `title` | yes | Headline, page title, feed entry |
| `date` | yes | `YYYY-MM-DD`. Controls ordering; newest post is the featured one |
| `summary` | yes | The line under the headline, on the homepage, and in RSS |
| `topics` | no | Any of `Food`, `Culture`, `Tech`, `Half-baked` — or invent one and it gets its own page |
| `kicker` | no | Small line above the headline. Defaults to your topics |
| `draft` | no | `true` hides it from the published site but keeps it visible locally |

Get a field wrong and the build tells you exactly which file and which field. That's
the schema in `src/content.config.ts` doing its job.

### Things you can drop into a post

Reading time is counted for you. Headings become the sidebar contents list. Beyond
ordinary Markdown, these work:

**A code block** — the language name after the backticks turns on colouring:

````markdown
```rust
fn main() { println!("hello"); }
```
````

**A pull quote** with attribution:

```markdown
> A sandwich should surprise your teeth at least once.
>
> <cite>Me, at a dinner party, to silence</cite>
```

**A side note** in the grey box:

```markdown
<div class="callout">
<span class="label">The correct crisp</span>
<p>Cheese and onion. This is not a matter of taste.</p>
</div>
```

**A picture.** Put the file in `public/images/`, then:

```markdown
![A short description for screen readers](/images/my-photo.jpg)
```

For a caption, use a figure instead:

```markdown
<figure>
  <img src="/images/my-photo.jpg" alt="A short description" />
  <figcaption>The belt in the photo is the wrong one.</figcaption>
</figure>
```

### A short note instead of a post

Edit `src/data/notes.json` and add an object at the top of the list. HTML is allowed
in the text.

```json
{ "date": "2026-07-22", "html": "Bought a label maker. Life-changing." }
```

---

## Running it on your machine

You need [Node](https://nodejs.org) 22 or newer. Once, in the project folder:

```bash
npm install
```

Then, every time you want to write:

```bash
npm run dev
```

Open <http://localhost:4321>. Save a file and the browser updates itself. `Ctrl-C`
in the terminal stops it.

To check the real build before publishing:

```bash
npm run build && npm run preview
```

---

## Publishing

Set up once:

1. Push this folder to a GitHub repository.
2. In the repo, **Settings → Pages → Source**, choose **GitHub Actions**.
3. Point your domain at GitHub Pages — [the DNS instructions are here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
4. Set `site:` in `astro.config.mjs` to your domain (already done: `https://andolfatto.co.uk`).

The `public/CNAME` file is there for completeness, but because this repo deploys via a
GitHub Actions workflow rather than from a branch, GitHub ignores it — the domain in
**Settings → Pages** is what counts.

After that, publishing is:

```bash
git add .
git commit -m "New post about crisps"
git push
```

The workflow in `.github/workflows/deploy.yml` builds the site and puts it live,
usually within a minute. The Actions tab shows progress and any failure.

---

## Renaming the blog

1. `src/lib/site.ts` — title, description, your name, location, sidebar links.
2. `src/components/Logo.astro` — the wordmark next to the mark.
3. `src/pages/index.astro` — the big title on the front page and the catch phrase.
4. `src/components/SiteFooter.astro` — the signature at the bottom.

The rotating logo lives in `Logo.astro` and `public/favicon.svg`. Same two shapes in
both, so change them together.

---

## Changing how it looks

Everything visual is in `src/styles/global.css`, and the colours are the variables at
the very top. Change `--terra` and the accents change everywhere.

| Variable | Currently | Used for |
|---|---|---|
| `--paper` | warm off-white | Page background |
| `--ink` | near-black | Body text |
| `--green` | dark green | Headings on hover, emphasis, drop cap |
| `--terra` | terracotta | Accents, arrows, rules, progress bar |

Dark mode is the `[data-theme="dark"]` block underneath, and the toggle sits at the
bottom of the sidebar.

Fonts are loaded from Google Fonts in `src/layouts/Base.astro`: Instrument Serif for
display, Newsreader for reading, Inter for small text, JetBrains Mono for code.

---

## What each file does

```
src/
  content/posts/*.md      ← your posts. This is the folder you live in
  data/notes.json         ← the short notes on the homepage
  content.config.ts       ← the rules for post frontmatter
  lib/site.ts             ← blog name, description, links
  lib/posts.ts            ← sorting, dates, reading time, topic counts
  styles/global.css       ← all styling for the whole site
  components/             ← logo, sidebar, footer, theme toggle
  layouts/Base.astro      ← the page shell: head, fonts, scripts
  layouts/Post.astro      ← the article page
  pages/index.astro       ← the front page
  pages/posts/[...id].astro  ← one page per post, generated
  pages/topics/[topic].astro ← one page per topic, generated
  pages/archive.astro     ← the full list
  pages/about.astro       ← edit this with your own words
  pages/rss.xml.ts        ← the feed
public/                   ← images, favicon, CNAME. Served as-is
```

---

## Tools for the actual writing

Any of these produce the Markdown files this site expects. Nothing here is required —
Notepad works — but these make it pleasant.

- **[Obsidian](https://help.obsidian.md/)** — free. Point a vault at `src/content/posts`
  and you get live preview, backlinks, and a phone app. The closest thing to a
  purpose-built blog editor here.
- **[VS Code](https://code.visualstudio.com/docs)** — free. Best if you also want the
  terminal and git in one window. Add the
  [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
  for highlighting.
- **[iA Writer](https://ia.net/writer/support)** — paid, macOS/iOS/Windows. Distraction-free,
  excellent typography, native Markdown.
- **[Typora](https://support.typora.io/)** — paid, cheap, one-time. What-you-see-is-what-you-get
  Markdown, no visible syntax.
- **[GitHub's web editor](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)** —
  press `.` in your repo on github.com and you get VS Code in the browser. Handy for a
  typo fix from someone else's computer.

And the reference you'll actually reach for:

- [Markdown guide](https://www.markdownguide.org/basic-syntax/) — the syntax, one page.
- [Astro docs](https://docs.astro.build/en/getting-started/) — if you want to change how the site works.
