# Dev Learnings

> *"An expert is someone who has made all the mistakes in a narrow field."* â€” Niels Bohr

A problem solved without writing it down is a problem I'll solve again.
Every entry here has two lives: what I actually learned, and how I'd articulate it to someone who wasn't there.

---

## How to use this

### Adding a new learning
1. Figure out the domain: `auth`, `frontend`, `backend`, `architecture`, `databases`, `security`, `devops`, `ai`, or `tools`.
2. Create a new file: `learnings/[domain]/concept-slug.md`
3. Open [`RULES.md`](RULES.md) and copy the frontmatter + section template exactly. Fill it all in.
4. Add a row to [`INDEX.md`](INDEX.md) in the same commit.
5. If `portfolio-worthy: yes` â€” write the case study version in `portfolio/case-studies/`.

### Adding a mistake
Same flow, but under `mistakes/[domain]/`. Lead `## The Problem` with what I did wrong first.
Mistakes are honest. Write what it cost â€” time, credibility, sleep.

### Adding a pattern or snippet
Drop it in `patterns/snippets/` or `patterns/templates/`. Must work standalone â€” no "see README for setup."

### Monthly
- Update `meta/goals.md` â€” still moving toward them?
- Write `meta/retrospectives/YYYY-MM.md` â€” what worked, what didn't, honest rating.

---

## Structure

```
Dev Learnings/
â”‚
â”œâ”€â”€ START-HERE.md             â† This file. Start here.
â”œâ”€â”€ RULES.md                  â† Entry template + all rules. Read before adding anything.
â”œâ”€â”€ INDEX.md                  â† Living index of every entry. Updated on every commit.
â”‚
â”œâ”€â”€ learnings/                â† One concept, one file. Organized by domain.
â”‚   â”œâ”€â”€ auth/
â”‚   â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ architecture/
â”‚   â”œâ”€â”€ databases/
â”‚   â”œâ”€â”€ security/
â”‚   â”œâ”€â”€ devops/
â”‚   â”œâ”€â”€ ai/
â”‚   â””â”€â”€ tools/
â”‚
â”œâ”€â”€ mistakes/                 â† Separate from learnings. Honest post-mortems.
â”‚   â””â”€â”€ (mirrors learnings/ structure)
â”‚
â”œâ”€â”€ patterns/
â”‚   â”œâ”€â”€ snippets/             â† Drop-in, self-contained code pieces.
â”‚   â””â”€â”€ templates/            â† Full working file templates.
â”‚
â”œâ”€â”€ projects/                 â† Per-project architecture, decisions, and evolution.
â”‚   â””â”€â”€ CircuitIQ/
â”‚
â”œâ”€â”€ portfolio/
â”‚   â”œâ”€â”€ case-studies/         â† Written for an external reader. No assumed context.
â”‚   â””â”€â”€ writeups/             â† Blog-ready technical posts.
â”‚
â””â”€â”€ meta/
    â”œâ”€â”€ goals.md              â† Career direction. Review monthly.
    â”œâ”€â”€ reading-list.md       â† What to consume next.
    â””â”€â”€ retrospectives/       â† Monthly. Named YYYY-MM.md.
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

*Last updated: 2026-11-01*
