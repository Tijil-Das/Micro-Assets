# Dev Learnings

> *"An expert is someone who has made all the mistakes in a narrow field."* — Niels Bohr

A problem solved without writing it down is a problem I'll solve again.
Every entry here has two lives: what I actually learned, and how I'd articulate it to someone who wasn't there.

---

## How to use this

### Adding a new learning
1. Figure out the domain: `auth`, `frontend`, `backend`, `architecture`, `databases`, `security`, `devops`, `ai`, or `tools`.
2. Create a new file: `learnings/[domain]/concept-slug.md`
3. Open [`RULES.md`](RULES.md) and copy the frontmatter + section template exactly. Fill it all in.
4. Add a row to [`INDEX.md`](INDEX.md) in the same commit.
5. If `portfolio-worthy: yes` — write the case study version in `portfolio/case-studies/`.

### Adding a mistake
Same flow, but under `mistakes/[domain]/`. Lead `## The Problem` with what I did wrong first.
Mistakes are honest. Write what it cost — time, credibility, sleep.

### Adding a pattern or snippet
Drop it in `patterns/snippets/` or `patterns/templates/`. Must work standalone — no "see README for setup."

### Monthly
- Update `meta/goals.md` — still moving toward them?
- Write `meta/retrospectives/YYYY-MM.md` — what worked, what didn't, honest rating.

---

## Structure

```
Dev Learnings/
│
├── START-HERE.md             ← This file. Start here.
├── RULES.md                  ← Entry template + all rules. Read before adding anything.
├── INDEX.md                  ← Living index of every entry. Updated on every commit.
│
├── learnings/                ← One concept, one file. Organized by domain.
│   ├── auth/
│   ├── frontend/
│   ├── backend/
│   ├── architecture/
│   ├── databases/
│   ├── security/
│   ├── devops/
│   ├── ai/
│   └── tools/
│
├── mistakes/                 ← Separate from learnings. Honest post-mortems.
│   └── (mirrors learnings/ structure)
│
├── patterns/
│   ├── snippets/             ← Drop-in, self-contained code pieces.
│   └── templates/            ← Full working file templates.
│
├── projects/                 ← Per-project architecture, decisions, and evolution.
│   └── CircuitIQ/
│
├── portfolio/
│   ├── case-studies/         ← Written for an external reader. No assumed context.
│   └── writeups/             ← Blog-ready technical posts.
│
└── meta/
    ├── goals.md              ← Career direction. Review monthly.
    ├── reading-list.md       ← What to consume next.
    └── retrospectives/       ← Monthly. Named YYYY-MM.md.
```

---

## Quick nav

| I want to... | Go to |
|---|---|
| Find something specific | [`INDEX.md`](INDEX.md) |
| Add an entry | [`RULES.md`](RULES.md) |
| Browse by project | [`projects/`](projects/) |
| Grab reusable code | [`patterns/`](patterns/) |
| Prepare a portfolio piece | [`portfolio/case-studies/`](portfolio/case-studies/) |
| Check career direction | [`meta/goals.md`](meta/goals.md) |
| Review recent months | [`meta/retrospectives/`](meta/retrospectives/) |

---

*Last updated: 2026-07-20*
