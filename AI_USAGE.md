# AI usage — Linecard

## Tools and models

- **Cursor** (Composer agent) for planning and implementation  
- Project docs used as agent instructions throughout  

## Agent instruction files (committed)

- `AGENTS.md`  
- `ARCHITECTURE.md`  
- `CODING_STANDARDS.md`  
- `CONSTRAINTS.md`  
- `HANDOVER.md`  
- `PRD.md`  
- `SECURITY.md`  
- `TESTING.md`  
- `DESIGN_SYSTEM.md`  
- `DATA_STORES.md`  

Also referenced: Officeworks challenge PDF, Full-Stack Best Practices PDF, Vibe Coding Blueprint / Guide (process only).

## Plan / spec

Implementation followed the locked Linecard plan: React + Express, Redis sessions/cache/RAG, CSRF auth, Mailpit, stub AI default, ports/adapters.

## Key prompts / moments

1. Extract and interpret the Officeworks acceptance criteria + assessment dimensions.  
2. Map Full-Stack Best Practices selectively (repository/service/CSRF/cache) without boiling the ocean.  
3. Lock Gen AI as ports with stub default so reviewers need no paid keys.  
4. Add Auth/CSRF/Redis/RAG while keeping Compose one-command.  
5. Align Vibe Coding documentation templates with this stack (not Next/Supabase).  

## Where AI was wrong / reviewed

- Early drafts risked calling Fake Store from the client — corrected to repository-only.  
- Over-scoping to full PDF checklist (job queues, batch API) — deferred explicitly in `DECISIONS.md`.  
- `connect-redis` + ioredis mismatch — switched to official `redis` client.  
- Duplicate `/me` route stub in an intermediate auth router draft — fixed before ship.  

All generated code was reviewed for SOLID boundaries, security, and AC coverage.
