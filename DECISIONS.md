# Decisions — Linecard

## Assumptions

- Featured products = top 5 by `rating.rate` desc, tie-break `rating.count` (Fake Store has no featured flag).  
- Search matches title + description, case-insensitive, server-side only.  
- Category “top rated” vs “additional” share one repository query; IDs never overlap.  
- Demo auth is enough for PoC; browse stays public.  
- Enquiry “sales inbox” = Mailpit locally.  

## Cuts / simplifications

- No SQL product database — Fake Store + Redis. Scalability today = shared `products:all` snapshot (single-flight refresh, TTL), in-memory filter/sort/page, L1 Redis query/id cache, and the swappable `IProductRepository` contract.  
- No OAuth / SES / Bedrock / Playwright.  
- Stub embeddings + stub LLM by default so reviewers need no API keys.  

## Growth beyond PoC

| Today | Tomorrow |
|-------|----------|
| `FakeStoreProductRepository` | Postgres/CMS repository |
| Mailpit SMTP | SES + queue listener on `enquiry.submitted` |
| Redis vector JSON | OpenSearch / pgvector |
| Stub / OpenAI assistants | Bedrock strategy via same ports |
| Demo user store | Real IdP |

## Patterns applied

Repository, Service, Factory, Adapter, Strategy (AI/embeddings), Decorator (Redis cache), Observer (enquiry → email).

## Vibe Coding docs

Adopted Blueprint workflow and a focused doc set (`AGENTS`, `PRD`, `SECURITY`, etc.). Did **not** adopt Next.js/Supabase beginner stack.

## Another day

Product DB mirror, SES, OpenSearch RAG, OAuth, Playwright critical-path E2E, OpenAPI contract.

## Time spent (approx.)

| Phase | Hours |
|-------|-------|
| Planning | 1.5 |
| Building | 3.5 |
| Testing | 0.75 |
| Reviewing / docs | 0.75 |
| **Total** | **~6.5** |
