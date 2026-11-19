# Testing — Linecard

## Goals

Protect critical path: featured products, category split, search, enquiry, auth/CSRF, ask, RAG.

## Tools

- API: Vitest  
- Web: Vitest + Testing Library  
- E2E: deferred (Playwright out of scope)

## API coverage

- ProductService: featured length/order; category no ID overlap; search case-insensitive  
- EnquiryService: validation; unknown product; success emails once; email failure  
- Auth: login fail/success; CSRF missing → 403; unauthenticated enquiry → 401  
- Ask + RAG: stub answers; citations; single catalogue fetch (no N+1)

## Web coverage

- Home renders featured tiles (mocked API)  
- Enquiry thank-you after success  
- Ask panel shows answer; anonymous sees login prompt  

## Commands

```bash
cd apps/api && npm test
cd apps/web && npm test
```
