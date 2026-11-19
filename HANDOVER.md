# Handover — Linecard

## Quick start

```bash
cp .env.example .env
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:5173 |
| API | http://localhost:3001 |
| Mailpit | http://localhost:8025 |
| Redis | localhost:6379 |

Demo login: `demo@linecard.local` / `LinecardDemo1!` (see `.env.example`)

AI defaults to **stub** — no API key required.

## Critical path

1. Open web → see 5 featured products plus the rest of the catalogue under All products  
2. Browse category / search  
3. Open a product  
4. Log in  
5. Ask about product or catalogue  
6. Submit enquiry → thank-you  
7. Confirm email in Mailpit  

## Swapping providers

| Concern | Env |
|---------|-----|
| Email | `EMAIL_PROVIDER=smtp\|console` + SMTP_* |
| AI | `AI_PROVIDER=stub\|openai` + `OPENAI_API_KEY` |
| Product source | repository factory (Fake Store today) |

## RAG reindex

Index rebuilds when Redis key missing/expired, or call internal indexer on catalogue ask cache miss.

## Next day

Postgres product mirror, SES + queue, Bedrock/OpenSearch RAG, OAuth, Playwright E2E.
