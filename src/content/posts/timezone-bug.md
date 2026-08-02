---
title: "The bug was the timezone. The bug is always the timezone."
date: 2026-07-04
summary: "A short field guide to the six ways a date can betray you, collected over one very long Tuesday and one increasingly confused customer."
topics: [Tech, English]
kicker: "Tech · Confessions"
---

The report said the report was empty. Not wrong, not late — empty, for one customer,
on one day of the month, and only if you asked before lunch.

I want to write the rest of this properly, because the shape of the failure was more
interesting than the fix. For now, the summary is that we stored a date, called it a
day, and it was in fact an instant, and an instant belongs to somewhere.

## The six betrayals

1. A date that is really a timestamp.
2. A timestamp with no zone attached.
3. A zone attached at write time but not at read time.
4. Midnight, which happens twice a year in some places and never in others.
5. A database that helpfully converts, and a client that helpfully converts again.
6. Me, assuming any of the above had been handled.

More soon, once I've stopped being annoyed about it.
