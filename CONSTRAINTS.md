# Constraints — Linecard

## Challenge constraints

- One client + one backend from allowed table → **React TS + Node TS**  
- Product data via backend only (not client → Fake Store)  
- Infra AWS-compatible if present (Compose/Redis/Mailpit fine locally)  
- Reviewer runs locally in &lt; 10 minutes (`docker compose up`)  
- No secrets committed; `.env.example` only  
- No paid services/accounts required for reviewers  

## Acceptance checklist

- [ ] Home: 5 featured top-rated  
- [ ] Category: top-rated + additional  
- [ ] Search: matching products only  
- [ ] Product detail page  
- [ ] Enquiry → email + thank-you  

## In scope extras

Auth (demo user), CSRF, Redis, product Ask AI, catalogue RAG (stub default)

## Out of scope

SES/SQS, Postgres/Mongo product DB, OAuth, Bedrock, Playwright E2E, cart/payments, requiring OpenAI/Ollama for reviewers

## AI constraint

`AI_PROVIDER=stub` is default. OpenAI is local-demo only when key is set.
