---
title: "My terminal setup is boring on purpose"
date: 2026-06-09
summary: "Every year I rebuild my dotfiles and every year I delete more than I add. The current config fits on one screen and I can rebuild it from memory."
topics: [Tech]
kicker: "Tech · Tools"
---

There was a period of about four years where my shell config was a small software
project with its own bugs. Startup took the better part of a second, half of it
loading things I used once a quarter, and any new machine meant an afternoon of
gentle archaeology.

The current version has no plugin manager, no prompt framework, and about thirty
lines of actual configuration. It starts instantly, which turns out to matter more
than any single feature I removed.

## The rule I use now

If I cannot explain what a line does, it goes. If I have not used it in a month, it
goes. If it needs a plugin manager to install, it almost certainly goes.
