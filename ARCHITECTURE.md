# Architecture — Linecard

## 1. Overview

Modular monolith: Vite React SPA talks only to Express API. Product data comes from Fake Store via a repository adapter. Redis backs sessions, product cache, rate limits, and RAG vectors. Email and AI are swappable ports.

## 2. Pattern

**Modular monolith** with ports & adapters (hexagonal lite).

## 3. Stack

| Layer | Choice |
|-------|--------|
| Frontend | React + TypeScript (Vite) |
| Backend | Node.js + TypeScript (Express) |
| Catalogue source | Fake Store API |
| Cache / session / RAG index | Redis |
| Email | SMTP → Mailpit (Compose) |
| AI | Stub default; OpenAI when configured |

## 4. Layers

```
routes → services → ports (repository | email | assistant | embeddings)
                         ↑ factories from env
```

## 5. Ports

- `IProductRepository` — `findById`, `findMany`, categories  
- `IEmailSender` — send enquiry mail  
- `IProductAssistant` — answer from product/context  
- `IEmbeddingProvider` — embed text for RAG  
- `IUserRepository` — demo user lookup  

## 6. Key flows

- **Featured:** repo list → sort by rating → top 5  
- **Category:** one `findMany({ category })` → split top-rated vs rest  
- **Search:** `findMany({ q })` server-side  
- **Enquiry:** auth + CSRF → validate → product exists → `enquiry.submitted` → email  
- **Product ask:** load product → assistant  
- **Catalogue RAG:** one catalogue snapshot → embed/store in Redis → top-k → assistant + citations  

## 7. API envelope

`{ success: true, data }` / `{ success: false, error: { code, message } }`

## 8. Scaling notes

- **Catalogue path:** Fake Store is pulled into a Redis/memory snapshot (`products:all`, ~5 min TTL) with single-flight refresh and fetch timeouts. `findMany` / `findById` / categories run against that snapshot; Redis also caches hot query/id responses.
- **Ceiling:** snapshot-in-memory still assumes a small/medium catalogue. A DB-backed `IProductRepository` later pushes filter/sort/limit to the database. RAG vectors later move to OpenSearch/pgvector.
