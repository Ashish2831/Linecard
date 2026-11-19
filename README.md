# Linecard

Officeworks AI-Native Engineer take-home: a growable product catalogue MVP.

Customers browse and search products, ask grounded questions (product + full-catalogue RAG), and submit sales enquiries. Product data flows through the Express API (Fake Store adapter). Reviewers need **no paid accounts** — AI defaults to stub; email goes to Mailpit.

## Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Client | React + TypeScript (Vite) | Fast local DX, strong typing |
| Backend | Node.js + TypeScript (Express) | Same language; clear ports/adapters |
| Redis | Sessions, cache, rate limits, RAG index | Local, AWS-compatible later |
| Email | SMTP → Mailpit | Free inbox UI for reviewers |
| AI | Stub default (`AI_PROVIDER=stub`) | OpenAI optional for local demos |

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:5173 |
| API | http://localhost:3001/api/health |
| Mailpit | http://localhost:8025 |

**Demo login:** `demo@linecard.local` / `LinecardDemo1!`

## Local development (without rebuilding images)

```bash
# terminal 1 — Redis + Mailpit
docker compose up redis mailpit

# terminal 2 — API
cp .env.example .env
# set REDIS_URL=redis://localhost:6379 and SMTP_HOST=localhost
cd apps/api && npm install && npm run dev

# terminal 3 — Web
cd apps/web && npm install && npm run dev
```

## Tests

```bash
cd apps/api && npm test
cd apps/web && npm test
```

## CSRF note for reviewers

The web client calls `GET /api/auth/csrf` (credentials included) and sends `X-CSRF-Token` on POSTs. Browse is public; login is required for enquire / ask / catalogue ask.

## Project docs

Start at [`AGENTS.md`](AGENTS.md). Also: `PRD.md`, `ARCHITECTURE.md`, `DATA_STORES.md`, `SECURITY.md`, `CODING_STANDARDS.md`, `CONSTRAINTS.md`, `DESIGN_SYSTEM.md`, `TESTING.md`, `HANDOVER.md`, `DECISIONS.md`, `AI_USAGE.md`.
