# VO Docs

Auto-generated functional documentation for the Voyage Optimization platform. Updated on every merge to `main` across all 6 service repos. Built with [Astro Starlight](https://starlight.astro.build/).

**Live site**: https://kiran-pk-geo.github.io/vo-docs/

---

## How it works

```
Merge to main (any service repo)
        │
        ▼
GH Actions: update-docs.yml
        │
        ├─ Reads commit range since last run (from .docs-state.json in vo-docs)
        ├─ Updates services/{name}.md via Claude API
        ├─ Extracts VO-XXXX ticket numbers from commit messages
        └─ For each ticket → fetches Jira → updates features/{domain}.md
                │
                ▼
        Pushes to kiran-pk-geo/vo-docs main
                │
                ▼
        vo-docs deploy.yml triggers
                │
                ├─ repair-docs.js (fixes any malformed frontmatter)
                ├─ astro build
                └─ Deploy to GitHub Pages
```

### Two types of docs

| Directory | What | One file per |
|---|---|---|
| `src/content/docs/services/` | What a service does — inputs, outputs, dependencies | Service (6 total) |
| `src/content/docs/features/` | Business feature end-to-end — Jira epic + git context | Domain/epic |

---

## Setup — adding a new service

1. Copy `.github/workflows/update-docs.yml` from `voyage-optimization-api` into the new service repo
2. Change the service name on the last line: `node scripts/update-docs-agent.js auto <service-name>`
3. Copy `scripts/update-docs-agent.js` into the new service repo
4. Run `npm install @anthropic-ai/sdk --save-dev` in the new service repo
5. Add three secrets to the new service repo (Settings → Secrets → Actions):

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Raw key from console.anthropic.com |
| `VO_DOCS_PAT` | Fine-grained PAT with write access to `kiran-pk-geo/vo-docs` |
| `JIRA_API_TOKEN` | `Basic <base64(email:atlassian-api-token)>` — see below |

**Generating JIRA_API_TOKEN:**
```bash
# 1. Create token at: https://id.atlassian.com/manage-profile/security/api-tokens
# 2. Encode it (no newlines):
echo -n 'KiranK@geoserves.com:YOUR_TOKEN' | base64 | tr -d '\n'
# 3. Prefix with "Basic " and save that full string as the secret
```

6. Merge any commit to `main` — first run scans the last 30 commits as a baseline

---

## Running locally

```bash
cd voyage-optimization-api   # or any service repo

export ANTHROPIC_API_KEY="sk-ant-..."
export VO_DOCS_PAT="github_pat_..."
export JIRA_API_TOKEN="Basic $(echo -n 'KiranK@geoserves.com:TOKEN' | base64 | tr -d '\n')"

# Full auto run — same as CI
node scripts/update-docs-agent.js auto api

# Force-update a specific service doc
node scripts/update-docs-agent.js service api

# Create/update a feature doc by name
node scripts/update-docs-agent.js feature route-optimization

# Create feature doc from a Jira epic
node scripts/update-docs-agent.js epic VO-1205

# Update the feature doc for a specific bug/story/task
node scripts/update-docs-agent.js ticket VO-1451
```

---

## State tracking

`src/content/docs/.docs-state.json` tracks the last processed commit SHA per service so each run only processes new commits:

```json
{
  "service:api": { "lastCommit": "abc1234", "updatedAt": "2026-10-13" },
  "service:web": { "lastCommit": "def5678", "updatedAt": "2026-10-12" }
}
```

To force a full re-scan (e.g. after adding a new service):
```bash
SHA=$(gh api repos/kiran-pk-geo/vo-docs/contents/src/content/docs/.docs-state.json --jq '.sha')
gh api repos/kiran-pk-geo/vo-docs/contents/src/content/docs/.docs-state.json \
  --method DELETE --field message="chore: reset docs state" --field sha="$SHA"
```

---

## Branching strategy and ticket extraction

The script uses `git log {lastSha}..HEAD` with `fetch-depth: 0`, so it sees every commit in the range — not just the merge commit.

**If you use merge commits** (feature → QA → UAT → prod preserves history):
- Ticket refs in feature branch commits survive all the way to prod
- Triggering on `main` is enough — the full history is there

**If you use squash merges** (history is collapsed at each promotion):
- Feature commits are gone by the time they reach prod
- The squash commit message is all that survives — it must include the VO-XXXX ref

## API cost estimate

Model: **Claude Sonnet 4.6** — $3.00 / 1M input tokens · $15.00 / 1M output tokens

### Per call

| Operation | Input tokens | Output tokens | Cost |
|---|---|---|---|
| Service doc update | ~2,000 | ~600 | ~$0.015 |
| Feature doc (epic/ticket) | ~2,500 | ~800 | ~$0.020 |

### Monthly projection (based on QA branch logs, May–Sep 2026)

| Service | Merges/month | CI runs | Service doc cost | Est. tickets | Feature doc cost | Total |
|---|---|---|---|---|---|---|
| api | 34 (avg) | 34 | $0.51 | 3 | $0.06 | **$0.57** |
| web | ~20 | 20 | $0.30 | 2 | $0.04 | **$0.34** |
| route-generation | ~5 | 5 | $0.08 | 1 | $0.02 | **$0.10** |
| pdf-consumer | ~5 | 5 | $0.08 | 1 | $0.02 | **$0.10** |
| db-sync | ~3 | 3 | $0.05 | 0 | — | **$0.05** |
| geo-crons | ~3 | 3 | $0.05 | 0 | — | **$0.05** |
| **Total CI** | **~70** | **70** | **$1.07** | **~7** | **$0.14** | **$1.21** |

Add ~10 manual local runs/month: **+$0.15**

> **Estimated total: ~$1.40 / month**

### Scaling notes
- Cost scales linearly with merge frequency
- A high-activity sprint (e.g. 3× normal velocity): ~$4/month
- Feature doc calls (epic/ticket) are slightly more expensive due to Jira context in the prompt
- VO ticket references in commits are growing — as more commits tag tickets, feature doc costs will increase slightly

---

## Repos

| Repo | Purpose |
|---|---|
| `kiran-pk-geo/vo-docs` | This repo — Starlight site, deployed to GitHub Pages |
| `Geoservedmcc/voyage-optimization-api` | Source of `update-docs-agent.js` — copy to other services |

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `No new commits — nothing to do` | State is up to date | Reset state file (see above) or push a new commit |
| `Jira 404` | JIRA_API_TOKEN malformed or has newlines | Regenerate with `\| base64 \| tr -d '\n'`, prefix `Basic ` |
| `title: Required` build error | Malformed frontmatter in a doc | `repair-docs.js` auto-fixes before every build |
| Two deploy workflows running | Pages source still set to "Deploy from branch" | Settings → Pages → Source → GitHub Actions |
| Deploy workflow cancelled | `concurrency: cancel-in-progress: true` — working as intended | Latest commit always wins, no action needed |
| `stripFences is not defined` | Script partially written to disk | Re-copy `update-docs-agent.js` from API repo |
