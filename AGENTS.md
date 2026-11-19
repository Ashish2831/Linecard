# AI Coding Agent Instructions — Linecard

## 1. Project context

Linecard is an Officeworks AI-Native Engineer take-home: React + Express TypeScript product catalogue with Redis sessions/cache, CSRF auth, Mailpit email, stub-default Ask AI and catalogue RAG.

## 2. Source of truth (read in order)

1. `PRD.md`  
2. `ARCHITECTURE.md`  
3. `DATA_STORES.md`  
4. `SECURITY.md`  
5. `CODING_STANDARDS.md`  
6. `CONSTRAINTS.md`  
7. `DESIGN_SYSTEM.md`  
8. `TESTING.md`  
9. `HANDOVER.md`  

Also: `DECISIONS.md`, `AI_USAGE.md`, challenge PDFs under `docs/`.

## 3. Non-negotiables

- Never call Fake Store or LLMs from the React client  
- No Fake Store `fetch` outside `FakeStoreProductRepository`  
- No direct Redis usage in route handlers — use session store, cache decorator, rate-limit helper, RAG indexer  
- Thin routes; business logic in services; depend on interfaces  
- No secrets in git; use `.env.example`  
- `AI_PROVIDER=stub` must work without API keys  
- Brand name is **Linecard**

## 4. Workflow

Plan → implement one task → test → update docs if architecture changed. Do not expand scope beyond `CONSTRAINTS.md`.

## 5. Commands

```bash
docker compose up --build
# API http://localhost:3001  Web http://localhost:5173
# Mailpit http://localhost:8025

cd apps/api && npm test
cd apps/web && npm test
```

## 6. Completion criteria

AC met, critical tests green, Compose boots in under 10 minutes, docs accurate.
