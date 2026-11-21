# RULES

---

## 1. One file per concept

Not one per session, not one per day. One concept = one file. If it's too big, I haven't broken it down enough.

**Filename:** `concept-slug.md` — lowercase, hyphens, no spaces.

Examples: `google-id-token-signin.md`, `cloudflare-worker-jwt-validation.md`

---

## 2. Every entry follows the template — no exceptions

Consistency is the only thing that makes this useful a year from now.

### Frontmatter
```
---
title: ""
date: YYYY-MM-DD
category: auth | frontend | backend | architecture | databases | security | devops | ai | tools
tags: []
project: ProjectName | Personal | General
project-context: "What specifically was I building in that project when I hit this?"
discovered-while: "The specific task/feature that surfaced the issue"
triggered-by: bug | research | code-review | user-feedback | build-error | curiosity
difficulty: beginner | intermediate | advanced
time-to-resolve: "e.g. 2 hours, half a day, 3 days"
status: in-progress | complete
portfolio-worthy: yes | no
source-files: ["path/to/file.js"]   # relative to the project repo root
commit: "short git hash or PR link, if applicable"
---
```

### Sections (in this order)

```markdown
## The Problem
What specific problem or question prompted this. One paragraph. No fluff.

## The Context
What I needed to already know for the solution to make sense.

## The Solution
Exact steps. Reproducible without referencing anything else.

## The Code
Working, copy-pasteable. Language identifier always included.
If conceptual: "N/A — conceptual learning."

## Key Takeaways
3–5 bullet points. Declarative facts. Not observations.

## What NOT to Do
The traps. At least one. More if I fell into multiple.

## Connections
Related entries. References that were actually useful (no filler links).

## Portfolio Notes
How I'd present this in a case study or interview. Honest — not every entry earns this.
```

---

## 3. Domains are fixed

Don't create new top-level folders without updating `START-HERE.md` and `INDEX.md`.

| Domain | Scope |
|---|---|
| `auth` | OAuth, JWT, sessions, SSO, identity |
| `frontend` | HTML, CSS, JS, frameworks, UI patterns |
| `backend` | APIs, serverless, workers, logic |
| `architecture` | System design, service boundaries, data flow |
| `databases` | Schema design, queries, migrations, performance |
| `security` | Secrets, attack vectors, hardening |
| `devops` | Git, CI/CD, infra, deployment |
| `ai` | AI API integration, prompt engineering, agents |
| `tools` | Dev tooling, editors, build tools, automation |

---

## 4. Mistakes live in `mistakes/`, not `learnings/`

A learning = I understood something new.
A mistake = I did something wrong and paid for it.

Mistakes are more honest than learnings. Write what it actually cost — time, credibility, mental energy. That's what makes it stick.

Same structure, same frontmatter. In `## The Problem`, lead with what I did wrong.

---

## 5. `INDEX.md` is updated on every commit

Same commit as the entry. No exceptions.

---

## 6. Patterns are self-contained

Nothing in `patterns/` references another snippet or says "see README for setup." Setup lives in the file.

---

## 7. Portfolio content is written for an external reader

Files in `portfolio/` are not personal notes. Written for someone who knows nothing about me or the project. Zero assumed context.

---

## 8. Meta is reviewed monthly

`meta/goals.md`, `meta/reading-list.md`, `meta/retrospectives/` — not optional. Monthly retro files: `YYYY-MM.md`.

---

## Commit format

```
Add learning: [slug]
Add mistake: [slug]
Add pattern: [slug]
Update: [what and why]
```
