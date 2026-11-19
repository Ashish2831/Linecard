# Data Stores — Linecard

## Catalogue source (not a SQL DB)

**Engine:** Fake Store HTTP API  
**Access:** only via `FakeStoreProductRepository`  
**Domain mapping:** external JSON → internal `Product`  

Future: swap to Postgres/CMS repository implementing the same interface.

## Redis

| Key pattern | Purpose | TTL |
|-------------|---------|-----|
| `sess:*` | express-session | session maxAge |
| `products:all` | full catalogue snapshot (shared across instances) | ~5 min |
| `products:id:{id}` | L1 single-product response cache | ~5 min |
| `products:query:{json}` | L1 list response cache | ~5 min |
| `products:categories` | L1 categories response cache | ~5 min |
| `ratelimit:{route}:{id}` | token-bucket state `{ tokens, updatedAt }` | ~2× window |
| `rag:index:v1` | embedding vectors + metadata | ~15 min or rebuild |

## Auth users

In-memory seeded demo user from env (not persisted in Redis/DB for PoC).

## Seed

```
DEMO_USER_EMAIL=demo@linecard.local
DEMO_USER_PASSWORD=LinecardDemo1!
```

## Sensitive data

Passwords: bcrypt hashes only. Session IDs: httpOnly cookies. No PII store beyond enquiry email payload to Mailpit.
